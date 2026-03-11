import { Outlet, createRootRoute } from "@tanstack/react-router"
import type { CSSProperties } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WidgetThemeProvider, useWidgetTheme } from "@/context/widget-theme"
import { DemoConfigProvider } from "@/context/demo-config"

const GRID_PATTERN: CSSProperties = {
  backgroundImage: `linear-gradient(rgba(128,128,128,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.12) 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
}

function RootLayout() {
  const { theme } = useWidgetTheme()

  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <main
        className="flex-1 transition-colors duration-300"
        style={{ backgroundColor: theme.bg, ...GRID_PATTERN }}
      >
        <div className="mx-auto w-full max-w-md px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <WidgetThemeProvider>
      <DemoConfigProvider>
        <RootLayout />
      </DemoConfigProvider>
    </WidgetThemeProvider>
  ),
})
