import type {
  Market,
  SupplyCalldataResponse,
  SuperLendClient,
} from "@superlend/sdk";
import { useMutation } from "@tanstack/react-query";
import type { WalletClient } from "../types";

type ExecuteParams = {
  market: Market;
  userAddress: string;
  amount: string;
};

type UseTransactionOptions = {
  client: SuperLendClient;
  walletClient?: WalletClient;
  onAction?: (market: Market, calldata: SupplyCalldataResponse) => void;
};

const useTransaction = ({
  client,
  walletClient,
  onAction,
}: UseTransactionOptions) => {
  const mutation = useMutation({
    mutationFn: async (params: ExecuteParams) => {
      const result = await client.buildSupplyCalldata({
        protocolId: params.market.platform.protocolId,
        platformId: params.market.platform.platformId,
        token: params.market.token.address,
        amount: params.amount,
        userAddress: params.userAddress,
      });

      if (result.isErr()) {
        throw result.error;
      }

      const calldata = result.value;

      if (onAction) {
        onAction(params.market, calldata);
        return calldata;
      }

      if (walletClient) {
        await walletClient.sendTransaction({
          to: calldata.to,
          data: calldata.data,
          value: calldata.value,
          chainId: params.market.chainId,
        });
        return calldata;
      }

      return calldata;
    },
  });

  return {
    execute: mutation.mutate,
    executeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};

export { useTransaction, type ExecuteParams, type UseTransactionOptions };
