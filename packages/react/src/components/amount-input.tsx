import type { Market } from "@superlend/sdk";
import { motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { useTheme } from "../context/theme.context";
import { ActionButton } from "./action-button";
import { SelectedMarket } from "./selected-market";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type AmountInputProps = {
  market: Market;
  defaultAmount: string;
  onConfirm: (rawAmount: string) => void;
  onBack: () => void;
};

function rawToHuman(raw: string, decimals: number): string {
  if (!raw || raw === "0") return "0";
  const padded = raw.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals) || "0";
  const fracPart = padded.slice(padded.length - decimals);
  const trimmed = fracPart.replace(/0+$/, "");
  return trimmed ? `${intPart}.${trimmed}` : intPart;
}

function humanToRaw(human: string, decimals: number): string {
  if (!human || human === "0") return "0";
  const [intPart = "0", fracPart = ""] = human.split(".");
  const paddedFrac = fracPart.padEnd(decimals, "0").slice(0, decimals);
  const raw = (intPart + paddedFrac).replace(/^0+/, "") || "0";
  return raw;
}

const AmountInput: React.FC<AmountInputProps> = ({
  market,
  defaultAmount,
  onConfirm,
  onBack,
}) => {
  const theme = useTheme();
  const decimals = market.token.decimals;
  const [value, setValue] = useState(() => rawToHuman(defaultAmount, decimals));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "" || /^\d*\.?\d*$/.test(input)) {
      setValue(input);
    }
  };

  const handleConfirm = () => {
    const raw = humanToRaw(value, decimals);
    if (raw === "0") return;
    onConfirm(raw);
  };

  const isValid = value !== "" && value !== "0" && value !== "0." && /^\d*\.?\d*$/.test(value);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "4px 0",
  };

  const inputWrapperStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
    border: `1px solid ${theme.border}`,
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "24px",
    fontWeight: 600,
    color: theme.text,
    fontFamily: "inherit",
    width: "100%",
    minWidth: 0,
  };

  const symbolStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: `${theme.text}99`,
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <SelectedMarket market={market} />
      <motion.div
        style={inputWrapperStyle}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.04 }}
      >
        <input
          type="text"
          inputMode="decimal"
          className="sl-amount-input"
          style={inputStyle}
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          autoFocus
        />
        <span style={symbolStyle}>{market.token.symbol}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.08 }}
      >
        <ActionButton
          label="Continue"
          onClick={handleConfirm}
          disabled={!isValid}
        />
      </motion.div>
    </div>
  );
};

export { AmountInput, type AmountInputProps };
