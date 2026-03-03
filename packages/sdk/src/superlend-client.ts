import type { ResultAsync } from "neverthrow";
import { request } from "./lib/request.utils";
import {
  calldataResponseSchema,
  opportunitiesResponseSchema,
  supportedChainsSchema,
  supportedTokensSchema,
} from "./schemas/api.schemas";
import { SDK_DEFAULT_BASE_URL } from "./sdk.constants";
import type {
  CalldataRequest,
  CalldataResponse,
  ClientConfig,
  HttpError,
  OpportunitiesRequest,
  OpportunitiesResponse,
  SupportedChain,
  SupportedToken,
} from "./types";

export class SuperLendClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly partnerId?: string;
  private readonly timeout?: number;
  private readonly retries?: number;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl ?? SDK_DEFAULT_BASE_URL;
    this.apiKey = config.apiKey;
    this.partnerId = config.partnerId;
    this.timeout = config.timeout;
    this.retries = config.retries;
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      "x-api-key": this.apiKey,
    };
    if (this.partnerId) {
      h["x-partner-id"] = this.partnerId;
    }
    return h;
  }

  getOpportunities(
    params: OpportunitiesRequest,
  ): ResultAsync<OpportunitiesResponse, HttpError> {
    const searchParams = new URLSearchParams({
      token: params.token,
      chainId: String(params.chainId),
    });
    if (params.actions) {
      searchParams.set("actions", params.actions.join(","));
    }
    if (params.limit !== undefined) {
      searchParams.set("limit", String(params.limit));
    }

    return request(
      `${this.baseUrl}/opportunities?${searchParams.toString()}`,
      opportunitiesResponseSchema,
      {
        headers: this.headers,
        timeout: this.timeout,
        retries: this.retries,
      },
    );
  }

  getCalldata(
    params: CalldataRequest,
  ): ResultAsync<CalldataResponse, HttpError> {
    return request(`${this.baseUrl}/calldata`, calldataResponseSchema, {
      method: "POST",
      body: params,
      headers: this.headers,
      timeout: this.timeout,
      retries: this.retries,
    });
  }

  getSupportedChains(): ResultAsync<SupportedChain[], HttpError> {
    return request(`${this.baseUrl}/supported-chains`, supportedChainsSchema, {
      headers: this.headers,
      timeout: this.timeout,
      retries: this.retries,
    });
  }

  getSupportedTokens(
    chainId: number,
  ): ResultAsync<SupportedToken[], HttpError> {
    const searchParams = new URLSearchParams({
      chainId: String(chainId),
    });
    return request(
      `${this.baseUrl}/supported-tokens?${searchParams.toString()}`,
      supportedTokensSchema,
      {
        headers: this.headers,
        timeout: this.timeout,
        retries: this.retries,
      },
    );
  }
}
