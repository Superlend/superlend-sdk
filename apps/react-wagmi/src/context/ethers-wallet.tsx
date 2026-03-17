import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type EthersWalletState = {
  address: string | undefined;
  chainId: number | undefined;
  signer: EthersSigner | undefined;
  eip1193Provider: Eip1193Provider | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
};

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
};

type EthersSigner = {
  sendTransaction: (tx: {
    to: string;
    data: string;
    value: bigint;
  }) => Promise<{ hash: string }>;
  provider: {
    getNetwork: () => Promise<{ chainId: bigint }>;
    call: (tx: { to: string; data: string }) => Promise<string>;
  } | null;
};

const EthersWalletContext = createContext<EthersWalletState | null>(null);

export function EthersWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>();
  const [chainId, setChainId] = useState<number>();
  const [signer, setSigner] = useState<EthersSigner>();
  const [eip1193Provider, setEip1193Provider] = useState<Eip1193Provider>();

  const getProvider = useCallback((): Eip1193Provider | undefined => {
    const w = window as unknown as Record<string, unknown>;
    return w.ethereum as Eip1193Provider | undefined;
  }, []);

  const createSigner = useCallback(
    async (provider: Eip1193Provider, addr: string): Promise<EthersSigner> => {
      return {
        sendTransaction: async (tx) => {
          const hash = await provider.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: addr,
                to: tx.to,
                data: tx.data,
                value: `0x${tx.value.toString(16)}`,
              },
            ],
          });
          return { hash: hash as string };
        },
        provider: {
          getNetwork: async () => {
            const id = (await provider.request({
              method: "eth_chainId",
            })) as string;
            return { chainId: BigInt(id) };
          },
          call: async (tx) => {
            const result = await provider.request({
              method: "eth_call",
              params: [{ to: tx.to, data: tx.data }, "latest"],
            });
            return result as string;
          },
        },
      };
    },
    [],
  );

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      alert(
        "No wallet detected. Please install MetaMask or another browser wallet.",
      );
      return;
    }

    const accounts = (await provider.request({
      method: "eth_requestAccounts",
    })) as string[];
    const addr = accounts[0];
    const chainIdHex = (await provider.request({
      method: "eth_chainId",
    })) as string;

    setAddress(addr);
    setChainId(Number(chainIdHex));
    setEip1193Provider(provider);
    setSigner(await createSigner(provider, addr));
  }, [createSigner, getProvider]);

  const disconnect = useCallback(() => {
    setAddress(undefined);
    setChainId(undefined);
    setSigner(undefined);
    setEip1193Provider(undefined);
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    const provider = getProvider();
    if (!provider || !address) return;

    const handleAccountsChanged = async (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        setSigner(await createSigner(provider, accounts[0]));
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const id = args[0] as string;
      setChainId(Number(id));
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("chainChanged", handleChainChanged);
    };
  }, [address, disconnect, createSigner, getProvider]);

  return (
    <EthersWalletContext.Provider
      value={{ address, chainId, signer, eip1193Provider, connect, disconnect }}
    >
      {children}
    </EthersWalletContext.Provider>
  );
}

export function useEthersWallet() {
  const ctx = useContext(EthersWalletContext);
  if (!ctx)
    throw new Error("useEthersWallet must be used within EthersWalletProvider");
  return ctx;
}
