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
    padding: "0 0 12px 0",
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
      <p style={swapTextStyle}>
        Successfully swapped {amount} {token}
      </p>
      <p style={headingStyle}>Let's put them to good use</p>
    </div>
  );
};

export { WidgetHeader, type WidgetHeaderProps };
