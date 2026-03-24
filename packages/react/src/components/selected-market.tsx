import type { Market } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type SelectedMarketProps = {
  market: Market;
};

const SelectedMarket: React.FC<SelectedMarketProps> = ({ market }) => {
  const theme = useTheme();

  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
  };

  const leftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const logoStyle: CSSProperties = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const nameStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: theme.text,
  };

  const apyColor =
    market.supplyRate.current.net >= 0 ? theme.positive : theme.negative;

  const apyStyle: CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: apyColor,
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <img
          src={market.platform.logo}
          alt={market.platform.name}
          style={logoStyle}
        />
        <span style={nameStyle}>{market.platform.displayName}</span>
      </div>
      <span style={apyStyle}>
        {market.supplyRate.current.net.toFixed(2)}% APY
      </span>
    </div>
  );
};

export { SelectedMarket, type SelectedMarketProps };
