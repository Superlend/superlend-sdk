import { createFileRoute } from "@tanstack/react-router";
import { WagmiAggregatorWidgetDemo } from "@/components/wagmi-aggregator-widget";

export const Route = createFileRoute("/wagmi/aggregators")({
  component: WagmiAggregatorWidgetDemo,
});
