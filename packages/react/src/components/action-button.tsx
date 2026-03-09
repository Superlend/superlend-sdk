import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  isPending?: boolean;
  disabled?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  isPending,
  disabled,
}) => {
  const theme = useTheme();

  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px 16px",
    borderRadius: theme.radius,
    background: theme.primary,
    color: theme.bg,
    fontWeight: 600,
    fontSize: "14px",
    border: "none",
    cursor: disabled || isPending ? "not-allowed" : "pointer",
    opacity: disabled || isPending ? 0.5 : 1,
    fontFamily: "inherit",
    transition: "opacity 150ms ease",
  };

  return (
    <button
      type="button"
      className="sl-action-button"
      style={style}
      onClick={onClick}
      disabled={disabled || isPending}
    >
      {isPending ? "Processing..." : label}
    </button>
  );
};

export { ActionButton, type ActionButtonProps };
