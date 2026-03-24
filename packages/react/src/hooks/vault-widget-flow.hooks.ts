import type { VaultOpportunity } from "@superlend/sdk";
import { useReducer } from "react";

type VaultOpportunitiesView = { view: "opportunities" };
type VaultAmountInputView = { view: "amount-input"; vault: VaultOpportunity };
type VaultTransactionView = {
  view: "transaction";
  vault: VaultOpportunity;
  amount: string;
};

type VaultWidgetFlowState =
  | VaultOpportunitiesView
  | VaultAmountInputView
  | VaultTransactionView;

type VaultWidgetFlowAction =
  | { type: "SELECT_VAULT"; vault: VaultOpportunity }
  | { type: "CONFIRM_AMOUNT"; amount: string }
  | { type: "BACK" }
  | { type: "RESET" };

function vaultWidgetReducer(
  state: VaultWidgetFlowState,
  action: VaultWidgetFlowAction,
): VaultWidgetFlowState {
  switch (action.type) {
    case "SELECT_VAULT":
      return { view: "amount-input", vault: action.vault };
    case "CONFIRM_AMOUNT":
      if (state.view === "amount-input") {
        return {
          view: "transaction",
          vault: state.vault,
          amount: action.amount,
        };
      }
      return state;
    case "BACK":
      if (state.view === "amount-input" || state.view === "transaction") {
        return { view: "opportunities" };
      }
      return state;
    case "RESET":
      return { view: "opportunities" };
  }
  return state;
}

const useVaultWidgetFlow = () => {
  const [state, dispatch] = useReducer(vaultWidgetReducer, {
    view: "opportunities",
  });

  return {
    state,
    selectVault: (vault: VaultOpportunity) =>
      dispatch({ type: "SELECT_VAULT", vault }),
    confirmAmount: (amount: string) =>
      dispatch({ type: "CONFIRM_AMOUNT", amount }),
    goBack: () => dispatch({ type: "BACK" }),
    reset: () => dispatch({ type: "RESET" }),
  };
};

export {
  useVaultWidgetFlow,
  type VaultWidgetFlowAction,
  type VaultWidgetFlowState,
  vaultWidgetReducer,
};
