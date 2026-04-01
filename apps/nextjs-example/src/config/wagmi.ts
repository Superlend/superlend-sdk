import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http, type Transport } from "wagmi";
import {
  arbitrum,
  base,
  etherlink,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

const chains = [mainnet, base, arbitrum, optimism, polygon, etherlink] as const;
const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

export const config = wcProjectId
  ? getDefaultConfig({
      appName: "SuperLend SDK Demo",
      projectId: wcProjectId,
      chains,
    })
  : createConfig({
      chains,
      connectors: [
        injected(),
        coinbaseWallet({ appName: "SuperLend SDK Demo" }),
      ],
      transports: Object.fromEntries(
        chains.map((c) => [c.id, http()]),
      ) as Record<number, Transport>,
    });
