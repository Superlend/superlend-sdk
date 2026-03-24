import { createFileRoute } from "@tanstack/react-router";
import { EthersWidgetDemo } from "@/components/ethers-widget-demo";

export const Route = createFileRoute("/ethers/aggregators")({
  component: EthersWidgetDemo,
});
