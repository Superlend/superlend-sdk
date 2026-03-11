import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { WidgetDemo } from "@/components/widget-demo"
import { cn } from "@/lib/utils"

function InlinePage() {
  const [useCallback, setUseCallback] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setUseCallback(false)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            !useCallback ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          walletClient
        </button>
        <button
          onClick={() => setUseCallback(true)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            useCallback ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          onAction callback
        </button>
      </div>
      <WidgetDemo variant="inline" useCallback={useCallback} />
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: InlinePage,
})
