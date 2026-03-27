import { createFileRoute } from "@tanstack/react-router";
import { WagmiVaultsDemo } from "@/components/wagmi-vaults-demo";

export const Route = createFileRoute("/wagmi/vaults")({
  component: WagmiVaultsDemo,
});
