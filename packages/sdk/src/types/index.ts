export type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  priceUsd: number;
};

export type CuratorInfo = {
  name: string;
  logo: string;
};

export type PlatformInfo = {
  name: string;
  displayName: string;
  platformName: string;
  protocolId: number;
  platformId: string;
  logo: string;
  vault?: string | null;
  type: string;
  redirectionUrl: string;
  curator?: CuratorInfo;
};

export type RewardBreakdown = {
  apy: number;
  token: TokenInfo;
};

export type RateCurrent = {
  base: number;
  reward: number;
  net: number;
  rewardBreakdown: RewardBreakdown[];
};

export type RateInfo = {
  current: RateCurrent;
  avg_7d: number | null;
  avg_30d: number | null;
};

export type Market = {
  token: TokenInfo;
  chainId: number;
  platform: PlatformInfo;
  supplyRate: RateInfo;
  borrowRate: RateInfo;
  totalSuppliedToken: number;
  totalSuppliedUsd: number;
  supplyCapToken: number;
  remainingSupplyCap: number;
  totalBorrowedToken: number;
  totalBorrowedUsd: number;
  totalLiquidityToken: number;
  totalLiquidityUsd: number;
  borrowCap: number;
  ltv: number;
  lltv: number;
  utilizationRate: number;
  canUseAsCollateral: boolean;
  isBorrowEnabled: boolean;
  collateralExposure: string[];
  collateralTokens: string[];
  merklRewards?: unknown[];
  riskRating: unknown;
};

export type TokenMarketsRequest = {
  chainId: number;
  tokenAddress: string;
};

export type TokenMarketsResponse = {
  markets: Market[];
  total: number;
};

export type SupplyCalldataRequest = {
  protocolId: number;
  platformId: string;
  token: string;
  amount: string;
  userAddress: string;
};

export type SupplyCalldataResponse = {
  to: string;
  data: string;
  value: string;
};

export type HttpErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "ABORT"
  | "API_ERROR"
  | "VALIDATION_ERROR";

export type HttpError = {
  code: HttpErrorCode;
  message: string;
  status?: number;
};

export type ClientConfig = {
  apiKey: string;
  partnerId?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
};

export type RequestOptions = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
