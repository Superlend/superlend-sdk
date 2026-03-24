import { createFileRoute } from "@tanstack/react-router";
import { EthersPortfolioDemo } from "@/components/ethers-portfolio-demo";

export const Route = createFileRoute("/ethers/portfolio")({
  component: EthersPortfolioDemo,
});
