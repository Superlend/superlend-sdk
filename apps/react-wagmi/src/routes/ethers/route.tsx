import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EthersConnectButton } from "@/components/ethers-connect-button";
import { Header } from "@/components/header";
import { PageLayout } from "@/components/page-layout";
import { EthersWalletProvider } from "@/context/ethers-wallet";

export const Route = createFileRoute("/ethers")({
  component: () => (
    <EthersWalletProvider>
      <Header connectButton={<EthersConnectButton />} />
      <PageLayout>
        <Outlet />
      </PageLayout>
    </EthersWalletProvider>
  ),
});
