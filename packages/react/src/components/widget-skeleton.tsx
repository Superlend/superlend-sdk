import type React from "react";
import type { CSSProperties } from "react";
import { useTheme } from "../context/theme.context";

const SkeletonBar: React.FC<{ width: string; height: string }> = ({
  width,
  height,
}) => {
  const theme = useTheme();

  const style: CSSProperties = {
    width,
    height,
    borderRadius: theme.radius,
    background: `${theme.text}15`,
    animation: "sl-pulse 1.5s ease-in-out infinite",
  };

  return <div style={style} />;
};

const WidgetSkeleton: React.FC = () => {
  const theme = useTheme();

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
    borderRadius: theme.radius,
    background: theme.bg,
  };

  return (
    <div style={containerStyle}>
      <SkeletonBar width="60%" height="16px" />
      <SkeletonBar width="100%" height="56px" />
      <SkeletonBar width="100%" height="56px" />
      <SkeletonBar width="40%" height="12px" />
    </div>
  );
};

export { WidgetSkeleton };
