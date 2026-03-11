import type { Market } from "@superlend/sdk";
import { useReducer } from "react";

type OpportunitiesView = { view: "opportunities" };
type AmountInputView = { view: "amount-input"; market: Market };
type TransactionView = { view: "transaction"; market: Market; amount: string };

type WidgetFlowState = OpportunitiesView | AmountInputView | TransactionView;

type WidgetFlowAction =
  | { type: "SELECT_MARKET"; market: Market }
  | { type: "CONFIRM_AMOUNT"; amount: string }
  | { type: "BACK" }
  | { type: "RESET" };

function widgetReducer(
  state: WidgetFlowState,
  action: WidgetFlowAction,
): WidgetFlowState {
  switch (action.type) {
    case "SELECT_MARKET":
      return { view: "amount-input", market: action.market };
    case "CONFIRM_AMOUNT":
      if (state.view === "amount-input") {
        return { view: "transaction", market: state.market, amount: action.amount };
      }
      return state;
    case "BACK":
      if (state.view === "amount-input" || state.view === "transaction") {
        return { view: "opportunities" };
      }
      return state;
    case "RESET":
      return { view: "opportunities" };
    default:
      return state;
  }
}

const useWidgetFlow = () => {
  const [state, dispatch] = useReducer(widgetReducer, {
    view: "opportunities",
  });

  return {
    state,
    selectMarket: (market: Market) =>
      dispatch({ type: "SELECT_MARKET", market }),
    confirmAmount: (amount: string) =>
      dispatch({ type: "CONFIRM_AMOUNT", amount }),
    goBack: () => dispatch({ type: "BACK" }),
    reset: () => dispatch({ type: "RESET" }),
  };
};

export { useWidgetFlow, widgetReducer, type WidgetFlowState, type WidgetFlowAction };
