import type { WalletClient } from "@superlend/react-sdk";
import { SuperLendWidget, walletAdapters } from "@superlend/react-sdk";
import type { Market, SupplyCalldataResponse } from "@superlend/sdk";
import { useMemo, useState } from "react";
import { CodePreview } from "@/components/code-preview";
import { useDemoConfig } from "@/context/demo-config";
import { useDemoSettings } from "@/context/demo-settings";
import { useEthersWallet } from "@/context/ethers-wallet";
import { useWidgetTheme } from "@/context/widget-theme";

function useSuperlendWalletClient(): WalletClient | undefined {
  const { signer, eip1193Provider, chainId } = useEthersWallet();
  return useMemo(
    () =>
      signer
        ? walletAdapters.fromEthers(signer, { eip1193Provider, chainId })
        : undefined,
    [signer, eip1193Provider, chainId],
  );
}

export function EthersWidgetDemo() {
  const { address, connect } = useEthersWallet();
  const walletClient = useSuperlendWalletClient();
  const { theme } = useWidgetTheme();
  const { network, token } = useDemoConfig();
  const { variant, useCallback, showCode } = useDemoSettings();
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
    <>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
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
          initialAmount={token.demoAmount}
          chainId={network.chainId}
          userAddress={address}
          variant={variant}
          baseUrl={import.meta.env.VITE_SUPERLEND_API_URL || undefined}
          walletClient={useCallback ? undefined : walletClient}
          onAction={handleAction}
          onConnectWallet={connect}
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
      {showCode && <CodePreview mode="aggregator" adapter="ethers" />}
    </>
  );
}
