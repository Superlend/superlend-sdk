import type {
  Market,
  SupplyCalldataResponse,
  VaultDepositCalldataResponse,
  VaultOpportunity,
} from "@superlend/sdk";

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
  /** Colour for positive values (e.g. supply APY). Defaults to green. */
  positive?: string;
  /** Colour for negative values (e.g. borrow APY). Defaults to red. */
  negative?: string;
};

export type ResolvedTheme = Required<ThemeConfig>;

type WidgetCommonProps = {
  /** API key issued by SuperLend. */
  apiKey: string;
  /** ERC-20 token address (lending) or default deposit asset (vaults). */
  tokenAddress: string;
  /** Raw token amount in the token's smallest unit. Pre-fills the amount input. */
  initialAmount?: string;
  chainId: number;
  /** Connected wallet address. Used to build calldata. */
  userAddress?: string;
  variant?: WidgetVariant;
  theme?: ThemeConfig;
  /**
   * Provide a wallet client to let the widget execute transactions directly.
   * Mutually exclusive with `onAction`.
   */
  walletClient?: WalletClient;
  /**
   * Callback invoked when the user tries to proceed without a connected wallet.
   * The button label changes to "Connect Wallet" when neither `walletClient` nor `onAction` is provided.
   */
  onConnectWallet?: () => void;
  partnerId?: string;
  /** Maximum number of opportunities to display. */
  limit?: number;
  /** Include Superlend vault opportunities in the same list. */
  includeVaults?: boolean;
  /** Show vault opportunities before lending markets. Defaults to true. */
  vaultsFirst?: boolean;
  /** Override the API base URL. */
  baseUrl?: string;
};

export type WidgetOpportunity = Market | VaultOpportunity;
export type WidgetCalldata =
  | SupplyCalldataResponse
  | VaultDepositCalldataResponse;

export type WidgetProps = WidgetCommonProps & {
  /**
   * Callback with selected opportunity and generated calldata.
   * Mutually exclusive with `walletClient`.
   */
  onAction?: (opportunity: WidgetOpportunity, calldata: WidgetCalldata) => void;
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
