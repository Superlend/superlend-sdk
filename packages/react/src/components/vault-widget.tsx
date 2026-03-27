import type {
  VaultDepositCalldataResponse,
  VaultOpportunity,
} from "@superlend/sdk";
import { SuperLendClient } from "@superlend/sdk";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveTheme, ThemeContext } from "../context/theme.context";
import { useVaultMarkets } from "../hooks/vault-opportunities.hooks";
import { useVaultTransaction } from "../hooks/vault-transaction.hooks";
import { injectStyles } from "../styles/inject.utils";
import type { ThemeConfig, WalletClient, WidgetVariant } from "../types";
import { PoweredBy } from "./powered-by";
import { VaultAmountInput } from "./vault-amount-input";
import { VaultOpportunityCard } from "./vault-opportunity-card";
import { VaultTransactionFlow } from "./vault-transaction-flow";
import { WidgetDialog } from "./widget-dialog";
import { WidgetHeader } from "./widget-header";
import { WidgetSkeleton } from "./widget-skeleton";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export type VaultWidgetProps = {
  apiKey: string;
  tokenAddress: string;
  initialAmount?: string;
  chainId: number;
  userAddress?: string;
  variant?: WidgetVariant;
  theme?: ThemeConfig;
  walletClient?: WalletClient;
  onConnectWallet?: () => void;
  partnerId?: string;
  limit?: number;
  baseUrl?: string;
  onAction?: (
    opportunity: VaultOpportunity,
    calldata: VaultDepositCalldataResponse,
  ) => void;
};

const VaultWidgetContent: React.FC<{
  client: SuperLendClient;
  tokenAddress: string;
  initialAmount?: string;
  chainId: number;
  userAddress?: string;
  limit?: number;
  walletClient?: WalletClient;
  onAction?: (
    opportunity: VaultOpportunity,
    calldata: VaultDepositCalldataResponse,
  ) => void;
  onConnectWallet?: () => void;
}> = ({
  client,
  tokenAddress,
  initialAmount,
  chainId,
  userAddress,
  limit,
  walletClient,
  onAction,
  onConnectWallet,
}) => {
  const vaultQuery = useVaultMarkets(client, { tokenAddress, chainId });
  const vaultTx = useVaultTransaction({ client, walletClient });

  const [view, setView] = useState<
    "opportunities" | "amount-input" | "transaction"
  >("opportunities");
  const [selectedVault, setSelectedVault] = useState<VaultOpportunity | null>(
    null,
  );
  const [confirmedAmount, setConfirmedAmount] = useState<string>(
    initialAmount ?? "",
  );

  const prevViewRef = useRef(view);
  const viewOrder = ["opportunities", "amount-input", "transaction"] as const;
  const prevIdx = viewOrder.indexOf(prevViewRef.current);
  const currIdx = viewOrder.indexOf(view);
  const direction = currIdx >= prevIdx ? 1 : -1;

  useEffect(() => {
    prevViewRef.current = view;
  }, [view]);

  const resetFlow = () => {
    vaultTx.reset();
    setSelectedVault(null);
    setView("opportunities");
  };

  const handleBack = () => {
    vaultTx.reset();
    setView("opportunities");
  };

  const handleConfirmAmount = async (rawAmount: string) => {
    if (!selectedVault) return;

    if (onAction) {
      const result = await client.buildVaultDepositCalldata({
        vaultId: selectedVault.vaultId,
        amount: rawAmount,
        userAddress: userAddress ?? "",
      });
      if (result.isOk()) onAction(selectedVault, result.value);
      resetFlow();
      return;
    }

    if (!walletClient) return;

    setConfirmedAmount(rawAmount);
    setView("transaction");

    vaultTx.execute({
      vault: selectedVault,
      userAddress: userAddress ?? "",
      amount: rawAmount,
    });
  };

  const needsWallet = !walletClient && !onAction;
  const isLoading = vaultQuery.isLoading;
  if (isLoading) return <WidgetSkeleton />;

  if (vaultQuery.error) {
    const errorStyle: CSSProperties = {
      fontSize: "13px",
      color: "#ff6b6b",
      textAlign: "center",
      padding: "16px",
    };
    return <div style={errorStyle}>Failed to load vault opportunities</div>;
  }

  const vaults = vaultQuery.data?.vaults ?? [];
  const vaultList = limit ? vaults.slice(0, limit) : vaults;

  if (vaultList.length === 0) {
    const emptyStyle: CSSProperties = {
      fontSize: "13px",
      color: "#ffffff80",
      textAlign: "center",
      padding: "16px",
    };
    return <div style={emptyStyle}>No vault opportunities available</div>;
  }

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <AnimatePresence mode="wait" custom={direction}>
        {view === "transaction" && selectedVault && (
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
              vault={selectedVault}
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

        {view === "amount-input" && selectedVault && (
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
              vault={selectedVault}
              defaultAmount={initialAmount ?? ""}
              onConfirm={handleConfirmAmount}
              onBack={handleBack}
              needsWallet={needsWallet}
              onConnectWallet={onConnectWallet}
            />
          </motion.div>
        )}

        {view === "opportunities" && (
          <motion.div
            key="vault-opportunities"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <WidgetHeader title="Vault Opportunities" />
            <div style={listStyle}>
              {vaultList.map((vault, i) => (
                <motion.div
                  key={vault.vaultId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <VaultOpportunityCard
                    vault={vault}
                    onSelect={(selected) => {
                      setSelectedVault(selected);
                      setView("amount-input");
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VaultWidget: React.FC<VaultWidgetProps> = ({
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

  const content = (
    <VaultWidgetContent
      client={client}
      tokenAddress={tokenAddress}
      initialAmount={initialAmount}
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
        <WidgetDialog>{content}</WidgetDialog>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div style={containerStyle}>
        <div className="sl-widget-scroll" style={scrollStyle}>
          {content}
        </div>
        <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
          <PoweredBy />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export { VaultWidget };
