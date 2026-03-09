import type { Market, SupplyCalldataResponse } from "@superlend/sdk";

export type WidgetVariant = "inline" | "dialog" | "compact";

export type ThemeConfig = {
  bg?: string;
  primary?: string;
  accent?: string;
  text?: string;
  radius?: string;
};

export type ResolvedTheme = Required<ThemeConfig>;

export type WidgetProps = {
  apiKey: string;
  tokenAddress: string;
  amount: string;
  chainId: number;
  userAddress?: string;
  variant?: WidgetVariant;
  theme?: ThemeConfig;
  walletClient?: WalletClient;
  onAction?: (market: Market, calldata: SupplyCalldataResponse) => void;
  partnerId?: string;
  limit?: number;
  baseUrl?: string;
};

export type WalletClient = {
  sendTransaction: (params: {
    to: string;
    data: string;
    value: string;
    chainId: number;
  }) => Promise<string>;
};
