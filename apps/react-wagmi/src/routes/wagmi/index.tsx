import { createFileRoute } from "@tanstack/react-router";
import { WagmiOverviewDemo } from "@/components/wagmi-overview-demo";

export const Route = createFileRoute("/wagmi/")({
  component: WagmiOverviewDemo,
});
