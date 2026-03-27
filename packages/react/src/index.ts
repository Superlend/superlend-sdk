export { walletAdapters } from "./adapters";
export {
  PortfolioWidget,
  type PortfolioWidgetProps,
} from "./components/portfolio-widget";
export { SuperLendWidget } from "./components/superlend-widget";
export { VaultWidget, type VaultWidgetProps } from "./components/vault-widget";
export { useMarkets } from "./hooks/opportunities.hooks";
export { usePortfolio } from "./hooks/portfolio.hooks";
export { useTransaction } from "./hooks/transaction.hooks";
export { useVaultMarkets } from "./hooks/vault-opportunities.hooks";
export { useVaultTransaction } from "./hooks/vault-transaction.hooks";

export type {
  ResolvedTheme,
  ThemeConfig,
  WalletClient,
  WidgetCalldata,
  WidgetOpportunity,
  WidgetProps,
  WidgetVariant,
} from "./types";
