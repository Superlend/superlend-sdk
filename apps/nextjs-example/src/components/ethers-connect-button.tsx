"use client";

import { useEthersWallet } from "@/context/ethers-wallet";

export function EthersConnectButton() {
  const { address, connect, disconnect } = useEthersWallet();

  if (address) {
    return (
      <button
        type="button"
        onClick={disconnect}
        className="rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Connect Wallet
    </button>
  );
}
