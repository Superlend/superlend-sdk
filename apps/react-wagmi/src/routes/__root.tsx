import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { DemoConfigProvider } from "@/context/demo-config";
import { DemoSettingsProvider } from "@/context/demo-settings";
import { useWidgetTheme, WidgetThemeProvider } from "@/context/widget-theme";

function RootLayout() {
  const { theme } = useWidgetTheme();

  return (
    <div
      className="flex h-svh flex-col transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <Header />
      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <WidgetThemeProvider>
      <DemoConfigProvider>
        <DemoSettingsProvider>
          <RootLayout />
        </DemoSettingsProvider>
      </DemoConfigProvider>
    </WidgetThemeProvider>
  ),
});
