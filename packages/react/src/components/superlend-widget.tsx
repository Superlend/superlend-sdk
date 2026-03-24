import type { Market, VaultOpportunity } from "@superlend/sdk";
import { SuperLendClient } from "@superlend/sdk";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveTheme, ThemeContext } from "../context/theme.context";
import { useMarkets } from "../hooks/opportunities.hooks";
import { useTransaction } from "../hooks/transaction.hooks";
import { useVaultMarkets } from "../hooks/vault-opportunities.hooks";
import { useVaultTransaction } from "../hooks/vault-transaction.hooks";
import { injectStyles } from "../styles/inject.utils";
import type { WidgetProps } from "../types";
import { AmountInput } from "./amount-input";
import { MarketCard } from "./opportunity-card";
import { PoweredBy } from "./powered-by";
import { TransactionFlow } from "./transaction-flow";
import { VaultAmountInput } from "./vault-amount-input";
import { VaultOpportunityCard } from "./vault-opportunity-card";
import { VaultTransactionFlow } from "./vault-transaction-flow";
import { WidgetDialog } from "./widget-dialog";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type CombinedSelectedOpportunity =
  | { kind: "market"; market: Market }
  | { kind: "vault"; vault: VaultOpportunity };

type CombinedWidgetContentProps = {
  client: SuperLendClient;
  tokenAddress: string;
  amount: string;
  chainId: number;
  userAddress?: string;
  limit?: number;
  includeVaults: boolean;
  vaultsFirst: boolean;
  walletClient?: WidgetProps["walletClient"];
  onAction?: WidgetProps["onAction"];
  onConnectWallet?: WidgetProps["onConnectWallet"];
};

const CombinedWidgetContent: React.FC<CombinedWidgetContentProps> = ({
  client,
  tokenAddress,
  amount,
  chainId,
  userAddress,
  limit,
  includeVaults,
  vaultsFirst,
  walletClient,
  onAction,
  onConnectWallet,
}) => {
  const marketQuery = useMarkets(client, {
    tokenAddress,
    chainId,
  });
  const vaultQuery = useVaultMarkets(client, {
    tokenAddress,
    chainId,
    enabled: includeVaults,
  });

  const marketTx = useTransaction({ client, walletClient });
  const vaultTx = useVaultTransaction({ client, walletClient });

  const [view, setView] = useState<"opportunities" | "amount-input" | "transaction">(
    "opportunities",
  );
  const [selected, setSelected] = useState<CombinedSelectedOpportunity | null>(
    null,
  );
  const [confirmedAmount, setConfirmedAmount] = useState<string>(amount);

  const prevViewRef = useRef(view);
  const viewOrder = ["opportunities", "amount-input", "transaction"] as const;
  const prevIdx = viewOrder.indexOf(prevViewRef.current);
  const currIdx = viewOrder.indexOf(view);
  const direction = currIdx >= prevIdx ? 1 : -1;

  useEffect(() => {
    prevViewRef.current = view;
  }, [view]);

  const needsWallet = !walletClient && !onAction;

  const resetFlow = () => {
    marketTx.reset();
    vaultTx.reset();
    setSelected(null);
    setView("opportunities");
  };

  const handleBack = () => {
    marketTx.reset();
    vaultTx.reset();
    setView("opportunities");
  };

  const handleConfirmAmount = async (rawAmount: string) => {
    if (!selected) return;

    if (onAction && selected.kind === "market") {
      const result = await client.buildSupplyCalldata({
        protocolId: selected.market.platform.protocolId,
        platformId: selected.market.platform.platformId,
        token: selected.market.token.address,
        amount: rawAmount,
        userAddress: userAddress ?? "",
      });
      if (result.isOk()) onAction(selected.market, result.value);
      resetFlow();
      return;
    }

    if (onAction && selected.kind === "vault") {
      const result = await client.buildVaultDepositCalldata({
        vaultId: selected.vault.vaultId,
        amount: rawAmount,
        userAddress: userAddress ?? "",
      });
      if (result.isOk()) onAction(selected.vault, result.value);
      resetFlow();
      return;
    }

    if (!walletClient) return;

    setConfirmedAmount(rawAmount);
    setView("transaction");

    if (selected.kind === "market") {
      marketTx.execute({
        market: selected.market,
        userAddress: userAddress ?? "",
        amount: rawAmount,
      });
      return;
    }

    vaultTx.execute({
      vault: selected.vault,
      userAddress: userAddress ?? "",
      amount: rawAmount,
    });
  };

  const isLoading = marketQuery.isLoading || (includeVaults && vaultQuery.isLoading);
  if (isLoading) {
    return <WidgetSkeleton />;
  }

  if (marketQuery.error || (includeVaults && vaultQuery.error)) {
    const errorStyle: CSSProperties = {
      fontSize: "13px",
      color: "#ff6b6b",
      textAlign: "center",
      padding: "16px",
    };
    return <div style={errorStyle}>Failed to load opportunities</div>;
  }

  const markets = marketQuery.data?.markets ?? [];
  const vaults = includeVaults ? vaultQuery.data?.vaults ?? [] : [];

  if (markets.length === 0 && vaults.length === 0) {
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
  const sectionLabelStyle: CSSProperties = {
    fontSize: "11px",
    color: "#ffffff99",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "8px",
    marginBottom: "4px",
  };
  const separatorStyle: CSSProperties = {
    border: "none",
    borderTop: "1px solid #ffffff1f",
    margin: "8px 0 4px 0",
  };

  const vaultList = limit ? vaults.slice(0, limit) : vaults;
  const marketList = limit ? markets.slice(0, limit) : markets;

  return (
    <div style={{ overflow: "hidden" }}>
      <AnimatePresence mode="wait" custom={direction}>
        {view === "transaction" && selected?.kind === "market" && (
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
              market={selected.market}
              amount={confirmedAmount}
              steps={marketTx.steps}
              onRetry={marketTx.retry}
              onDone={resetFlow}
              onStartOver={resetFlow}
              isPending={marketTx.isPending}
              isSuccess={marketTx.isSuccess}
            />
          </motion.div>
        )}

        {view === "transaction" && selected?.kind === "vault" && (
          <motion.div
            key="vault-transaction"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader title="Transaction" />
            <VaultTransactionFlow
              vault={selected.vault}
              amount={confirmedAmount}
              steps={vaultTx.steps}
              onRetry={vaultTx.retry}
              onDone={resetFlow}
              onStartOver={resetFlow}
              isPending={vaultTx.isPending}
              isSuccess={vaultTx.isSuccess}
            />
          </motion.div>
        )}

        {view === "amount-input" && selected?.kind === "market" && (
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
              market={selected.market}
              defaultAmount={amount}
              onConfirm={handleConfirmAmount}
              onBack={handleBack}
              needsWallet={needsWallet}
              onConnectWallet={onConnectWallet}
            />
          </motion.div>
        )}

        {view === "amount-input" && selected?.kind === "vault" && (
          <motion.div
            key="vault-amount-input"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader title="Enter Amount" onBack={handleBack} />
            <VaultAmountInput
              vault={selected.vault}
              defaultAmount={amount}
              onConfirm={handleConfirmAmount}
              onBack={handleBack}
              needsWallet={needsWallet}
              onConnectWallet={onConnectWallet}
            />
          </motion.div>
        )}

        {view === "opportunities" && (
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
              title={`${tokenAddress ? (markets[0]?.token.symbol ?? vaults[0]?.token.symbol ?? "") : ""} Opportunities`}
            />
            <div style={listStyle}>
              {vaultsFirst && vaultList.length > 0 && (
                <div style={sectionLabelStyle}>Superlend Vaults</div>
              )}
              {vaultsFirst &&
                vaultList.map((vault, i) => (
                  <motion.div
                    key={`vault-${vault.vaultId}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                  >
                    <VaultOpportunityCard
                      vault={vault}
                      onSelect={(v) => {
                        setSelected({ kind: "vault", vault: v });
                        setView("amount-input");
                      }}
                    />
                  </motion.div>
                ))}
              {vaultsFirst && vaultList.length > 0 && marketList.length > 0 && (
                <hr style={separatorStyle} />
              )}
              {marketList.length > 0 && (
                <div style={sectionLabelStyle}>Lending Markets</div>
              )}
              {marketList.map((market, i) => (
                <motion.div
                  key={`market-${market.platform.platformId}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: (vaultList.length + i) * 0.04 }}
                >
                  <MarketCard
                    market={market}
                    onSelect={(m) => {
                      setSelected({ kind: "market", market: m });
                      setView("amount-input");
                    }}
                  />
                </motion.div>
              ))}
              {!vaultsFirst && vaultList.length > 0 && marketList.length > 0 && (
                <hr style={separatorStyle} />
              )}
              {!vaultsFirst && vaultList.length > 0 && (
                <>
                  <div style={sectionLabelStyle}>Superlend Vaults</div>
                  {vaultList.map((vault, i) => (
                    <motion.div
                      key={`vault-tail-${vault.vaultId}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: (marketList.length + i) * 0.04 }}
                    >
                      <VaultOpportunityCard
                        vault={vault}
                        onSelect={(v) => {
                          setSelected({ kind: "vault", vault: v });
                          setView("amount-input");
                        }}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuperLendWidget: React.FC<WidgetProps> = (props) => {
  const {
    apiKey,
    tokenAddress,
    amount,
    chainId,
    userAddress,
    variant = "inline",
    theme: themeOverrides,
    walletClient,
    onConnectWallet,
    partnerId,
    limit,
    includeVaults = true,
    vaultsFirst = true,
    baseUrl,
  } = props;

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
    <CombinedWidgetContent
      client={client}
      tokenAddress={tokenAddress}
      amount={amount}
      chainId={chainId}
      userAddress={userAddress}
      limit={limit}
      includeVaults={includeVaults}
      vaultsFirst={vaultsFirst}
      walletClient={walletClient}
      onAction={props.onAction}
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
