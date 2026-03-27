import { createFileRoute } from "@tanstack/react-router";
import { EthersVaultsDemo } from "@/components/ethers-vaults-demo";

export const Route = createFileRoute("/ethers/vaults")({
  component: EthersVaultsDemo,
});
