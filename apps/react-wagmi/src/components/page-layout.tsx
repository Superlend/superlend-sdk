import type { CSSProperties, ReactNode } from "react";
import { useWidgetTheme } from "@/context/widget-theme";

const GRID_PATTERN: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(128,128,128,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.12) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export function PageLayout({ children }: { children: ReactNode }) {
  const { theme } = useWidgetTheme();

  return (
    <main
      className="min-h-[calc(100svh-3.5rem)] transition-colors duration-300"
      style={{ backgroundColor: theme.bg, ...GRID_PATTERN }}
    >
      <div className="mx-auto w-full max-w-md px-6 py-8">{children}</div>
    </main>
  );
}
