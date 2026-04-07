import { createFileRoute } from "@tanstack/react-router";
import { EthersOverviewDemo } from "@/components/ethers-overview-demo";

export const Route = createFileRoute("/ethers/")({
  component: EthersOverviewDemo,
});
