import type { ResultAsync } from "neverthrow";
import { request } from "./lib/request.utils";
import {
  apiResponseSchema,
  supplyCalldataResponseSchema,
  tokenMarketsResponseSchema,
} from "./schemas/api.schemas";
import { SDK_DEFAULT_BASE_URL } from "./sdk.constants";
import type {
  ClientConfig,
  HttpError,
  SupplyCalldataRequest,
  SupplyCalldataResponse,
  TokenMarketsRequest,
  TokenMarketsResponse,
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

  getTokenMarkets(
    params: TokenMarketsRequest,
  ): ResultAsync<TokenMarketsResponse, HttpError> {
    return request(
      `${this.baseUrl}/sdk/markets/token`,
      apiResponseSchema(tokenMarketsResponseSchema),
      {
        method: "POST",
        body: params as unknown as Record<string, unknown>,
        headers: this.headers,
        timeout: this.timeout,
        retries: this.retries,
      },
    ).map((res) => res.data);
  }

  buildSupplyCalldata(
    params: SupplyCalldataRequest,
  ): ResultAsync<SupplyCalldataResponse, HttpError> {
    return request(
      `${this.baseUrl}/sdk/action/supply`,
      apiResponseSchema(supplyCalldataResponseSchema),
      {
        method: "POST",
        body: params as unknown as Record<string, unknown>,
        headers: this.headers,
        timeout: this.timeout,
        retries: this.retries,
      },
    ).map((res) => res.data);
  }
}
