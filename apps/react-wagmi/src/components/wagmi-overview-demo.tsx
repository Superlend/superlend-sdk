import { useConnectModal } from "@rainbow-me/rainbowkit";
import type {
  WalletClient,
  WidgetCalldata,
  WidgetOpportunity,
} from "@superlend/react-sdk";
import { OverviewWidget, walletAdapters } from "@superlend/react-sdk";
import { useMemo } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useDemoConfig } from "@/context/demo-config";
import { useDemoSettings } from "@/context/demo-settings";
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

export function WagmiOverviewDemo() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
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
        onConnectWallet={openConnectModal}
        theme={theme}
      />
    </div>
  );
}
