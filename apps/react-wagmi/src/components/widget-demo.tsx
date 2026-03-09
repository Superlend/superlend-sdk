import { SuperLendWidget } from "@superlend/react";
import type { WalletClient, WidgetVariant } from "@superlend/react";
import type { Market, SupplyCalldataResponse } from "@superlend/sdk";
import { useMemo, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

function useSuperlendWalletClient(): WalletClient | undefined {
  const { data: wagmiWalletClient } = useWalletClient();

  return useMemo(() => {
    if (!wagmiWalletClient) return undefined;
    return {
      sendTransaction: async ({ to, data, value }) => {
        const hash = await wagmiWalletClient.sendTransaction({
          to: to as `0x${string}`,
          data: data as `0x${string}`,
          value: BigInt(value),
          chain: wagmiWalletClient.chain,
        });
        return hash;
      },
    };
  }, [wagmiWalletClient]);
}

type WidgetDemoProps = {
  variant: WidgetVariant;
  useCallback?: boolean;
};

export function WidgetDemo({ variant, useCallback }: WidgetDemoProps) {
  const { address } = useAccount();
  const walletClient = useSuperlendWalletClient();
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
      <SuperLendWidget
        apiKey="test_key"
        tokenAddress="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        amount="10000000"
        chainId={1}
        userAddress={address}
        variant={variant}
        baseUrl=""
        walletClient={useCallback ? undefined : walletClient}
        onAction={handleAction}
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
