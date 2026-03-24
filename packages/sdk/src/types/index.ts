export type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string | null;
  priceUsd: number | null;
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

/** Raw transaction fields for a single on-chain call. */
export type TransactionData = {
  to: string;
  data: string;
  value: string;
};

/** Raw transaction fields — pass directly to your wallet's `sendTransaction`. */
export type SupplyCalldataResponse = TransactionData & {
  /** If present, an ERC-20 `approve` transaction that must be sent and confirmed before the supply transaction. */
  approval?: TransactionData;
};

/** Curator metadata on vault screener rows. */
export type VaultCuratorInfo = {
  name: string;
  logo?: string;
};

/** APY fields returned for vault screener opportunities (matches aggregator `ApyWithRewards` / vault APY shape). */
export type VaultApyInfo = {
  base: number;
  reward: number;
  /** Total APY (base + reward), same semantics as lending `net`. */
  net: number;
  rewardBreakdown?: RewardBreakdown[];
};

/** On-chain vault metadata from the aggregator vault screener. */
export type VaultOnChainInfo = {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  /** `"FUND"` (earn) or `"LOOP"` in practice. */
  type: string;
  vaultAddress: string;
  description: string;
  profile: string;
  withdrawManager?: string;
  depositManager?: string;
  vaultRouter?: string;
  performanceFee?: number;
  curator: VaultCuratorInfo;
};

/**
 * A Superlend vault opportunity from `getVaultMarkets`.
 * Matches `VaultScreenerResponseDto` from the aggregator API; extra fields are optional for forward compatibility.
 */
export type VaultOpportunity = {
  token: TokenInfo;
  vaultId: string;
  defaultDepositToken: string;
  depositTokens: { type: string; token: string }[];
  chainId: number;
  vault: VaultOnChainInfo;
  apy: VaultApyInfo;
  borrowTokens?: TokenInfo[];
  lendTokens?: TokenInfo[];
  apr?: {
    supply?: number;
    borrow?: number;
  };
  risk?: unknown;
  merklRewards?: unknown[];
  currentLeverage?: number;
  totalSupplied?: number | Record<string, number>;
  totalSuppliedUsd?: number;
  supplyUsdBreakdown?: Record<string, number>;
  totalBorrowed?: number | Record<string, number>;
  totalBorrowedUsd?: number;
  borrowUsdBreakdown?: Record<string, number>;
  vaultBalance?: number;
  vaultBalanceUsd?: number;
  supplyCap?: number;
  remainingSupplyCap?: number;
  totalAssets?: number;
  totalSupply?: number;
  tvmUsd?: number;
};

export type TokenVaultMarketsRequest = {
  chainId: number;
  tokenAddress: string;
};

export type TokenVaultMarketsResponse = {
  vaults: VaultOpportunity[];
  total: number;
};

export type VaultDepositCalldataRequest = {
  vaultId: string;
  /** Raw underlying token amount in smallest units. */
  amount: string;
  userAddress: string;
};

/** Same envelope as supply calldata: deposit tx plus optional ERC-20 approval. */
export type VaultDepositCalldataResponse = SupplyCalldataResponse;

export type HttpErrorCode = "NETWORK_ERROR" | "TIMEOUT" | "ABORT" | "API_ERROR";

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
