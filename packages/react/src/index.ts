export { walletAdapters } from "./adapters";
export {
  PortfolioWidget,
  type PortfolioWidgetProps,
} from "./components/portfolio-widget";
export { SuperLendWidget } from "./components/superlend-widget";
export { useMarkets } from "./hooks/opportunities.hooks";
export { usePortfolio } from "./hooks/portfolio.hooks";
export { useTransaction } from "./hooks/transaction.hooks";

export type {
  ResolvedTheme,
  ThemeConfig,
  WalletClient,
  WidgetProps,
  WidgetVariant,
} from "./types";
