import type {
  WalletClient,
  WidgetCalldata,
  WidgetOpportunity,
} from "@superlend/react-sdk";
import { OverviewWidget, walletAdapters } from "@superlend/react-sdk";
import { useMemo } from "react";
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

export function EthersOverviewDemo() {
  const { address, connect } = useEthersWallet();
  const walletClient = useSuperlendWalletClient();
  const { theme } = useWidgetTheme();
  const { network, token } = useDemoConfig();
  const { variant, useCallback } = useDemoSettings();

  const handleAction = useCallback
    ? (opportunity: WidgetOpportunity, calldata: WidgetCalldata) => {
        console.log("onAction callback:", { opportunity, calldata });
      }
    : undefined;

  return (
    <div className="mx-auto w-full max-w-md">
      <OverviewWidget
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
    </div>
  );
}
