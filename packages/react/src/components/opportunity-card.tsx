import type { Market } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type MarketCardProps = {
  market: Market;
  onSelect: (market: Market) => void;
};

const MarketCard: React.FC<MarketCardProps> = ({ market, onSelect }) => {
  const theme = useTheme();

  const cardStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    color: theme.text,
    fontFamily: "inherit",
    fontSize: "0.875rem",
    transition: "background 150ms ease",
  };

  const leftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const logoStyle: CSSProperties = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const platformNameStyle: CSSProperties = {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: theme.text,
  };

  const protocolStyle: CSSProperties = {
    fontSize: "0.6875rem",
    color: `${theme.text}99`,
  };

  const apyColor =
    market.supplyRate.current.net >= 0 ? theme.positive : theme.negative;

  const apyStyle: CSSProperties = {
    fontSize: "1rem",
    fontWeight: 700,
    color: apyColor,
  };

  const apyLabelStyle: CSSProperties = {
    fontSize: "0.6875rem",
    color: `${theme.text}66`,
  };

  const rightStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  };

  return (
    <button
      type="button"
      className="sl-opportunity-card"
      style={cardStyle}
      onClick={() => onSelect(market)}
    >
      <div style={leftStyle}>
        <img
          src={market.platform.logo}
          alt={market.platform.name}
          style={logoStyle}
        />
        <div>
          <div style={platformNameStyle}>{market.platform.displayName}</div>
          <div style={protocolStyle}>{market.platform.name}</div>
        </div>
      </div>
      <div style={rightStyle}>
        <div style={apyStyle}>{market.supplyRate.current.net.toFixed(2)}%</div>
        <div style={apyLabelStyle}>Supply APY</div>
      </div>
    </button>
  );
};

export { MarketCard, type MarketCardProps };
