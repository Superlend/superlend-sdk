import type { Market } from "@superlend/sdk";
import { SuperLendClient } from "@superlend/sdk";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import { resolveTheme, ThemeContext } from "../context/theme.context";
import { useMarkets } from "../hooks/opportunities.hooks";
import { useTransaction } from "../hooks/transaction.hooks";
import { useWidgetFlow } from "../hooks/widget-flow.hooks";
import { injectStyles } from "../styles/inject.utils";
import type { WidgetProps } from "../types";
import { AmountInput } from "./amount-input";
import { MarketCard } from "./opportunity-card";
import { PoweredBy } from "./powered-by";
import { TransactionFlow } from "./transaction-flow";
import { WidgetDialog } from "./widget-dialog";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type WidgetContentProps = {
  client: SuperLendClient;
  tokenAddress: string;
  amount?: string;
  chainId: number;
  userAddress?: string;
  limit?: number;
  walletClient?: WidgetProps["walletClient"];
  onAction?: WidgetProps["onAction"];
  onConnectWallet?: WidgetProps["onConnectWallet"];
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
  onConnectWallet,
}) => {
  const { data, isLoading, error } = useMarkets(client, {
    tokenAddress,
    chainId,
  });

  const flow = useWidgetFlow();
  const tx = useTransaction({ client, walletClient });

  const prevViewRef = useRef(flow.state.view);
  const viewOrder = ["opportunities", "amount-input", "transaction"] as const;
  const prevIdx = viewOrder.indexOf(
    prevViewRef.current as (typeof viewOrder)[number],
  );
  const currIdx = viewOrder.indexOf(
    flow.state.view as (typeof viewOrder)[number],
  );
  const direction = currIdx >= prevIdx ? 1 : -1;

  useEffect(() => {
    prevViewRef.current = flow.state.view;
  }, [flow.state.view]);

  const handleSelectMarket = (market: Market) => {
    flow.selectMarket(market);
  };

  const needsWallet = !walletClient && !onAction;

  const handleConfirmAmount = async (rawAmount: string) => {
    if (!flow.state.view || flow.state.view !== "amount-input") return;
    const market = flow.state.market;

    if (onAction) {
      const result = await client.buildSupplyCalldata({
        protocolId: market.platform.protocolId,
        platformId: market.platform.platformId,
        token: market.token.address,
        amount: rawAmount,
        userAddress: userAddress ?? "",
      });
      if (result.isOk()) {
        onAction(market, result.value);
      }
      flow.reset();
      return;
    }

    if (!walletClient) return;

    flow.confirmAmount(rawAmount);
    tx.execute({
      market,
      userAddress: userAddress ?? "",
      amount: rawAmount,
    });
  };

  const handleDone = () => {
    tx.reset();
    flow.reset();
  };

  const handleBack = () => {
    tx.reset();
    flow.goBack();
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

  const slideVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  };

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <AnimatePresence mode="wait" custom={direction}>
        {flow.state.view === "transaction" && (
          <motion.div
            key="transaction"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader title="Transaction" />
            <TransactionFlow
              market={flow.state.market}
              amount={flow.state.amount}
              steps={tx.steps}
              onRetry={tx.retry}
              onDone={handleDone}
              onStartOver={handleDone}
              isPending={tx.isPending}
              isSuccess={tx.isSuccess}
            />
          </motion.div>
        )}

        {flow.state.view === "amount-input" && (
          <motion.div
            key="amount-input"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader title="Enter Amount" onBack={handleBack} />
            <AmountInput
              market={flow.state.market}
              defaultAmount={amount}
              onConfirm={handleConfirmAmount}
              onBack={handleBack}
              needsWallet={needsWallet}
              onConnectWallet={onConnectWallet}
            />
          </motion.div>
        )}

        {flow.state.view === "opportunities" && (
          <motion.div
            key="opportunities"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader
              title={`${markets[0]?.token.symbol ?? ""} Lending Opportunities`}
            />
            <div style={listStyle}>
              {(limit ? markets.slice(0, limit) : markets).map((market, i) => (
                <motion.div
                  key={market.platform.platformId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <MarketCard market={market} onSelect={handleSelectMarket} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuperLendWidget: React.FC<WidgetProps> = ({
  apiKey,
  tokenAddress,
  initialAmount,
  chainId,
  userAddress,
  variant = "inline",
  theme: themeOverrides,
  walletClient,
  onAction,
  onConnectWallet,
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

  const widgetContent = (
    <WidgetContent
      client={client}
      tokenAddress={tokenAddress}
      amount={initialAmount}
      chainId={chainId}
      userAddress={userAddress}
      limit={limit}
      walletClient={walletClient}
      onAction={onAction}
      onConnectWallet={onConnectWallet}
    />
  );

  if (variant === "dialog") {
    return (
      <ThemeContext.Provider value={resolvedTheme}>
        <WidgetDialog>{widgetContent}</WidgetDialog>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div style={containerStyle}>
        <div className="sl-widget-scroll" style={scrollStyle}>
          {widgetContent}
        </div>
        <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
          <PoweredBy />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export { SuperLendWidget };
