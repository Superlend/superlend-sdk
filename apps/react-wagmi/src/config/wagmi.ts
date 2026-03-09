import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, base, arbitrum, optimism, polygon } from "wagmi/chains"

export const config = getDefaultConfig({
  appName: "SuperLend SDK Demo",
  projectId: import.meta.env.VITE_WC_PROJECT_ID ?? "demo",
  chains: [mainnet, base, arbitrum, optimism, polygon],
})
