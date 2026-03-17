import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { WalletClient, WidgetVariant } from "@superlend/react";
import { SuperLendWidget, walletAdapters } from "@superlend/react";
import type { Market, SupplyCalldataResponse } from "@superlend/sdk";
import { useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { TokenNetworkSelector } from "@/components/token-network-selector";
import { useDemoConfig } from "@/context/demo-config";
import { useWidgetTheme } from "@/context/widget-theme";

function useSuperlendWalletClient(): WalletClient | undefined {
  const { data: wagmiWalletClient } = useWalletClient();
  const publicClient = usePublicClient();
  return useMemo(
    () =>
      wagmiWalletClient
        ? walletAdapters.fromViem(wagmiWalletClient, publicClient)
        : undefined,
    [wagmiWalletClient, publicClient],
  );
}

type WidgetDemoProps = {
  variant: WidgetVariant;
  useCallback?: boolean;
};

export function WagmiWidgetDemo({ variant, useCallback }: WidgetDemoProps) {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const walletClient = useSuperlendWalletClient();
  const { theme } = useWidgetTheme();
  const { network, token } = useDemoConfig();
  const [lastAction, setLastAction] = useState<{
    market: Market;
    calldata: SupplyCalldataResponse;
  } | null>(null);

  const handleAction = useCallback
    ? (market: Market, calldata: SupplyCalldataResponse) => {
        setLastAction({ market, calldata });
        console.log("onAction callback:", { market, calldata });
      }
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <TokenNetworkSelector />
      <div>
        <p className="text-sm font-medium" style={{ color: theme.text }}>
          Successfully swapped 10 {token.symbol}
        </p>
        <p className="text-xs" style={{ color: `${theme.text}99` }}>
          Let's put them to good use
        </p>
      </div>
      <SuperLendWidget
        apiKey={import.meta.env.VITE_SUPERLEND_API_KEY || ""}
        tokenAddress={token.address}
        amount={token.demoAmount}
        chainId={network.chainId}
        userAddress={address}
        variant={variant}
        baseUrl={import.meta.env.VITE_SUPERLEND_API_URL || undefined}
        walletClient={useCallback ? undefined : walletClient}
        onAction={handleAction}
        onConnectWallet={openConnectModal}
        theme={theme}
      />
      {lastAction && (
        <div className="rounded-md border bg-muted p-3">
          <p className="mb-1 text-xs font-medium">Last onAction callback:</p>
          <pre className="overflow-x-auto text-[10px] leading-relaxed text-muted-foreground">
            {JSON.stringify(lastAction, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
