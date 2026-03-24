import { createFileRoute } from "@tanstack/react-router";
import { WagmiWidgetDemo } from "@/components/wagmi-widget-demo";

export const Route = createFileRoute("/wagmi/")({
  component: WagmiWidgetDemo,
});
