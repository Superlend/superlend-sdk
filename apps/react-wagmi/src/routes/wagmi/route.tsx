import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WagmiProvider } from "wagmi";

import { PageLayout } from "@/components/page-layout";
import { SettingsPanel } from "@/components/settings-panel";
import { config } from "@/config/wagmi";

export const Route = createFileRoute("/wagmi")({
  component: () => (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <PageLayout
          rightPane={
            <SettingsPanel
              walletButton={
                <ConnectButton
                  showBalance={false}
                  accountStatus="address"
                  chainStatus="icon"
                />
              }
            />
          }
        >
          <Outlet />
        </PageLayout>
      </RainbowKitProvider>
    </WagmiProvider>
  ),
});
