import { z } from "zod/v4";

const tokenInfoSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  logo: z.string(),
  priceUsd: z.number(),
});

const curatorSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

const platformInfoSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  platformName: z.string(),
  protocolId: z.number(),
  platformId: z.string(),
  logo: z.string(),
  vault: z.string().nullable().optional(),
  type: z.string(),
  redirectionUrl: z.string(),
  curator: curatorSchema.optional(),
});

const rewardBreakdownSchema = z.object({
  apy: z.number(),
  token: tokenInfoSchema,
});

const rateCurrentSchema = z.object({
  base: z.number(),
  reward: z.number(),
  net: z.number(),
  rewardBreakdown: z.array(rewardBreakdownSchema),
});

const rateInfoSchema = z.object({
  current: rateCurrentSchema,
  avg_7d: z.number().nullable(),
  avg_30d: z.number().nullable(),
});

export const marketSchema = z.object({
  token: tokenInfoSchema,
  chainId: z.number(),
  platform: platformInfoSchema,
  supplyRate: rateInfoSchema,
  borrowRate: rateInfoSchema,
  totalSuppliedToken: z.number(),
  totalSuppliedUsd: z.number(),
  supplyCapToken: z.number(),
  remainingSupplyCap: z.number(),
  totalBorrowedToken: z.number(),
  totalBorrowedUsd: z.number(),
  totalLiquidityToken: z.number(),
  totalLiquidityUsd: z.number(),
  borrowCap: z.number(),
  ltv: z.number(),
  lltv: z.number(),
  utilizationRate: z.number(),
  canUseAsCollateral: z.boolean(),
  isBorrowEnabled: z.boolean(),
  collateralExposure: z.array(z.string()),
  collateralTokens: z.array(z.string()),
  merklRewards: z.array(z.unknown()).optional(),
  riskRating: z.unknown(),
});

export const tokenMarketsResponseSchema = z.object({
  markets: z.array(marketSchema),
  total: z.number(),
});

export const supplyCalldataResponseSchema = z.object({
  to: z.string(),
  data: z.string(),
  value: z.string(),
});

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });
