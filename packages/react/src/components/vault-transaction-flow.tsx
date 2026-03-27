import type { VaultOpportunity } from "@superlend/sdk";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";
import type {
  StepStatus,
  VaultTransactionSteps,
} from "../hooks/vault-transaction.hooks";
import { ActionButton } from "./action-button";
import { SelectedVault } from "./selected-vault";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type VaultTransactionFlowProps = {
  vault: VaultOpportunity;
  amount: string;
  steps: VaultTransactionSteps;
  onRetry: () => void;
  onDone: () => void;
  onStartOver: () => void;
  isPending: boolean;
  isSuccess: boolean;
};

function rawToHuman(raw: string, decimals: number): string {
  if (!raw || raw === "0") return "0";
  const padded = raw.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals) || "0";
  const fracPart = padded.slice(padded.length - decimals);
  const trimmed = fracPart.replace(/0+$/, "");
  return trimmed ? `${intPart}.${trimmed}` : intPart;
}

const statusIcons: Record<StepStatus, string> = {
  idle: "○",
  pending: "◌",
  success: "✓",
  error: "✗",
};

type StepRowProps = {
  label: string;
  status: StepStatus;
  error?: string;
  onRetry: () => void;
  onStartOver: () => void;
  index: number;
};

const StepRow: React.FC<StepRowProps> = ({
  label,
  status,
  error,
  onRetry,
  onStartOver,
  index,
}) => {
  const theme = useTheme();

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "10px 0",
  };

  const iconStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 700,
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
    color:
      status === "success"
        ? theme.primary
        : status === "error"
          ? "#ff6b6b"
          : status === "pending"
            ? theme.accent
            : `${theme.text}66`,
  };

  const contentStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  };

  const labelStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: theme.text,
  };

  const errorStyle: CSSProperties = {
    fontSize: "12px",
    color: "#ff6b6b",
  };

  const retryStyle: CSSProperties = {
    fontSize: "12px",
    color: theme.primary,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    textDecoration: "underline",
  };

  return (
    <motion.div
      style={rowStyle}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <motion.span
        style={iconStyle}
        key={status}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
      >
        {status === "pending" ? (
          <span className="sl-spinner">{statusIcons.pending}</span>
        ) : (
          statusIcons[status]
        )}
      </motion.span>
      <div style={contentStyle}>
        <span style={labelStyle}>{label}</span>
        <AnimatePresence>
          {status === "error" && error && (
            <motion.span
              style={errorStyle}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={spring}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              style={{ display: "flex", gap: "12px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={spring}
            >
              <button type="button" style={retryStyle} onClick={onRetry}>
                Retry
              </button>
              <button type="button" style={retryStyle} onClick={onStartOver}>
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const VaultTransactionFlow: React.FC<VaultTransactionFlowProps> = ({
  vault,
  amount,
  steps,
  onRetry,
  onDone,
  onStartOver,
  isPending: _isPending,
  isSuccess,
}) => {
  const theme = useTheme();
  const humanAmount = rawToHuman(amount, vault.token.decimals);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "4px 0",
  };

  const amountStyle: CSSProperties = {
    fontSize: "13px",
    color: `${theme.text}99`,
    textAlign: "center",
    padding: "4px 0",
  };

  const stepsStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
    padding: "4px 14px",
  };

  let stepIndex = 0;

  return (
    <div style={containerStyle}>
      <SelectedVault vault={vault} />
      <div style={amountStyle}>
        Depositing {humanAmount} {vault.token.symbol}
      </div>
      <div style={stepsStyle}>
        {steps.switchChain.needed && (
          <StepRow
            label="Switch Network"
            status={steps.switchChain.status}
            error={steps.switchChain.error}
            onRetry={onRetry}
            onStartOver={onStartOver}
            index={stepIndex++}
          />
        )}
        {steps.approval.needed && (
          <StepRow
            label={`Approve ${vault.token.symbol}`}
            status={steps.approval.status}
            error={steps.approval.error}
            onRetry={onRetry}
            onStartOver={onStartOver}
            index={stepIndex++}
          />
        )}
        <StepRow
          label={`Deposit to ${vault.vault.symbol}`}
          status={steps.deposit.status}
          error={steps.deposit.error}
          onRetry={onRetry}
          onStartOver={onStartOver}
          index={stepIndex++}
        />
      </div>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
          >
            <ActionButton label="Deposit More" onClick={onDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { VaultTransactionFlow, type VaultTransactionFlowProps };
