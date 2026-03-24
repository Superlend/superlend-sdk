import type { VaultOpportunity } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type VaultOpportunityCardProps = {
  vault: VaultOpportunity;
  onSelect: (vault: VaultOpportunity) => void;
};

const VaultOpportunityCard: React.FC<VaultOpportunityCardProps> = ({
  vault,
  onSelect,
}) => {
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
    fontSize: "14px",
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

  const nameStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: theme.text,
  };

  const metaStyle: CSSProperties = {
    fontSize: "11px",
    color: `${theme.text}99`,
  };

  const apyStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 700,
    color: theme.primary,
  };

  const apyLabelStyle: CSSProperties = {
    fontSize: "11px",
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
      className="sl-vault-opportunity-card"
      style={cardStyle}
      onClick={() => onSelect(vault)}
    >
      <div style={leftStyle}>
        <img src={vault.vault.logo} alt={vault.vault.name} style={logoStyle} />
        <div>
          <div style={nameStyle}>{vault.vault.name}</div>
          <div style={metaStyle}>{vault.vault.symbol}</div>
        </div>
      </div>
      <div style={rightStyle}>
        <div style={apyStyle}>{vault.apy.net.toFixed(2)}%</div>
        <div style={apyLabelStyle}>Vault APY</div>
      </div>
    </button>
  );
};

export { VaultOpportunityCard, type VaultOpportunityCardProps };
