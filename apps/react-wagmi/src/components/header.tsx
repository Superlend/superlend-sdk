import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Inline" },
  { to: "/compact", label: "Compact" },
  { to: "/dialog", label: "Dialog" },
  { to: "/callback", label: "Callback" },
] as const

export function Header() {
  const router = useRouterState()
  const pathname = router.location.pathname

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-semibold">SuperLend Demo</h1>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <ConnectButton showBalance={false} accountStatus="address" />
      </div>
    </header>
  )
}
