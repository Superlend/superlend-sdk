import { VAULT_NETWORKS } from "@/config/tokens";
import { useDemoConfig } from "@/context/demo-config";
import { useWidgetTheme } from "@/context/widget-theme";

export function VaultTokenNetworkSelector() {
  const { vaultNetwork, vaultToken, setVaultNetwork, setVaultToken } =
    useDemoConfig();
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
        value={vaultNetwork.chainId}
        onChange={(e) => {
          const network = VAULT_NETWORKS.find(
            (n) => n.chainId === Number(e.target.value),
          );
          if (network) setVaultNetwork(network);
        }}
        className="px-2.5 py-1.5 text-xs font-medium outline-none"
        style={selectStyle}
      >
        {VAULT_NETWORKS.map((network) => (
          <option key={network.chainId} value={network.chainId}>
            {network.name}
          </option>
        ))}
      </select>

      <select
        value={vaultToken.symbol}
        onChange={(e) => {
          const token = vaultNetwork.tokens.find(
            (t) => t.symbol === e.target.value,
          );
          if (token) setVaultToken(token);
        }}
        className="px-2.5 py-1.5 text-xs font-medium outline-none"
        style={selectStyle}
      >
        {vaultNetwork.tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
