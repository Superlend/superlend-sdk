import { createFileRoute } from "@tanstack/react-router"
import { WidgetDemo } from "@/components/widget-demo"

export const Route = createFileRoute("/dialog")({
  component: () => <WidgetDemo variant="dialog" />,
})
