import { NETWORKS } from "@/config/tokens"
import { useDemoConfig } from "@/context/demo-config"
import { cn } from "@/lib/utils"

export function TokenNetworkSelector() {
  const { network, token, setNetwork, setToken } = useDemoConfig()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {NETWORKS.map((n) => (
          <button
            key={n.chainId}
            onClick={() => setNetwork(n)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              n.chainId === network.chainId
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {n.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {network.tokens.map((t) => (
          <button
            key={t.symbol}
            onClick={() => setToken(t)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              t.symbol === token.symbol
                ? "bg-primary text-primary-foreground"
                : "border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {t.symbol}
          </button>
        ))}
      </div>
    </div>
  )
}
