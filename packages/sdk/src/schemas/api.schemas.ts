import { z } from "zod/v4";

export const opportunitySchema = z.object({
  id: z.string(),
  protocol: z.string(),
  chainId: z.number(),
  token: z.string(),
  action: z.enum(["lend", "loop"]),
  apy: z.number(),
  tvl: z.number(),
  metadata: z.record(z.string(), z.unknown()),
});

export const opportunitiesResponseSchema = z.object({
  opportunities: z.array(opportunitySchema),
});

export const calldataResponseSchema = z.object({
  to: z.string(),
  data: z.string(),
  value: z.string(),
  chainId: z.number(),
});

export const supportedChainsSchema = z.array(
  z.object({
    chainId: z.number(),
    name: z.string(),
  }),
);

export const supportedTokensSchema = z.array(
  z.object({
    address: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    chainId: z.number(),
  }),
);
