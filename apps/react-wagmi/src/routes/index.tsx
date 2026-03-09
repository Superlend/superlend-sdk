import { createFileRoute } from "@tanstack/react-router"
import { WidgetDemo } from "@/components/widget-demo"

export const Route = createFileRoute("/")({
  component: () => <WidgetDemo variant="inline" />,
})
