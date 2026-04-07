import type { OverviewCategory } from "@superlend/sdk";
import { SuperLendClient } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { resolveTheme, ThemeContext, useTheme } from "../context/theme.context";
import { useOverview } from "../hooks/overview.hooks";
import { injectStyles } from "../styles/inject.utils";
import type {
  ThemeConfig,
  WalletClient,
  WidgetCalldata,
  WidgetOpportunity,
  WidgetVariant,
} from "../types";
import { PortfolioWidget } from "./portfolio-widget";
import { PoweredBy } from "./powered-by";
import { SuperLendWidget } from "./superlend-widget";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

type ViewId = "index" | "opportunities" | "vaults" | "portfolio";

export type OverviewWidgetProps = {
  /** API key issued by SuperLend. */
  apiKey: string;
  /** ERC-20 token address for lending opportunities. */
  tokenAddress: string;
  /** Raw token amount. Pre-fills the amount input. */
  initialAmount?: string;
  chainId: number;
  /** Connected wallet address. */
  userAddress?: string;
  /** Widget variant for the aggregator sub-view. */
  variant?: WidgetVariant;
  theme?: ThemeConfig;
  walletClient?: WalletClient;
  onAction?: (opportunity: WidgetOpportunity, calldata: WidgetCalldata) => void;
  onConnectWallet?: () => void;
  partnerId?: string;
  /** Maximum number of market opportunities to display. */
  limit?: number;
  /** Override the API base URL. */
  baseUrl?: string;
};

function formatApy(apy: number): string {
  return `${apy.toFixed(2)}%`;
}

const CategoryCard: React.FC<{
  label: string;
  description: string;
  category: OverviewCategory;
  onClick: () => void;
}> = ({ label, description, category, onClick }) => {
  const theme = useTheme();

  const cardStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    color: theme.text,
    fontFamily: "inherit",
    fontSize: "0.875rem",
    transition: "background 150ms ease",
  };

  return (
    <button
      type="button"
      className="sl-opportunity-card"
      style={cardStyle}
      onClick={onClick}
    >
      <div>
        <div
          style={{ fontSize: "0.8125rem", fontWeight: 600, color: theme.text }}
        >
          {label}
        </div>
        <div style={{ fontSize: "0.6875rem", color: `${theme.text}99` }}>
          {description}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: theme.primary,
          }}
        >
          upto {formatApy(category.topApy)}
        </div>
        <div style={{ fontSize: "0.6875rem", color: `${theme.text}99` }}>
          {category.total}{" "}
          {category.total === 1 ? "opportunity" : "opportunities"}
        </div>
      </div>
    </button>
  );
};

const OverviewContent: React.FC<
  OverviewWidgetProps & { client: SuperLendClient }
> = (props) => {
  const { client } = props;
  const theme = useTheme();
  const [view, setView] = useState<ViewId>("index");

  const { data: overview, isLoading } = useOverview(client, {
    tokenAddress: props.tokenAddress,
    chainId: props.chainId,
  });

  const hasOpportunities =
    overview?.opportunities != null && overview.opportunities.total > 0;
  const hasVaults = overview?.vaults != null && overview.vaults.total > 0;
  const hasWallet = !!props.userAddress;

  if (view === "opportunities") {
    return (
      <SuperLendWidget
        apiKey={props.apiKey}
        tokenAddress={props.tokenAddress}
        initialAmount={props.initialAmount}
        chainId={props.chainId}
        userAddress={props.userAddress}
        variant={props.variant}
        baseUrl={props.baseUrl}
        walletClient={props.walletClient}
        onAction={props.onAction}
        onConnectWallet={props.onConnectWallet}
        onBack={() => setView("index")}
        partnerId={props.partnerId}
        limit={props.limit}
        theme={props.theme}
      />
    );
  }

  if (view === "portfolio") {
    return (
      <PortfolioWidget
        apiKey={props.apiKey}
        userAddress={props.userAddress}
        baseUrl={props.baseUrl}
        onBack={() => setView("index")}
        partnerId={props.partnerId}
        theme={props.theme}
      />
    );
  }

  const containerStyle: CSSProperties = {
    background: theme.bg,
    borderRadius: theme.radius,
    border: `1px solid ${theme.border}`,
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "400px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: theme.text,
    overflow: "hidden",
  };

  const scrollStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    paddingLeft: "16px",
    paddingRight: "16px",
    scrollbarGutter: "stable both-edges",
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.border} transparent`,
  };

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <div style={containerStyle}>
      <div className="sl-widget-scroll" style={scrollStyle}>
        <WidgetHeader title="SuperLend" />
        {isLoading ? (
          <WidgetSkeleton />
        ) : !hasOpportunities && !hasVaults && !hasWallet ? (
          <div
            style={{
              fontSize: "13px",
              color: `${theme.text}80`,
              textAlign: "center",
              padding: "24px 16px",
            }}
          >
            Connect your wallet to view your portfolio
          </div>
        ) : (
          <div style={listStyle}>
            {hasOpportunities && (
              <CategoryCard
                label="Opportunities"
                description="Best-of lending rates across protocols"
                category={overview.opportunities}
                onClick={() => setView("opportunities")}
              />
            )}
            {hasVaults && (
              <CategoryCard
                label="Vaults"
                description="Curated yield vaults"
                category={overview.vaults}
                onClick={() => setView("vaults")}
              />
            )}
            {hasWallet && (
              <button
                type="button"
                className="sl-opportunity-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: theme.radius,
                  background: `${theme.text}08`,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  color: theme.text,
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  transition: "background 150ms ease",
                }}
                onClick={() => setView("portfolio")}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: theme.text,
                    }}
                  >
                    Portfolio
                  </div>
                  <div
                    style={{ fontSize: "0.6875rem", color: `${theme.text}99` }}
                  >
                    Active lending & borrowing positions
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: `${theme.text}66`,
                  }}
                >
                  →
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <PoweredBy />
      </div>
    </div>
  );
};

const OverviewWidget: React.FC<OverviewWidgetProps> = (props) => {
  const resolvedTheme = useMemo(() => resolveTheme(props.theme), [props.theme]);

  const client = useMemo(
    () =>
      new SuperLendClient({
        apiKey: props.apiKey,
        partnerId: props.partnerId,
        baseUrl: props.baseUrl,
      }),
    [props.apiKey, props.partnerId, props.baseUrl],
  );

  useEffect(() => {
    injectStyles(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <OverviewContent {...props} client={client} />
    </ThemeContext.Provider>
  );
};

export { OverviewWidget };
