import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WagmiProvider } from "wagmi";

import { PageLayout } from "@/components/page-layout";
import { SettingsPanel } from "@/components/settings-panel";
import { config } from "@/config/wagmi";
import { useWidgetTheme } from "@/context/widget-theme";

function WagmiLayout() {
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
        <Outlet />
      </PageLayout>
    </RainbowKitProvider>
  );
}

export const Route = createFileRoute("/wagmi")({
  component: () => (
    <WagmiProvider config={config}>
      <WagmiLayout />
    </WagmiProvider>
  ),
});
