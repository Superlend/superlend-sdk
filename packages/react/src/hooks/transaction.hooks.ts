import type {
  Market,
  SupplyCalldataResponse,
  SuperLendClient,
} from "@superlend/sdk";
import { useCallback, useRef, useState } from "react";
import type { WalletClient } from "../types";
import { encodeApproveCalldata } from "../utils/erc20";

type StepStatus = "idle" | "pending" | "success" | "error";

type StepState = {
  status: StepStatus;
  error?: string;
  needed: boolean;
};

type TransactionSteps = {
  switchChain: StepState;
  approval: StepState;
  supply: StepState & { needed: true };
};

type ExecuteParams = {
  market: Market;
  userAddress: string;
  amount: string;
};

type UseTransactionOptions = {
  client: SuperLendClient;
  walletClient?: WalletClient;
};

/**
 * Maps raw wallet/provider errors to short, user-friendly messages.
 */
function friendlyError(e: unknown, fallback: string): string {
  const raw = e instanceof Error ? e.message : String(e);
  const lower = raw.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("user denied") || lower.includes("rejected the request")) {
    return "Transaction rejected";
  }
  if (lower.includes("insufficient funds") || lower.includes("insufficient balance")) {
    return "Insufficient funds";
  }
  if (lower.includes("nonce")) {
    return "Nonce error — please reset your wallet or try again";
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "Request timed out";
  }
  if (lower.includes("chain mismatch") || lower.includes("does not match")) {
    return "Wrong network — please switch chains and retry";
  }
  if (lower.includes("execution reverted")) {
    return "Transaction reverted on-chain";
  }

  return fallback;
}

const initialSteps: TransactionSteps = {
  switchChain: { status: "idle", needed: false },
  approval: { status: "idle", needed: false },
  supply: { status: "idle", needed: true },
};

const useTransaction = ({
  client,
  walletClient,
}: UseTransactionOptions) => {
  const [steps, setSteps] = useState<TransactionSteps>(initialSteps);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store the last params so retry can re-use them
  const lastParamsRef = useRef<ExecuteParams | null>(null);
  // Track which steps already succeeded for retry
  const completedStepsRef = useRef<Set<string>>(new Set());

  const updateStep = (
    step: keyof TransactionSteps,
    update: Partial<StepState>,
  ) => {
    setSteps((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...update },
    }));
  };

  const execute = useCallback(
    async (params: ExecuteParams) => {
      lastParamsRef.current = params;
      setIsPending(true);
      setIsSuccess(false);
      setError(null);

      // Determine what's needed
      const needsChainSwitch =
        !!walletClient?.switchChain &&
        walletClient.chainId !== undefined &&
        walletClient.chainId !== params.market.chainId;

      setSteps({
        switchChain: {
          status: completedStepsRef.current.has("switchChain") ? "success" : needsChainSwitch ? "idle" : "idle",
          needed: needsChainSwitch,
        },
        approval: { status: "idle", needed: false }, // determined after calldata
        supply: { status: "idle", needed: true },
      });

      try {
        // Step 1: Switch chain if needed
        if (needsChainSwitch && !completedStepsRef.current.has("switchChain")) {
          updateStep("switchChain", { status: "pending" });
          try {
            await walletClient!.switchChain!(params.market.chainId);
            updateStep("switchChain", { status: "success" });
            completedStepsRef.current.add("switchChain");
          } catch (e) {
            const msg = friendlyError(e, "Failed to switch network");
            updateStep("switchChain", { status: "error", error: msg });
            setError(msg);
            setIsPending(false);
            return;
          }
        } else if (needsChainSwitch && completedStepsRef.current.has("switchChain")) {
          updateStep("switchChain", { status: "success" });
        }

        // Build calldata
        const result = await client.buildSupplyCalldata({
          protocolId: params.market.platform.protocolId,
          platformId: params.market.platform.platformId,
          token: params.market.token.address,
          amount: params.amount,
          userAddress: params.userAddress,
        });

        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const calldata = result.value;

        // Step 2: Approval if needed
        const needsApproval = await resolveApprovalNeeded({
          walletClient: walletClient!,
          calldata,
          tokenAddress: params.market.token.address,
          userAddress: params.userAddress,
          spender: calldata.to,
          amount: params.amount,
        });

        setSteps((prev) => ({
          ...prev,
          approval: {
            status: completedStepsRef.current.has("approval") ? "success" : "idle",
            needed: needsApproval,
          },
        }));

        if (needsApproval && !completedStepsRef.current.has("approval")) {
          updateStep("approval", { status: "pending" });
          try {
            const approvalData =
              calldata.approval ??
              encodeApproveCalldata(params.market.token.address, calldata.to, params.amount);

            await walletClient!.sendTransaction({
              to: approvalData.to,
              data: approvalData.data,
              value: approvalData.value,
              chainId: params.market.chainId,
            });
            updateStep("approval", { status: "success" });
            completedStepsRef.current.add("approval");
          } catch (e) {
            const msg = friendlyError(e, "Approval failed");
            updateStep("approval", { status: "error", error: msg });
            setError(msg);
            setIsPending(false);
            return;
          }
        }

        // Step 3: Supply
        if (!completedStepsRef.current.has("supply")) {
          updateStep("supply", { status: "pending" });
          try {
            await walletClient!.sendTransaction({
              to: calldata.to,
              data: calldata.data,
              value: calldata.value,
              chainId: params.market.chainId,
            });
            updateStep("supply", { status: "success" });
            completedStepsRef.current.add("supply");
          } catch (e) {
            const msg = friendlyError(e, "Supply transaction failed");
            updateStep("supply", { status: "error", error: msg });
            setError(msg);
            setIsPending(false);
            return;
          }
        }

        setIsSuccess(true);
        setIsPending(false);
      } catch (e) {
        const msg = friendlyError(e, "Transaction failed");
        setError(msg);
        setIsPending(false);
      }
    },
    [client, walletClient],
  );

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      execute(lastParamsRef.current);
    }
  }, [execute]);

  const reset = useCallback(() => {
    setSteps(initialSteps);
    setIsPending(false);
    setIsSuccess(false);
    setError(null);
    lastParamsRef.current = null;
    completedStepsRef.current = new Set();
  }, []);

  return {
    execute,
    retry,
    reset,
    steps,
    isPending,
    isSuccess,
    error,
  };
};

async function resolveApprovalNeeded(params: {
  walletClient: WalletClient;
  calldata: SupplyCalldataResponse;
  tokenAddress: string;
  userAddress: string;
  spender: string;
  amount: string;
}): Promise<boolean> {
  if (params.calldata.approval) return true;

  if (params.walletClient.getAllowance) {
    try {
      const allowance = await params.walletClient.getAllowance({
        tokenAddress: params.tokenAddress,
        owner: params.userAddress,
        spender: params.spender,
      });
      return allowance < BigInt(params.amount);
    } catch {
      return true;
    }
  }

  return true;
}

export {
  useTransaction,
  type ExecuteParams,
  type UseTransactionOptions,
  type TransactionSteps,
  type StepStatus,
  type StepState,
};
