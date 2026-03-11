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

/**
 * Headless client for the SuperLend API.
 *
 * All methods return `ResultAsync` — errors are typed and explicit, nothing is thrown.
 *
 * @example
 * const client = new SuperLendClient({ apiKey: 'your_key' })
 * const result = await client.getTokenMarkets({ tokenAddress: '0x...', chainId: 1 })
 * result.match(
 *   (data) => console.log(data.markets),
 *   (err) => console.error(err.code, err.message),
 * )
 */
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

  /**
   * Returns lending markets available for a token on a given chain,
   * sorted by supply APY descending.
   */
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

  /**
   * Builds the calldata required to supply tokens into a market.
   * Returns raw `to`, `data`, and `value` — pass directly to your wallet for execution.
   */
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
