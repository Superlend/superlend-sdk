import type {
  PortfolioRequest,
  PortfolioResponse,
  SuperLendClient,
} from "@superlend/sdk";
import { useQuery } from "@tanstack/react-query";

type UsePortfolioParams = Omit<PortfolioRequest, "userAddress"> & {
  userAddress: string | undefined;
};

/** Fetches and caches the user's portfolio positions. */
const usePortfolio = (client: SuperLendClient, params: UsePortfolioParams) => {
  return useQuery<PortfolioResponse>({
    queryKey: [
      "superlend",
      "portfolio",
      params.userAddress,
      params.chainIds,
      params.types,
      params.marketIds,
    ],
    queryFn: async () => {
      const result = await client.getPortfolio({
        userAddress: params.userAddress!,
        chainIds: params.chainIds,
        types: params.types,
        marketIds: params.marketIds,
      });
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    enabled: !!params.userAddress,
  });
};

export { type UsePortfolioParams, usePortfolio };
