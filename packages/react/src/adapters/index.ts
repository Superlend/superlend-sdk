import type { WalletClient } from "../types";

interface ViemWalletClient {
  sendTransaction: (params: {
    to: `0x${string}`;
    data: `0x${string}`;
    value: bigint;
    chain?: unknown;
  }) => Promise<`0x${string}`>;
  chain?: unknown;
}

interface EthersSigner {
  sendTransaction: (tx: {
    to: string;
    data: string;
    value: bigint;
  }) => Promise<{ hash: string }>;
}

interface Web3Account {
  sendTransaction: (tx: {
    to: string;
    data: string;
    value: string;
    gas?: string;
  }) => Promise<{ transactionHash: string }>;
}

/**
 * Adapts a viem `WalletClient` (or wagmi's `useWalletClient`) for use with the widget.
 *
 * @example
 * const { data: walletClient } = useWalletClient()
 * <SuperLendWidget walletClient={walletAdapters.fromViem(walletClient)} />
 */
function fromViem(client: ViemWalletClient): WalletClient {
  return {
    sendTransaction: async ({ to, data, value, chainId }) => {
      const hash = await client.sendTransaction({
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(value),
        chain: client.chain as never,
      });
      return hash;
    },
  };
}

/**
 * Adapts an ethers.js v5 or v6 `Signer` for use with the widget.
 *
 * @example
 * const signer = provider.getSigner()
 * <SuperLendWidget walletClient={walletAdapters.fromEthers(signer)} />
 */
function fromEthers(signer: EthersSigner): WalletClient {
  return {
    sendTransaction: async ({ to, data, value }) => {
      const tx = await signer.sendTransaction({ to, data, value: BigInt(value) });
      return tx.hash;
    },
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
