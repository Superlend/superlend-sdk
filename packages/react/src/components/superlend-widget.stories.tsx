import preview from "../../.storybook/preview";
import { SuperLendWidget } from "./superlend-widget";

const meta = preview.meta({
  component: SuperLendWidget,
  args: {
    apiKey: "test_key",
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    amount: "10000000",
    chainId: 1,
    baseUrl: "",
  },
});

export const Inline = meta.story({
  args: {
    variant: "inline",
  },
});

export const Compact = meta.story({
  args: {
    variant: "compact",
  },
});

export const Dialog = meta.story({
  args: {
    variant: "dialog",
  },
});

export const CustomTheme = meta.story({
  args: {
    variant: "inline",
    theme: {
      bg: "#1a1a2e",
      accent: "#00d395",
      primary: "#7b61ff",
      text: "#e0e0e0",
      radius: "16px",
    },
  },
});

export const WithOnAction = meta.story({
  args: {
    variant: "inline",
    onAction: (market, calldata) => {
      console.log("onAction fired", { market, calldata });
    },
  },
});
