import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type WidgetHeaderProps = {
  token: string;
  amount: string;
};

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ token, amount }) => {
  const theme = useTheme();

  const containerStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    padding: "0 0 12px 0",
    background: theme.bg,
    zIndex: 1,
  };

  const swapTextStyle: CSSProperties = {
    fontSize: "13px",
    color: `${theme.text}99`,
    margin: 0,
  };

  const headingStyle: CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: theme.text,
    margin: "4px 0 0 0",
  };

  return (
    <div style={containerStyle}>
      <p style={headingStyle}>{token} Lending Opportunities</p>
    </div>
  );
};

export { WidgetHeader, type WidgetHeaderProps };
