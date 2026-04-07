"use client";

import { EthersConnectButton } from "@/components/ethers-connect-button";
import { PageLayout } from "@/components/page-layout";
import { SettingsPanel } from "@/components/settings-panel";
import { EthersWalletProvider } from "@/context/ethers-wallet";

export default function EthersRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EthersWalletProvider>
      <PageLayout
        rightPane={<SettingsPanel walletButton={<EthersConnectButton />} />}
      >
        {children}
      </PageLayout>
    </EthersWalletProvider>
  );
}
