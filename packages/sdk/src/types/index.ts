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
  /** Base + reward combined. */
  net: number;
  rewardBreakdown: RewardBreakdown[];
};

export type RateInfo = {
  current: RateCurrent;
  avg_7d: number | null;
  avg_30d: number | null;
};

/** A single lending market opportunity returned by `getTokenMarkets`. */
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
  /** Loan-to-value ratio. */
  ltv: number;
  /** Liquidation LTV. */
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
  /** Raw token amount in the token's smallest unit. */
  amount: string;
  userAddress: string;
};

/** Raw transaction fields — pass directly to your wallet's `sendTransaction`. */
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

/** Typed error returned by all `SuperLendClient` methods. Never thrown — always in the `Err` branch. */
export type HttpError = {
  code: HttpErrorCode;
  message: string;
  /** HTTP status code, present when `code` is `API_ERROR`. */
  status?: number;
};

export type ClientConfig = {
  /** API key issued by SuperLend. Required. */
  apiKey: string;
  /** Partner identifier for attribution. */
  partnerId?: string;
  /** Override the API base URL. Defaults to the SuperLend production endpoint. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 10 000. */
  timeout?: number;
  /** Number of retries on failure. Defaults to 2. */
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
