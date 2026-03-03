import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { SuperLendClient } from "../superlend-client.js";

const BASE_URL = "https://test-api.superlend.xyz/v1";

const mockOpportunity = {
  id: "opp-1",
  protocol: "Aave",
  chainId: 8453,
  token: "USDC",
  action: "lend" as const,
  apy: 8.5,
  tvl: 1_000_000,
  metadata: {},
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
  describe("getOpportunities", () => {
    it("returns opportunities on success", async () => {
      server.use(
        http.get(`${BASE_URL}/opportunities`, () => {
          return HttpResponse.json({
            opportunities: [mockOpportunity],
          });
        }),
      );

      const client = createClient();
      const result = await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.opportunities).toHaveLength(1);
        expect(result.value.opportunities[0].protocol).toBe("Aave");
      }
    });

    it("sends auth headers", async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        http.get(`${BASE_URL}/opportunities`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ opportunities: [] });
        }),
      );

      const client = createClient();
      await client.getOpportunities({ token: "USDC", chainId: 8453 });

      expect(capturedHeaders?.get("x-api-key")).toBe("test-key");
      expect(capturedHeaders?.get("x-partner-id")).toBe("test-partner");
    });

    it("passes query parameters correctly", async () => {
      let capturedUrl = "";

      server.use(
        http.get(`${BASE_URL}/opportunities`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({ opportunities: [] });
        }),
      );

      const client = createClient();
      await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
        actions: ["lend", "loop"],
        limit: 5,
      });

      const url = new URL(capturedUrl);
      expect(url.searchParams.get("token")).toBe("USDC");
      expect(url.searchParams.get("chainId")).toBe("8453");
      expect(url.searchParams.get("actions")).toBe("lend,loop");
      expect(url.searchParams.get("limit")).toBe("5");
    });
  });

  describe("getCalldata", () => {
    it("returns calldata on success", async () => {
      server.use(
        http.post(`${BASE_URL}/calldata`, () => {
          return HttpResponse.json({
            to: "0xabc",
            data: "0x123",
            value: "0",
            chainId: 8453,
          });
        }),
      );

      const client = createClient();
      const result = await client.getCalldata({
        opportunityId: "opp-1",
        userAddress: "0xuser",
        amount: "1000000",
        token: "USDC",
        chainId: 8453,
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.to).toBe("0xabc");
        expect(result.value.data).toBe("0x123");
      }
    });
  });

  describe("getSupportedChains", () => {
    it("returns chains on success", async () => {
      server.use(
        http.get(`${BASE_URL}/supported-chains`, () => {
          return HttpResponse.json([
            { chainId: 8453, name: "Base" },
            { chainId: 1, name: "Ethereum" },
          ]);
        }),
      );

      const client = createClient();
      const result = await client.getSupportedChains();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe("Base");
      }
    });
  });

  describe("getSupportedTokens", () => {
    it("returns tokens for a chain", async () => {
      server.use(
        http.get(`${BASE_URL}/supported-tokens`, () => {
          return HttpResponse.json([
            {
              address: "0xusdc",
              symbol: "USDC",
              decimals: 6,
              chainId: 8453,
            },
          ]);
        }),
      );

      const client = createClient();
      const result = await client.getSupportedTokens(8453);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value[0].symbol).toBe("USDC");
      }
    });
  });

  describe("error handling", () => {
    it("returns API_ERROR on non-ok response", async () => {
      server.use(
        http.get(`${BASE_URL}/opportunities`, () => {
          return new HttpResponse("Forbidden", { status: 403 });
        }),
      );

      const client = createClient({ retries: 0 });
      const result = await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("API_ERROR");
        expect(result.error.status).toBe(403);
      }
    });

    it("returns VALIDATION_ERROR on invalid response shape", async () => {
      server.use(
        http.get(`${BASE_URL}/opportunities`, () => {
          return HttpResponse.json({ invalid: "shape" });
        }),
      );

      const client = createClient({ retries: 0 });
      const result = await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("returns TIMEOUT on request timeout", async () => {
      server.use(
        http.get(`${BASE_URL}/opportunities`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 5_000));
          return HttpResponse.json({ opportunities: [] });
        }),
      );

      const client = createClient({ timeout: 50, retries: 0 });
      const result = await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("TIMEOUT");
      }
    });

    it("returns NETWORK_ERROR on fetch failure", async () => {
      server.use(
        http.get(`${BASE_URL}/opportunities`, () => {
          return HttpResponse.error();
        }),
      );

      const client = createClient({ retries: 0 });
      const result = await client.getOpportunities({
        token: "USDC",
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
        http.get(`${BASE_URL}/opportunities`, () => {
          attempts++;
          if (attempts < 3) {
            return new HttpResponse("Server Error", { status: 500 });
          }
          return HttpResponse.json({ opportunities: [mockOpportunity] });
        }),
      );

      const client = createClient({ retries: 2 });
      const result = await client.getOpportunities({
        token: "USDC",
        chainId: 8453,
      });

      expect(attempts).toBe(3);
      expect(result.isOk()).toBe(true);
    });
  });
});
