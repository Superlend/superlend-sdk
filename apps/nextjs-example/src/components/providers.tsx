"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { DemoConfigProvider } from "@/context/demo-config";
import { DemoSettingsProvider } from "@/context/demo-settings";
import { WidgetThemeProvider } from "@/context/widget-theme";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WidgetThemeProvider>
          <DemoConfigProvider>
            <DemoSettingsProvider>{children}</DemoSettingsProvider>
          </DemoConfigProvider>
        </WidgetThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
