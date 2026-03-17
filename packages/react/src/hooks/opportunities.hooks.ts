import type { SuperLendClient, TokenMarketsResponse } from "@superlend/sdk";
import { useQuery } from "@tanstack/react-query";

type UseMarketsParams = {
  tokenAddress: string;
  chainId: number;
  limit?: number;
};

/** Fetches and caches lending markets for the given token and chain. */
const useMarkets = (client: SuperLendClient, params: UseMarketsParams) => {
  return useQuery<TokenMarketsResponse>({
    queryKey: ["superlend", "markets", params.tokenAddress, params.chainId],
    queryFn: async () => {
      const result = await client.getTokenMarkets({
        tokenAddress: params.tokenAddress,
        chainId: params.chainId,
      });
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
  });
};

export { type UseMarketsParams, useMarkets };
