import type { OverviewResponse, SuperLendClient } from "@superlend/sdk";
import { useQuery } from "@tanstack/react-query";

type UseOverviewParams = {
  tokenAddress: string;
  chainId: number;
};

/** Fetches a high-level overview of available opportunities for the given token and chain. */
const useOverview = (client: SuperLendClient, params: UseOverviewParams) => {
  return useQuery<OverviewResponse>({
    queryKey: ["superlend", "overview", params.tokenAddress, params.chainId],
    queryFn: async () => {
      const result = await client.getOverview({
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

export { type UseOverviewParams, useOverview };
