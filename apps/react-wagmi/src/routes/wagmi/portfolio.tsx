import { createFileRoute } from "@tanstack/react-router";
import { WagmiPortfolioDemo } from "@/components/wagmi-portfolio-demo";

function PortfolioPage() {
  return <WagmiPortfolioDemo />;
}

export const Route = createFileRoute("/wagmi/portfolio")({
  component: PortfolioPage,
});
