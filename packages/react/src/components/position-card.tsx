import type { PlatformPosition } from "@superlend/sdk";
import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

type PositionCardProps = {
  platformPosition: PlatformPosition;
};

const PositionCard: React.FC<PositionCardProps> = ({ platformPosition }) => {
  const theme = useTheme();
  const { platform, positions } = platformPosition;

  const cardStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: theme.radius,
    background: `${theme.text}08`,
    color: theme.text,
    fontFamily: "inherit",
    fontSize: "14px",
  };

  const headerStyle: CSSProperties = {
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
    fontSize: "13px",
    fontWeight: 600,
    color: theme.text,
  };

  const protocolStyle: CSSProperties = {
    fontSize: "11px",
    color: `${theme.text}99`,
  };

  const chainBadgeStyle: CSSProperties = {
    fontSize: "10px",
    color: `${theme.text}80`,
    background: `${theme.text}12`,
    padding: "2px 6px",
    borderRadius: "4px",
    marginLeft: "auto",
  };

  const positionRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 0",
    borderTop: `1px solid ${theme.border}`,
  };

  const tokenInfoStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const tokenLogoStyle: CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const typeBadgeStyle = (_type: "LEND" | "BORROW"): CSSProperties => ({
    fontSize: "10px",
    fontWeight: 600,
    color: theme.primary,
    background: `${theme.primary}18`,
    padding: "2px 6px",
    borderRadius: "4px",
  });

  const rightStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  };

  const apyStyle = (value: number): CSSProperties => ({
    fontSize: "0.875rem",
    fontWeight: 700,
    color: value >= 0 ? theme.positive : theme.negative,
  });

  const amountStyle: CSSProperties = {
    fontSize: "11px",
    color: `${theme.text}66`,
  };

  return (
    <div className="sl-position-card" style={cardStyle}>
      <div style={headerStyle}>
        <img src={platform.logo} alt={platform.name} style={logoStyle} />
        <div>
          <div style={platformNameStyle}>{platform.displayName}</div>
          <div style={protocolStyle}>{platform.name}</div>
        </div>
        <span style={chainBadgeStyle}>Chain {platform.chainId}</span>
      </div>

      {positions.map((position) => (
        <div
          key={`${position.platformId}-${position.token.address}-${position.type}`}
          style={positionRowStyle}
        >
          <div style={tokenInfoStyle}>
            {position.token.logo && (
              <img
                src={position.token.logo}
                alt={position.token.symbol}
                style={tokenLogoStyle}
              />
            )}
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500 }}>
                {position.amount.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{" "}
                {position.token.symbol}
              </div>
              {position.amountUsd > 0 && (
                <div style={amountStyle}>
                  $
                  {position.amountUsd.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>
            <span style={typeBadgeStyle(position.type)}>{position.type}</span>
          </div>
          <div style={rightStyle}>
            <div style={apyStyle(position.apy.net)}>
              {position.apy.net.toFixed(2)}%
            </div>
            <div style={amountStyle}>APY</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { PositionCard, type PositionCardProps };
