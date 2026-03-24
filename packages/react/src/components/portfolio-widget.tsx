import type { PlatformType, PortfolioMarketId } from "@superlend/sdk";
import { SuperLendClient } from "@superlend/sdk";
import { motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo } from "react";
import { resolveTheme, ThemeContext } from "../context/theme.context";
import { usePortfolio } from "../hooks/portfolio.hooks";
import { injectStyles } from "../styles/inject.utils";
import type { ThemeConfig } from "../types";
import { PositionCard } from "./position-card";
import { PoweredBy } from "./powered-by";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export type PortfolioWidgetProps = {
  /** API key issued by SuperLend. */
  apiKey: string;
  /** Connected wallet address to fetch portfolio for. */
  userAddress: string | undefined;
  /** Filter by chain IDs. */
  chainIds?: number[];
  /** Filter by platform types. */
  types?: PlatformType[];
  /** Filter by specific market IDs. */
  marketIds?: PortfolioMarketId[];
  /** Theme overrides. */
  theme?: ThemeConfig;
  /** Partner identifier for attribution. */
  partnerId?: string;
  /** Override the API base URL. */
  baseUrl?: string;
};

const PortfolioContent: React.FC<{
  client: SuperLendClient;
  userAddress: string | undefined;
  chainIds?: number[];
  types?: PlatformType[];
  marketIds?: PortfolioMarketId[];
}> = ({ client, userAddress, chainIds, types, marketIds }) => {
  const theme = useMemo(
    () => resolveTheme(),
    [],
  );

  const { data, isLoading, error } = usePortfolio(client, {
    userAddress,
    chainIds,
    types,
    marketIds,
  });

  if (!userAddress) {
    const emptyStyle: CSSProperties = {
      fontSize: "13px",
      color: `${theme.text}80`,
      textAlign: "center",
      padding: "16px",
    };
    return <div style={emptyStyle}>Connect wallet to view portfolio</div>;
  }

  if (isLoading) {
    return <WidgetSkeleton />;
  }

  if (error) {
    const errorStyle: CSSProperties = {
      fontSize: "13px",
      color: "#ff6b6b",
      textAlign: "center",
      padding: "16px",
    };
    return <div style={errorStyle}>Failed to load portfolio</div>;
  }

  const positions = data?.positions ?? [];

  if (positions.length === 0) {
    const emptyStyle: CSSProperties = {
      fontSize: "13px",
      color: `${theme.text}80`,
      textAlign: "center",
      padding: "16px",
    };
    return <div style={emptyStyle}>No active positions</div>;
  }

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <div style={listStyle}>
      {positions.map((platformPos, i) => (
        <motion.div
          key={platformPos.platform.platformId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: i * 0.04 }}
        >
          <PositionCard platformPosition={platformPos} />
        </motion.div>
      ))}
    </div>
  );
};

const ManageButton: React.FC = () => {
  const buttonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "inherit",
    color: "#ffffff",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <a
      href="https://app.superlend.xyz/portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="sl-action-button"
      style={buttonStyle}
    >
      Manage Portfolio
    </a>
  );
};

const PortfolioWidget: React.FC<PortfolioWidgetProps> = ({
  apiKey,
  userAddress,
  chainIds,
  types,
  marketIds,
  theme: themeOverrides,
  partnerId,
  baseUrl,
}) => {
  const resolvedTheme = useMemo(
    () => resolveTheme(themeOverrides),
    [themeOverrides],
  );

  const client = useMemo(
    () => new SuperLendClient({ apiKey, partnerId, baseUrl }),
    [apiKey, partnerId, baseUrl],
  );

  useEffect(() => {
    injectStyles(resolvedTheme);
  }, [resolvedTheme]);

  const containerStyle: CSSProperties = {
    background: resolvedTheme.bg,
    borderRadius: resolvedTheme.radius,
    border: `1px solid ${resolvedTheme.border}`,
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "400px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: resolvedTheme.text,
    overflow: "hidden",
  };

  const scrollStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    paddingLeft: "16px",
    paddingRight: "16px",
    scrollbarGutter: "stable both-edges",
    scrollbarWidth: "thin",
    scrollbarColor: `${resolvedTheme.border} transparent`,
  };

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div style={containerStyle}>
        <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
          <WidgetHeader title="Portfolio" />
        </div>
        <div className="sl-widget-scroll" style={scrollStyle}>
          <PortfolioContent
            client={client}
            userAddress={userAddress}
            chainIds={chainIds}
            types={types}
            marketIds={marketIds}
          />
        </div>
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            borderTop: `1px solid ${resolvedTheme.border}`,
          }}
        >
          <ManageButton />
          <PoweredBy />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export { PortfolioWidget };
