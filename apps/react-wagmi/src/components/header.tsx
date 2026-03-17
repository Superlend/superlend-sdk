import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const adapters = [
  { to: "/wagmi", label: "wagmi" },
  { to: "/ethers", label: "ethers" },
] as const;

const variants = [
  { suffix: "", label: "Inline" },
  { suffix: "/dialog", label: "Dialog" },
] as const;

export function Header({ connectButton }: { connectButton?: ReactNode }) {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const activeAdapter = adapters.find((a) => pathname.startsWith(a.to))?.to;

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold hover:text-foreground">
            SuperLend Demo
          </Link>
          <nav className="flex items-center gap-3">
            <div className="flex gap-1">
              {adapters.map((adapter) => (
                <Link
                  key={adapter.to}
                  to={adapter.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    pathname.startsWith(adapter.to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {adapter.label}
                </Link>
              ))}
            </div>
            {activeAdapter && (
              <>
                <span className="text-muted-foreground/40">|</span>
                <div className="flex gap-1">
                  {variants.map((v) => {
                    const to = `${activeAdapter}${v.suffix}`;
                    const isActive =
                      pathname === to ||
                      (v.suffix === "" && pathname === `${activeAdapter}/`);
                    return (
                      <Link
                        key={v.suffix}
                        to={to}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {v.label}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </nav>
        </div>
        {connectButton}
      </div>
    </header>
  );
}
