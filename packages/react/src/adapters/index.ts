import type { WalletClient } from "../types";

const ERC20_ALLOWANCE_SIG = "0xdd62ed3e"; // keccak256("allowance(address,uint256)") first 4 bytes

interface ViemWalletClient {
  // biome-ignore lint: accept any viem-compatible sendTransaction signature
  sendTransaction: (params: any) => Promise<`0x${string}`>;
  chain?: { id: number } | null;
  switchChain?: (params: { id: number }) => Promise<void>;
}

interface ViemPublicClient {
  readContract: (params: {
    address: `0x${string}`;
    abi: readonly unknown[];
    functionName: string;
    args: readonly unknown[];
  }) => Promise<unknown>;
}

interface EthersEip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

interface EthersSigner {
  sendTransaction: (tx: {
    to: string;
    data: string;
    value: bigint;
  }) => Promise<{ hash: string }>;
  provider?: {
    getNetwork: () => Promise<{ chainId: bigint }>;
    call: (tx: { to: string; data: string }) => Promise<string>;
  } | null;
}

interface Web3Account {
  sendTransaction: (tx: {
    to: string;
    data: string;
    value: string;
    gas?: string;
  }) => Promise<{ transactionHash: string }>;
}

const ERC20_ALLOWANCE_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/**
 * Adapts a viem `WalletClient` (or wagmi's `useWalletClient`) for use with the widget.
 * Pass an optional `publicClient` to enable on-chain allowance checks.
 *
 * @example
 * const { data: walletClient } = useWalletClient()
 * const publicClient = usePublicClient()
 * walletAdapters.fromViem(walletClient, publicClient)
 */
function fromViem(
  client: ViemWalletClient,
  publicClient?: ViemPublicClient,
): WalletClient {
  return {
    sendTransaction: async ({ to, data, value, chainId: _chainId }) => {
      const hash = await client.sendTransaction({
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(value),
        // Pass null to skip viem's chain assertion. After switchChain, the
        // wagmi wallet client object is stale — client.chain still reflects
        // the old chain. null tells viem to send on whatever chain the wallet
        // is currently connected to.
        chain: null as unknown,
      });
      return hash;
    },
    switchChain: client.switchChain
      ? async (chainId: number) => {
          await client.switchChain?.({ id: chainId });
        }
      : undefined,
    get chainId() {
      return client.chain?.id;
    },
    getAllowance: publicClient
      ? async ({ tokenAddress, owner, spender }) => {
          const result = await publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: ERC20_ALLOWANCE_ABI,
            functionName: "allowance",
            args: [owner, spender],
          });
          return BigInt(result as string | number | bigint);
        }
      : undefined,
  };
}

/**
 * Adapts an ethers.js v5 or v6 `Signer` for use with the widget.
 * Pass an optional EIP-1193 provider (e.g. `window.ethereum`) to enable chain
 * switching, and `chainId` so the widget can detect chain mismatches.
 *
 * @example
 * const provider = new BrowserProvider(window.ethereum)
 * const signer = await provider.getSigner()
 * walletAdapters.fromEthers(signer, { eip1193Provider: window.ethereum, chainId: 8453 })
 */
function fromEthers(
  signer: EthersSigner,
  options?: { eip1193Provider?: EthersEip1193Provider; chainId?: number },
): WalletClient {
  return {
    sendTransaction: async ({ to, data, value }) => {
      const tx = await signer.sendTransaction({
        to,
        data,
        value: BigInt(value),
      });
      return tx.hash;
    },
    switchChain: options?.eip1193Provider
      ? async (chainId: number) => {
          await options.eip1193Provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        }
      : undefined,
    chainId: options?.chainId,
    getAllowance: signer.provider
      ? async ({ tokenAddress, owner, spender }) => {
          const ownerPadded = owner.slice(2).padStart(64, "0");
          const spenderPadded = spender.slice(2).padStart(64, "0");
          const calldata = `${ERC20_ALLOWANCE_SIG}${ownerPadded}${spenderPadded}`;
          const result = await signer.provider?.call({
            to: tokenAddress,
            data: calldata,
          });
          return BigInt(result ?? 0);
        }
      : undefined,
  };
}

/**
 * Adapts a web3.js v4 account for use with the widget.
 *
 * @example
 * const account = web3.eth.accounts.wallet[0]
 * <SuperLendWidget walletClient={walletAdapters.fromWeb3(account)} />
 */
function fromWeb3(account: Web3Account): WalletClient {
  return {
    sendTransaction: async ({ to, data, value }) => {
      const receipt = await account.sendTransaction({ to, data, value });
      return receipt.transactionHash;
    },
  };
}

export const walletAdapters = { fromViem, fromEthers, fromWeb3 };
