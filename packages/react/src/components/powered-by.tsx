import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

const PoweredBy: React.FC = () => {
  const theme = useTheme();

  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "8px 0",
    fontSize: "11px",
    color: `${theme.text}80`,
    textDecoration: "none",
  };

  return (
    <a
      href="https://superlend.xyz"
      target="_blank"
      rel="noopener noreferrer"
      className="sl-powered-by"
      style={style}
    >
      powered by <span style={{ fontWeight: 600 }}>SuperLend</span>
    </a>
  );
};

export { PoweredBy };
