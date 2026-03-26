import { createContext, useContext, useState } from "react";
import type { NetworkConfig, TokenConfig } from "@/config/tokens";
import {
  DEFAULT_NETWORK,
  DEFAULT_TOKEN,
  DEFAULT_VAULT_NETWORK,
  DEFAULT_VAULT_TOKEN,
} from "@/config/tokens";

type DemoConfigContextValue = {
  network: NetworkConfig;
  token: TokenConfig;
  vaultNetwork: NetworkConfig;
  vaultToken: TokenConfig;
  setNetwork: (network: NetworkConfig) => void;
  setToken: (token: TokenConfig) => void;
  setVaultNetwork: (network: NetworkConfig) => void;
  setVaultToken: (token: TokenConfig) => void;
};

const DemoConfigContext = createContext<DemoConfigContextValue | null>(null);

export function DemoConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [network, setNetworkState] = useState<NetworkConfig>(DEFAULT_NETWORK);
  const [token, setToken] = useState<TokenConfig>(DEFAULT_TOKEN);
  const [vaultNetwork, setVaultNetworkState] =
    useState<NetworkConfig>(DEFAULT_VAULT_NETWORK);
  const [vaultToken, setVaultTokenState] =
    useState<TokenConfig>(DEFAULT_VAULT_TOKEN);

  const setNetwork = (n: NetworkConfig) => {
    setNetworkState(n);
    // keep same symbol if available on new network, else fall back to first token
    const same = n.tokens.find((t) => t.symbol === token.symbol);
    setToken(same ?? n.tokens[0]);
  };

  const setVaultNetwork = (n: NetworkConfig) => {
    setVaultNetworkState(n);
    // keep same symbol if available on new network, else fall back to first token
    const same = n.tokens.find((t) => t.symbol === vaultToken.symbol);
    setVaultTokenState(same ?? n.tokens[0]);
  };

  return (
    <DemoConfigContext.Provider
      value={{
        network,
        token,
        vaultNetwork,
        vaultToken,
        setNetwork,
        setToken,
        setVaultNetwork,
        setVaultToken: setVaultTokenState,
      }}
    >
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig() {
  const ctx = useContext(DemoConfigContext);
  if (!ctx)
    throw new Error("useDemoConfig must be used within DemoConfigProvider");
  return ctx;
}
