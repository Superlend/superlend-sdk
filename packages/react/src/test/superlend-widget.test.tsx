import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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

function renderWidget(
  props?: Partial<Parameters<typeof SuperLendWidget>[0]>,
) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SuperLendWidget
        apiKey="test-key"
        tokenAddress="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        amount="10000000"
        chainId={1}
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
      expect(
        screen.getByText("Steakhouse Reservoir USDC"),
      ).toBeTruthy();
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
      expect(
        screen.getByText("Failed to load opportunities"),
      ).toBeTruthy();
    });
  });

  it("displays header with token symbol and amount", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget();

    await waitFor(() => {
      expect(
        screen.getByText("Successfully swapped 10000000 USDC"),
      ).toBeTruthy();
    });

    expect(
      screen.getByText("Let's put them to good use"),
    ).toBeTruthy();
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
      expect(
        screen.getByText("No opportunities available"),
      ).toBeTruthy();
    });
  });

  it("renders compact variant with single market", async () => {
    server.use(
      http.post(`${BASE_URL}/sdk/markets/token`, () => {
        return HttpResponse.json(mockMarketsResponse);
      }),
    );

    renderWidget({ variant: "compact" });

    await waitFor(() => {
      expect(
        screen.getByText("Steakhouse Reservoir USDC"),
      ).toBeTruthy();
    });

    // Compact only shows the first market
    expect(screen.queryByText("Steakhouse USDC")).toBeNull();
    expect(screen.queryByText("EVK Vault eUSDC-95")).toBeNull();
  });
});
