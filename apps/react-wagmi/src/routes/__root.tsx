import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { DemoConfigProvider } from "@/context/demo-config";
import { WidgetThemeProvider } from "@/context/widget-theme";

export const Route = createRootRoute({
  component: () => (
    <WidgetThemeProvider>
      <DemoConfigProvider>
        <div className="min-h-svh">
          <Outlet />
          <Footer />
        </div>
      </DemoConfigProvider>
    </WidgetThemeProvider>
  ),
});
