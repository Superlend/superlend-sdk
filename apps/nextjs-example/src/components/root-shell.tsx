"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { useWidgetTheme } from "@/context/widget-theme";

export function RootShell({ children }: { children: ReactNode }) {
  const { theme } = useWidgetTheme();

  return (
    <div
      className="flex h-svh flex-col transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <Header />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
