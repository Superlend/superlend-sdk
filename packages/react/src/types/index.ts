import type { Market, SupplyCalldataResponse } from "@superlend/sdk";

export type WidgetVariant = "inline" | "dialog";

/** CSS colour values for theming the widget. All fields are optional — unset fields fall back to defaults. */
export type ThemeConfig = {
  /** Widget background colour. */
  bg?: string;
  /** Primary interactive colour (buttons, APY values). */
  primary?: string;
  /** Accent colour (hover states, focus rings). */
  accent?: string;
  /** Primary text colour. */
  text?: string;
  /** Border radius applied to the widget and cards. */
  radius?: string;
  /** Border colour for the widget container and card borders. */
  border?: string;
};

export type ResolvedTheme = Required<ThemeConfig>;

export type WidgetProps = {
  /** API key issued by SuperLend. */
  apiKey: string;
  /** ERC-20 token address to find lending opportunities for. */
  tokenAddress: string;
  /** Raw token amount in the token's smallest unit. */
  amount: string;
  chainId: number;
  /** Connected wallet address. Used to build calldata. */
  userAddress?: string;
  variant?: WidgetVariant;
  theme?: ThemeConfig;
  /**
   * Provide a wallet client to let the widget execute transactions directly.
   * Use `walletAdapters` to wrap viem, ethers, or web3.js clients.
   * Mutually exclusive with `onAction`.
   */
  walletClient?: WalletClient;
  /**
   * Callback invoked with the selected market and its calldata instead of executing the transaction.
   * Use this to handle transaction execution yourself.
   * Mutually exclusive with `walletClient`.
   */
  onAction?: (market: Market, calldata: SupplyCalldataResponse) => void;
  /**
   * Callback invoked when the user tries to proceed without a connected wallet.
   * Use this to trigger your app's wallet connection flow.
   * The button label changes to "Connect Wallet" when neither `walletClient` nor `onAction` is provided.
   */
  onConnectWallet?: () => void;
  partnerId?: string;
  /** Maximum number of market opportunities to display. */
  limit?: number;
  /** Override the API base URL. */
  baseUrl?: string;
};

/**
 * Minimal wallet interface the widget requires for transaction execution.
 * Use `walletAdapters` to create one from viem, ethers, or web3.js.
 */
export type WalletClient = {
  sendTransaction: (params: {
    to: string;
    data: string;
    value: string;
    chainId: number;
  }) => Promise<string>;
  /**
   * Switch the wallet to a different chain. If provided, the widget will
   * automatically prompt a chain switch when the wallet is on the wrong network.
   */
  switchChain?: (chainId: number) => Promise<void>;
  /** Current chain ID of the connected wallet. Used to detect chain mismatches. */
  chainId?: number;
  /**
   * Read the ERC-20 allowance for a token. If provided, the widget will
   * check allowance before sending a redundant approval transaction.
   */
  getAllowance?: (params: {
    tokenAddress: string;
    owner: string;
    spender: string;
  }) => Promise<bigint>;
};
