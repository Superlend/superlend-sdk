import { NETWORKS } from "@/config/tokens";
import { useDemoConfig } from "@/context/demo-config";
import { useWidgetTheme } from "@/context/widget-theme";

export function TokenNetworkSelector() {
  const { network, token, setNetwork, setToken } = useDemoConfig();
  const { theme } = useWidgetTheme();

  const selectStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    border: `1px solid ${theme.text}20`,
    borderRadius: theme.radius,
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={network.chainId}
        onChange={(e) => {
          const n = NETWORKS.find((n) => n.chainId === Number(e.target.value));
          if (n) setNetwork(n);
        }}
        className="px-2.5 py-1.5 text-xs font-medium outline-none"
        style={selectStyle}
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
        className="px-2.5 py-1.5 text-xs font-medium outline-none"
        style={selectStyle}
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
