# TODO — Open Source Readiness

## Blockers — Functional

- [x] **Token approval flow** — ERC-20 `approve()` before supply, exact amount approval, allowance check via `WalletClient.getAllowance`
- [x] **Automatic network switching** — `WalletClient.switchChain()` with chain mismatch detection in `useTransaction` hook

## Blockers — Open Source

- [x] Add LICENSE file (MIT?) at repo root
- [x] Add package.json metadata to `@superlend/sdk` and `@superlend/react-sdk` — `description`, `license`, `repository`, `homepage`, `keywords`, `author`
- [x] Add README for `packages/sdk/`
- [x] Add README for `packages/react/`

## Warnings

- [x] Add CLAUDE.md to `.gitignore`
- [ ] Improve root README — install instructions, quickstart, badges
- [x] Add `.env*` to `.gitignore` (already present)
- [ ] Add GitHub Actions CI — test, lint, publish workflows
- [ ] Add CONTRIBUTING.md

## Refactor

- [ ] **Headless hooks architecture** — `WidgetContent` is a god component that owns flow state, tx orchestration, and `onAction` calldata building. Refactor:
  - Extract `useSupplyFlow` orchestration hook composing `useWidgetFlow` + `useTransaction` + `onAction` calldata handling
  - Export `useWidgetFlow` so integrators can drive the flow with custom UI
  - Move `onAction` calldata-building logic out of `WidgetContent` into the hook layer
  - Extract `rawToHuman` / `humanToRaw` to shared `utils/amount.ts` (currently duplicated in `AmountInput` and `TransactionFlow`)
  - Make `WidgetContent` a thin render layer — only reads hook state and passes props to dumb components
  - Export all hooks (`useSupplyFlow`, `useWidgetFlow`, `useTransaction`, `useMarkets`) for headless usage

## Nice-to-haves

- [ ] Add `.changesetrc.json` config
- [ ] Expand test coverage (schema validation, accessibility, error edge cases)
