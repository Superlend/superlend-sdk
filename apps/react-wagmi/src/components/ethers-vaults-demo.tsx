import type {
  VaultDepositCalldataResponse,
  VaultOpportunity,
} from "@superlend/sdk";
import type { WalletClient } from "@superlend/react-sdk";
import { VaultWidget, walletAdapters } from "@superlend/react-sdk";
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

export function EthersVaultsDemo() {
  const { address, connect } = useEthersWallet();
  const walletClient = useSuperlendWalletClient();
  const { theme } = useWidgetTheme();
  const { vaultNetwork, vaultToken } = useDemoConfig();
  const { variant, useCallback, showCode } = useDemoSettings();
  const [lastAction, setLastAction] = useState<{
    opportunity: VaultOpportunity;
    calldata: VaultDepositCalldataResponse;
  } | null>(null);

  const handleAction = useCallback
    ? (opportunity: VaultOpportunity, calldata: VaultDepositCalldataResponse) => {
        setLastAction({ opportunity, calldata });
        console.log("vault onAction callback:", { opportunity, calldata });
      }
    : undefined;

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            Superlend Vaults
          </p>
          <p className="text-xs" style={{ color: `${theme.text}99` }}>
            Vault opportunities for {vaultToken.symbol} on {vaultNetwork.name}
          </p>
        </div>
        <VaultWidget
          apiKey={import.meta.env.VITE_SUPERLEND_API_KEY || ""}
          tokenAddress={vaultToken.address}
          initialAmount={vaultToken.demoAmount}
          chainId={vaultNetwork.chainId}
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
            <p className="mb-1 text-xs font-medium">Last vault onAction callback:</p>
            <pre className="overflow-x-auto text-[10px] leading-relaxed text-muted-foreground">
              {JSON.stringify(lastAction, null, 2)}
            </pre>
          </div>
        )}
      </div>
      {showCode && <CodePreview mode="vaults" adapter="ethers" />}
    </>
  );
}
