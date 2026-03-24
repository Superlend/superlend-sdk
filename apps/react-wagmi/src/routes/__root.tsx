import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { DemoConfigProvider } from "@/context/demo-config";
import { DemoSettingsProvider } from "@/context/demo-settings";
import { WidgetThemeProvider } from "@/context/widget-theme";

export const Route = createRootRoute({
  component: () => (
    <WidgetThemeProvider>
      <DemoConfigProvider>
        <DemoSettingsProvider>
          <div className="flex h-svh flex-col">
            <Header />
            <Outlet />
          </div>
        </DemoSettingsProvider>
      </DemoConfigProvider>
    </WidgetThemeProvider>
  ),
});
