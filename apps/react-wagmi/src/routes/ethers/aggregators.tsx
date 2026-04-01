import { createFileRoute } from "@tanstack/react-router";
import { EthersAggregatorWidgetDemo } from "@/components/ethers-aggregator-widget";

export const Route = createFileRoute("/ethers/aggregators")({
  component: EthersAggregatorWidgetDemo,
});
