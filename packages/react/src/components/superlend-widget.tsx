import { SuperLendClient } from "@superlend/sdk";
import type { Market } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { ThemeContext, resolveTheme } from "../context/theme.context";
import { useMarkets } from "../hooks/opportunities.hooks";
import { useTransaction } from "../hooks/transaction.hooks";
import { injectStyles } from "../styles/inject.utils";
import type { WidgetProps } from "../types";
import { MarketCard } from "./opportunity-card";
import { PoweredBy } from "./powered-by";
import { WidgetDialog } from "./widget-dialog";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

type WidgetContentProps = {
  client: SuperLendClient;
  tokenAddress: string;
  amount: string;
  chainId: number;
  userAddress?: string;
  limit?: number;
  walletClient?: WidgetProps["walletClient"];
  onAction?: WidgetProps["onAction"];
  compact?: boolean;
};

const WidgetContent: React.FC<WidgetContentProps> = ({
  client,
  tokenAddress,
  amount,
  chainId,
  userAddress,
  limit,
  walletClient,
  onAction,
  compact,
}) => {
  const { data, isLoading, error } = useMarkets(client, {
    tokenAddress,
    chainId,
  });

  const { execute } = useTransaction({
    client,
    walletClient,
    onAction,
  });

  const handleSelect = (market: Market) => {
    execute({
      market,
      userAddress: userAddress ?? "",
      amount,
    });
  };

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
    return <div style={errorStyle}>Failed to load opportunities</div>;
  }

  const markets = data?.markets ?? [];

  if (markets.length === 0) {
    const emptyStyle: CSSProperties = {
      fontSize: "13px",
      color: "#ffffff80",
      textAlign: "center",
      padding: "16px",
    };
    return <div style={emptyStyle}>No opportunities available</div>;
  }

  const displayMarkets = compact
    ? markets.slice(0, 1)
    : limit
      ? markets.slice(0, limit)
      : markets;

  const tokenSymbol = markets[0]?.token.symbol ?? "";

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <>
      {!compact && <WidgetHeader token={tokenSymbol} amount={amount} />}
      <div style={listStyle}>
        {displayMarkets.map((market) => (
          <MarketCard
            key={market.platform.platformId}
            market={market}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <PoweredBy />
    </>
  );
};

const SuperLendWidget: React.FC<WidgetProps> = ({
  apiKey,
  tokenAddress,
  amount,
  chainId,
  userAddress,
  variant = "inline",
  theme: themeOverrides,
  walletClient,
  onAction,
  partnerId,
  limit,
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
    padding: variant === "compact" ? "8px" : "16px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: resolvedTheme.text,
  };

  const content = (
    <WidgetContent
      client={client}
      tokenAddress={tokenAddress}
      amount={amount}
      chainId={chainId}
      userAddress={userAddress}
      limit={limit}
      walletClient={walletClient}
      onAction={onAction}
      compact={variant === "compact"}
    />
  );

  if (variant === "dialog") {
    return (
      <ThemeContext.Provider value={resolvedTheme}>
        <WidgetDialog>{content}</WidgetDialog>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div style={containerStyle}>{content}</div>
    </ThemeContext.Provider>
  );
};

export { SuperLendWidget };
