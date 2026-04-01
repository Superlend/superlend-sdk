"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { PageLayout } from "@/components/page-layout";
import { SettingsPanel } from "@/components/settings-panel";
import { config } from "@/config/wagmi";
import { useWidgetTheme } from "@/context/widget-theme";

function WagmiLayout({ children }: { children: React.ReactNode }) {
  const { background, theme } = useWidgetTheme();
  const rkTheme = background.isDark
    ? darkTheme({ accentColor: theme.primary, borderRadius: "medium" })
    : lightTheme({ accentColor: theme.primary, borderRadius: "medium" });

  return (
    <RainbowKitProvider theme={rkTheme}>
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
        {children}
      </PageLayout>
    </RainbowKitProvider>
  );
}

export default function WagmiRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <WagmiLayout>{children}</WagmiLayout>
    </WagmiProvider>
  );
}
