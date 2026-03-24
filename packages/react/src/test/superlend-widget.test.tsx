import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { SuperLendWidget } from "../components/superlend-widget";
import { mockMarketsResponse } from "../mocks/handlers";

const BASE_URL = "https://test-api.superlend.xyz";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWidget(props?: Partial<Parameters<typeof SuperLendWidget>[0]>) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SuperLendWidget
        apiKey="test-key"
        tokenAddress="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        amount="10000000"
        chainId={1}
        includeVaults={false}
        baseUrl={BASE_URL}
        {...props}
      />
    </QueryClientProvider>,
  );
}

describe("SuperLendWidget", () => {
  it("displays loading state initially", () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 5_000));
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget();

    expect(document.querySelector(".sl-opportunity-card")).toBeNull();
  });

  it("displays markets after loading", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(screen.getByText("Steakhouse Reservoir USDC")).toBeTruthy();
    });

    expect(screen.getByText("Steakhouse USDC")).toBeTruthy();
    expect(screen.getByText("EVK Vault eUSDC-95")).toBeTruthy();
  });

  it("displays error state on API failure", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return new HttpResponse("Server Error", { status: 500 });
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(screen.getByText("Failed to load opportunities")).toBeTruthy();
    });
  });

  it("displays header with token symbol", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(screen.getByText("USDC Opportunities")).toBeTruthy();
    });
  });

  it("displays powered by footer", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(screen.getByText("SuperLend")).toBeTruthy();
    });
  });

  it("shows empty state when no markets", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json({
          success: true,
          message: "Markets fetched successfully",
          data: { markets: [], total: 0 },
        });
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(screen.getByText("No opportunities available")).toBeTruthy();
    });
  });
  it("displays vaults and markets in one list when enabled", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
      http.post(`${BASE_URL}/sdk/vaults/token`, () => {
        return HttpResponse.json({
          success: true,
          message: "ok",
          data: {
            vaults: [
              {
                token: {
                  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                  name: "USD Coin",
                  symbol: "USDC",
                  decimals: 6,
                  logo: null,
                  priceUsd: 1,
                },
                vaultId: "v1",
                defaultDepositToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                depositTokens: [
                  {
                    type: "DIRECT",
                    token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                  },
                ],
                chainId: 1,
                vault: {
                  name: "Test Vault",
                  symbol: "tvUSDC",
                  decimals: 18,
                  logo: "https://example.com/v.png",
                  type: "LOOP",
                  vaultAddress: "0xvault",
                  description: "d",
                  profile: "p",
                  curator: { name: "c" },
                },
                apy: { base: 1, reward: 1.5, net: 2.5, rewardBreakdown: [] },
              },
            ],
            total: 1,
          },
        });
      }),
    );

    renderWidget({ includeVaults: true });

    await waitFor(() => {
      expect(screen.getByText("Test Vault")).toBeTruthy();
    });
    expect(screen.getByText("Superlend Vaults")).toBeTruthy();
    expect(screen.getByText("Lending Markets")).toBeTruthy();
  });

  it("shows lending markets when vaults are empty", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
      http.post(`${BASE_URL}/sdk/vaults/token`, () => {
        return HttpResponse.json({
          success: true,
          message: "ok",
          data: { vaults: [], total: 0 },
        });
      }),
    );

    renderWidget({ includeVaults: true });

    await waitFor(() => {
      expect(screen.getByText("Steakhouse Reservoir USDC")).toBeTruthy();
    });
  });
});
