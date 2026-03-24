import type { ReactNode } from "react";
import { NavPanel } from "@/components/nav-panel";
import { useWidgetTheme } from "@/context/widget-theme";

export function PageLayout({
  children,
  rightPane,
}: { children: ReactNode; rightPane?: ReactNode }) {
  const { theme } = useWidgetTheme();

  return (
    <div className="flex min-h-0 flex-1">
      <NavPanel />
      <main
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-8 transition-colors duration-300"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        {children}
      </main>
      {rightPane}
    </div>
  );
}
