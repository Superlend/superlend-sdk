import type { SuperLendClient, TokenVaultMarketsResponse } from "@superlend/sdk";
import { useQuery } from "@tanstack/react-query";

type UseVaultMarketsParams = {
  tokenAddress: string;
  chainId: number;
  enabled?: boolean;
};

/** Fetches and caches Superlend vault opportunities for the given token and chain. */
const useVaultMarkets = (client: SuperLendClient, params: UseVaultMarketsParams) => {
  return useQuery<TokenVaultMarketsResponse>({
    queryKey: ["superlend", "vaults", params.tokenAddress, params.chainId],
    queryFn: async () => {
      const result = await client.getVaultMarkets({
        tokenAddress: params.tokenAddress,
        chainId: params.chainId,
      });
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    enabled: params.enabled ?? true,
  });
};

export { type UseVaultMarketsParams, useVaultMarkets };
