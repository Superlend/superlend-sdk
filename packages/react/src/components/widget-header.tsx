import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type WidgetHeaderProps = {
  title: string;
  onBack?: () => void;
};

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, onBack }) => {
  const theme = useTheme();

  const containerStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    padding: "0 0 12px 0",
    background: theme.bg,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const backStyle: CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    fontSize: "16px",
    color: theme.text,
    fontFamily: "inherit",
    lineHeight: 1,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const headingStyle: CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: theme.text,
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      {onBack && (
        <button
          type="button"
          style={backStyle}
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>
      )}
      <p style={headingStyle}>{title}</p>
    </div>
  );
};

export { WidgetHeader, type WidgetHeaderProps };
