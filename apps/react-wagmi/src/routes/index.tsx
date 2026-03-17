import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { PageLayout } from "@/components/page-layout";
import { useWidgetTheme } from "@/context/widget-theme";

function HomePage() {
  const { theme } = useWidgetTheme();
  return (
    <>
      <Header />
      <PageLayout>
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
              SuperLend SDK Demo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a wallet adapter to explore the widget integration
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/wagmi"
              className="rounded-lg border bg-card px-6 py-4 text-center transition-colors hover:border-primary hover:bg-accent"
            >
              <p className="text-sm font-semibold">wagmi</p>
              <p className="mt-1 text-xs text-muted-foreground">
                RainbowKit + viem
              </p>
            </Link>
            <Link
              to="/ethers"
              className="rounded-lg border bg-card px-6 py-4 text-center transition-colors hover:border-primary hover:bg-accent"
            >
              <p className="text-sm font-semibold">ethers.js</p>
              <p className="mt-1 text-xs text-muted-foreground">
                EIP-1193 + raw provider
              </p>
            </Link>
          </div>
        </div>
      </PageLayout>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
