import { createFileRoute } from "@tanstack/react-router"
import { WidgetDemo } from "@/components/widget-demo"

export const Route = createFileRoute("/compact")({
  component: () => <WidgetDemo variant="compact" />,
})
