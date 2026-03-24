import type {
  SuperLendClient,
  VaultDepositCalldataResponse,
  VaultOpportunity,
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

export type VaultTransactionSteps = {
  switchChain: StepState;
  approval: StepState;
  deposit: StepState & { needed: true };
};

type ExecuteVaultParams = {
  vault: VaultOpportunity;
  userAddress: string;
  amount: string;
};

type UseVaultTransactionOptions = {
  client: SuperLendClient;
  walletClient?: WalletClient;
};

function friendlyError(e: unknown, fallback: string): string {
  const raw = e instanceof Error ? e.message : String(e);
  const lower = raw.toLowerCase();

  if (
    lower.includes("user rejected") ||
    lower.includes("user denied") ||
    lower.includes("rejected the request")
  ) {
    return "Transaction rejected";
  }
  if (
    lower.includes("insufficient funds") ||
    lower.includes("insufficient balance")
  ) {
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

const initialSteps: VaultTransactionSteps = {
  switchChain: { status: "idle", needed: false },
  approval: { status: "idle", needed: false },
  deposit: { status: "idle", needed: true },
};

const useVaultTransaction = ({
  client,
  walletClient,
}: UseVaultTransactionOptions) => {
  const [steps, setSteps] = useState<VaultTransactionSteps>(initialSteps);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<ExecuteVaultParams | null>(null);
  const completedStepsRef = useRef<Set<string>>(new Set());

  const updateStep = useCallback(
    (step: keyof VaultTransactionSteps, update: Partial<StepState>) => {
      setSteps((prev) => ({
        ...prev,
        [step]: { ...prev[step], ...update },
      }));
    },
    [],
  );

  const execute = useCallback(
    async (params: ExecuteVaultParams) => {
      lastParamsRef.current = params;
      setIsPending(true);
      setIsSuccess(false);
      setError(null);

      const needsChainSwitch =
        !!walletClient?.switchChain &&
        walletClient.chainId !== undefined &&
        walletClient.chainId !== params.vault.chainId;

      setSteps({
        switchChain: {
          status: completedStepsRef.current.has("switchChain")
            ? "success"
            : "idle",
          needed: needsChainSwitch,
        },
        approval: { status: "idle", needed: false },
        deposit: { status: "idle", needed: true },
      });

      try {
        if (needsChainSwitch && !completedStepsRef.current.has("switchChain")) {
          updateStep("switchChain", { status: "pending" });
          try {
            await walletClient?.switchChain?.(params.vault.chainId);
            updateStep("switchChain", { status: "success" });
            completedStepsRef.current.add("switchChain");
          } catch (e) {
            const msg = friendlyError(e, "Failed to switch network");
            updateStep("switchChain", { status: "error", error: msg });
            setError(msg);
            setIsPending(false);
            return;
          }
        } else if (
          needsChainSwitch &&
          completedStepsRef.current.has("switchChain")
        ) {
          updateStep("switchChain", { status: "success" });
        }

        const result = await client.buildVaultDepositCalldata({
          vaultId: params.vault.vaultId,
          amount: params.amount,
          userAddress: params.userAddress,
        });

        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const calldata = result.value;

        const needsApproval = await resolveVaultApprovalNeeded({
          walletClient: walletClient as NonNullable<typeof walletClient>,
          calldata,
          tokenAddress: params.vault.token.address,
          userAddress: params.userAddress,
          spender: calldata.to,
          amount: params.amount,
        });

        setSteps((prev) => ({
          ...prev,
          approval: {
            status: completedStepsRef.current.has("approval")
              ? "success"
              : "idle",
            needed: needsApproval,
          },
        }));

        if (needsApproval && !completedStepsRef.current.has("approval")) {
          updateStep("approval", { status: "pending" });
          try {
            const approvalData =
              calldata.approval ??
              encodeApproveCalldata(
                params.vault.token.address,
                calldata.to,
                params.amount,
              );

            await walletClient?.sendTransaction({
              to: approvalData.to,
              data: approvalData.data,
              value: approvalData.value,
              chainId: params.vault.chainId,
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

        if (!completedStepsRef.current.has("deposit")) {
          updateStep("deposit", { status: "pending" });
          try {
            await walletClient?.sendTransaction({
              to: calldata.to,
              data: calldata.data,
              value: calldata.value,
              chainId: params.vault.chainId,
            });
            updateStep("deposit", { status: "success" });
            completedStepsRef.current.add("deposit");
          } catch (e) {
            const msg = friendlyError(e, "Deposit transaction failed");
            updateStep("deposit", { status: "error", error: msg });
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
    [client, walletClient, updateStep],
  );

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      void execute(lastParamsRef.current);
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

async function resolveVaultApprovalNeeded(params: {
  walletClient: WalletClient;
  calldata: VaultDepositCalldataResponse;
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
  type ExecuteVaultParams,
  type StepState,
  type StepStatus,
  useVaultTransaction,
  type UseVaultTransactionOptions,
};
