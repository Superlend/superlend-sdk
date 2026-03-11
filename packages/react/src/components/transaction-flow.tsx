import type { Market } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";
import type { StepStatus, TransactionSteps } from "../hooks/transaction.hooks";
import { ActionButton } from "./action-button";
import { SelectedMarket } from "./selected-market";

type TransactionFlowProps = {
  market: Market;
  amount: string;
  steps: TransactionSteps;
  onRetry: () => void;
  onDone: () => void;
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
};

const StepRow: React.FC<StepRowProps> = ({ label, status, error, onRetry }) => {
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
    <div style={rowStyle}>
      <span style={iconStyle}>
        {status === "pending" ? (
          <span className="sl-spinner">{statusIcons.pending}</span>
        ) : (
          statusIcons[status]
        )}
      </span>
      <div style={contentStyle}>
        <span style={labelStyle}>{label}</span>
        {status === "error" && error && <span style={errorStyle}>{error}</span>}
        {status === "error" && (
          <button type="button" style={retryStyle} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

const TransactionFlow: React.FC<TransactionFlowProps> = ({
  market,
  amount,
  steps,
  onRetry,
  onDone,
  isPending,
  isSuccess,
}) => {
  const theme = useTheme();
  const humanAmount = rawToHuman(amount, market.token.decimals);

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

  return (
    <div style={containerStyle}>
      <SelectedMarket market={market} />
      <div style={amountStyle}>
        Supplying {humanAmount} {market.token.symbol}
      </div>
      <div style={stepsStyle}>
        {steps.switchChain.needed && (
          <StepRow
            label="Switch Network"
            status={steps.switchChain.status}
            error={steps.switchChain.error}
            onRetry={onRetry}
          />
        )}
        {steps.approval.needed && (
          <StepRow
            label={`Approve ${market.token.symbol}`}
            status={steps.approval.status}
            error={steps.approval.error}
            onRetry={onRetry}
          />
        )}
        <StepRow
          label={`Supply ${market.token.symbol}`}
          status={steps.supply.status}
          error={steps.supply.error}
          onRetry={onRetry}
        />
      </div>
      {isSuccess && (
        <ActionButton label="Done" onClick={onDone} />
      )}
    </div>
  );
};

export { TransactionFlow, type TransactionFlowProps };
