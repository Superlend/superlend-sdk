import { NETWORKS } from "@/config/tokens";
import { useDemoConfig } from "@/context/demo-config";

export function TokenNetworkSelector() {
  const { network, token, setNetwork, setToken } = useDemoConfig();

  return (
    <div className="flex items-center gap-2">
      <select
        value={network.chainId}
        onChange={(e) => {
          const n = NETWORKS.find((n) => n.chainId === Number(e.target.value));
          if (n) setNetwork(n);
        }}
        className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
      >
        {NETWORKS.map((n) => (
          <option key={n.chainId} value={n.chainId}>
            {n.name}
          </option>
        ))}
      </select>

      <select
        value={token.symbol}
        onChange={(e) => {
          const t = network.tokens.find((t) => t.symbol === e.target.value);
          if (t) setToken(t);
        }}
        className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
      >
        {network.tokens.map((t) => (
          <option key={t.symbol} value={t.symbol}>
            {t.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
