import { SuperLendWidget, walletAdapters } from "@superlend/react";
import type { WalletClient, WidgetVariant } from "@superlend/react";
import type { Market, SupplyCalldataResponse } from "@superlend/sdk";
import { useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useWidgetTheme } from "@/context/widget-theme";
import { useDemoConfig } from "@/context/demo-config";
import { TokenNetworkSelector } from "@/components/token-network-selector";

function useSuperlendWalletClient(): WalletClient | undefined {
  const { data: wagmiWalletClient } = useWalletClient();
  const publicClient = usePublicClient();
  return useMemo(
    () => (wagmiWalletClient ? walletAdapters.fromViem(wagmiWalletClient, publicClient) : undefined),
    [wagmiWalletClient, publicClient],
  );
}

type WidgetDemoProps = {
  variant: WidgetVariant;
  useCallback?: boolean;
};

export function WidgetDemo({ variant, useCallback }: WidgetDemoProps) {
  const { address } = useAccount();
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
        apiKey="test_key"
        tokenAddress={token.address}
        amount={token.demoAmount}
        chainId={network.chainId}
        userAddress={address}
        variant={variant}
        baseUrl=""
        walletClient={useCallback ? undefined : walletClient}
        onAction={handleAction}
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
