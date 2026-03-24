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
        className="flex-1 overflow-y-auto transition-colors duration-300"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        <div className="mx-auto w-full max-w-md px-6 py-8">{children}</div>
      </main>
      {rightPane}
    </div>
  );
}
