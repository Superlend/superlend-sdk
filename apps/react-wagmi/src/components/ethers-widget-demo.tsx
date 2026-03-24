import type {
  WalletClient,
  WidgetCalldata,
  WidgetOpportunity,
} from "@superlend/react-sdk";
import { SuperLendWidget, walletAdapters } from "@superlend/react-sdk";
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
  const [includeVaults, setIncludeVaults] = useState(true);
  const { variant, useCallback, showCode } = useDemoSettings();
  const [lastAction, setLastAction] = useState<{
    opportunity: WidgetOpportunity;
    calldata: WidgetCalldata;
  } | null>(null);

  const handleAction = useCallback
    ? (opportunity: WidgetOpportunity, calldata: WidgetCalldata) => {
        setLastAction({ opportunity, calldata });
        console.log("onAction callback:", { opportunity, calldata });
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
        <label
          className="flex items-center gap-2 text-xs"
          style={{ color: theme.text }}
        >
          <input
            type="checkbox"
            checked={includeVaults}
            onChange={(e) => setIncludeVaults(e.target.checked)}
          />
          Include Superlend vaults
        </label>
        <SuperLendWidget
          apiKey={import.meta.env.VITE_SUPERLEND_API_KEY || ""}
          tokenAddress={token.address}
          initialAmount={token.demoAmount}
          chainId={network.chainId}
          userAddress={address}
          variant={variant}
          baseUrl={import.meta.env.VITE_SUPERLEND_API_URL || undefined}
          includeVaults={includeVaults}
          vaultsFirst={true}
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
