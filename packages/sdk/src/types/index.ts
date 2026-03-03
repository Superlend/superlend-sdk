export type ActionType = "lend" | "loop";

export type Opportunity = {
  id: string;
  protocol: string;
  chainId: number;
  token: string;
  action: ActionType;
  apy: number;
  tvl: number;
  metadata: Record<string, unknown>;
};

export type OpportunitiesRequest = {
  token: string;
  chainId: number;
  actions?: ActionType[];
  limit?: number;
};

export type OpportunitiesResponse = {
  opportunities: Opportunity[];
};

export type CalldataRequest = {
  opportunityId: string;
  userAddress: string;
  amount: string;
  token: string;
  chainId: number;
};

export type CalldataResponse = {
  to: string;
  data: string;
  value: string;
  chainId: number;
};

export type SupportedChain = {
  chainId: number;
  name: string;
};

export type SupportedToken = {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
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
