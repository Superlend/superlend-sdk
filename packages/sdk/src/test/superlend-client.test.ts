import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { SuperLendClient } from "../superlend-client.js";

const BASE_URL = "https://test-api.superlend.xyz/v1";

const mockMarket = {
  token: {
    address: "0xusdc",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logo: "https://example.com/usdc.png",
    priceUsd: 1.0,
  },
  chainId: 8453,
  platform: {
    name: "aave-v3",
    displayName: "Aave V3",
    platformName: "Aave",
    protocolId: 1,
    platformId: "aave-v3-base",
    logo: "https://example.com/aave.png",
    vault: null,
    type: "lending",
    redirectionUrl: "https://aave.com",
  },
  supplyRate: {
    current: { base: 5.0, reward: 0, net: 5.0, rewardBreakdown: [] },
    avg_7d: null,
    avg_30d: null,
  },
  borrowRate: {
    current: { base: 3.0, reward: 0, net: 3.0, rewardBreakdown: [] },
    avg_7d: null,
    avg_30d: null,
  },
  totalSuppliedToken: 1000,
  totalSuppliedUsd: 1000,
  supplyCapToken: 10000,
  remainingSupplyCap: 9000,
  totalBorrowedToken: 500,
  totalBorrowedUsd: 500,
  totalLiquidityToken: 500,
  totalLiquidityUsd: 500,
  borrowCap: 5000,
  ltv: 0.8,
  lltv: 0.85,
  utilizationRate: 0.5,
  canUseAsCollateral: true,
  isBorrowEnabled: true,
  collateralExposure: [],
  collateralTokens: [],
  riskRating: null,
};

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createClient(overrides?: { timeout?: number; retries?: number }) {
  return new SuperLendClient({
    apiKey: "test-key",
    partnerId: "test-partner",
    baseUrl: BASE_URL,
    ...overrides,
  });
}

describe("SuperLendClient", () => {
  describe("getTokenMarkets", () => {
    it("returns markets on success", async () => {
      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, () => {
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: { markets: [mockMarket], total: 1 },
          });
        }),
      );

      const client = createClient();
      const result = await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.markets).toHaveLength(1);
        expect(result.value.markets[0].platform.displayName).toBe("Aave V3");
      }
    });

    it("sends auth headers", async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: { markets: [], total: 0 },
          });
        }),
      );

      const client = createClient();
      await client.getTokenMarkets({ tokenAddress: "0xusdc", chainId: 8453 });

      expect(capturedHeaders?.get("x-api-key")).toBe("test-key");
      expect(capturedHeaders?.get("x-partner-id")).toBe("test-partner");
    });

    it("sends request body correctly", async () => {
      let capturedBody: unknown;

      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: { markets: [], total: 0 },
          });
        }),
      );

      const client = createClient();
      await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(capturedBody).toEqual({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });
    });
  });

  describe("buildSupplyCalldata", () => {
    it("returns calldata on success", async () => {
      server.use(
        http.post(`${BASE_URL}/sdk/action/supply`, () => {
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: {
              to: "0xabc",
              data: "0x123",
              value: "0",
            },
          });
        }),
      );

      const client = createClient();
      const result = await client.buildSupplyCalldata({
        protocolId: 1,
        platformId: "aave-v3-base",
        token: "0xusdc",
        amount: "1000000",
        userAddress: "0xuser",
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.to).toBe("0xabc");
        expect(result.value.data).toBe("0x123");
      }
    });
  });

  describe("error handling", () => {
    it("returns API_ERROR on non-ok response", async () => {
      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, () => {
          return new HttpResponse("Forbidden", { status: 403 });
        }),
      );

      const client = createClient({ retries: 0 });
      const result = await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("API_ERROR");
        expect(result.error.status).toBe(403);
      }
    });

    it("returns TIMEOUT on request timeout", async () => {
      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 5_000));
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: { markets: [], total: 0 },
          });
        }),
      );

      const client = createClient({ timeout: 50, retries: 0 });
      const result = await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("TIMEOUT");
      }
    });

    it("returns NETWORK_ERROR on fetch failure", async () => {
      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, () => {
          return HttpResponse.error();
        }),
      );

      const client = createClient({ retries: 0 });
      const result = await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("NETWORK_ERROR");
      }
    });

    it("retries on 500 status", async () => {
      let attempts = 0;

      server.use(
        http.post(`${BASE_URL}/sdk/markets/token`, () => {
          attempts++;
          if (attempts < 3) {
            return new HttpResponse("Server Error", { status: 500 });
          }
          return HttpResponse.json({
            success: true,
            message: "ok",
            data: { markets: [mockMarket], total: 1 },
          });
        }),
      );

      const client = createClient({ retries: 2 });
      const result = await client.getTokenMarkets({
        tokenAddress: "0xusdc",
        chainId: 8453,
      });

      expect(attempts).toBe(3);
      expect(result.isOk()).toBe(true);
    });
  });
});
