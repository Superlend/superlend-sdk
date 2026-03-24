import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EthersConnectButton } from "@/components/ethers-connect-button";
import { PageLayout } from "@/components/page-layout";
import { SettingsPanel } from "@/components/settings-panel";
import { EthersWalletProvider } from "@/context/ethers-wallet";

export const Route = createFileRoute("/ethers")({
  component: () => (
    <EthersWalletProvider>
      <PageLayout
        rightPane={<SettingsPanel walletButton={<EthersConnectButton />} />}
      >
        <Outlet />
      </PageLayout>
    </EthersWalletProvider>
  ),
});
