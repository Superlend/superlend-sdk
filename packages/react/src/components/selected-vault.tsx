import type { VaultOpportunity } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type SelectedVaultProps = {
  vault: VaultOpportunity;
};

const SelectedVault: React.FC<SelectedVaultProps> = ({ vault }) => {
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

  const apyStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: theme.primary,
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <img
          src={vault.vault.logo}
          alt={vault.vault.name}
          style={logoStyle}
        />
        <span style={nameStyle}>{vault.vault.name}</span>
      </div>
      <span style={apyStyle}>{vault.apy.net.toFixed(2)}% APY</span>
    </div>
  );
};

export { SelectedVault, type SelectedVaultProps };
