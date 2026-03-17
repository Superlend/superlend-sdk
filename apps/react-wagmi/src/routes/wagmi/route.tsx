import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WagmiProvider } from "wagmi";

import { Header } from "@/components/header";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/config/wagmi";

export const Route = createFileRoute("/wagmi")({
  component: () => (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <Header
          connectButton={
            <ConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
          }
        />
        <PageLayout>
          <Outlet />
        </PageLayout>
      </RainbowKitProvider>
    </WagmiProvider>
  ),
});
