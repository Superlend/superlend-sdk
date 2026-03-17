# @superlend/react-sdk

React SDK for SuperLend. Two ways to integrate:

1. **Widget** — pre-built UI component that handles everything
2. **Headless hooks** — bring your own UI, use the hooks directly

## Install

```bash
pnpm add @superlend/react-sdk @superlend/sdk
```

Peer dependencies: `react`, `react-dom`, `@tanstack/react-query`

## Widget

Pre-built component with market selection, transaction flow, and theming.

```tsx
import { SuperLendWidget, walletAdapters } from '@superlend/react-sdk';

// Let the widget handle transactions via a wallet adapter
<SuperLendWidget
  apiKey="your_key"
  tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  amount="1000000"
  chainId={8453}
  walletClient={walletAdapters.fromViemWalletClient(viemClient)}
/>

// Or receive calldata and handle transactions yourself
<SuperLendWidget
  apiKey="your_key"
  tokenAddress="0x..."
  amount="1000000"
  chainId={8453}
  onAction={(market, calldata) => sendTx(calldata)}
/>
```

Variants: `inline` (default), `dialog`

Wallet adapters: `fromViemWalletClient`, `fromEthersSigner`

## Headless Hooks

Skip the widget and build your own UI. The hooks give you data fetching and transaction orchestration without any rendering opinions.

```tsx
import { useMarkets, useTransaction } from '@superlend/react-sdk';

// Fetch markets
const { markets, isLoading } = useMarkets({ apiKey, tokenAddress, chainId });

// Execute supply transaction
const { execute, steps, isPending } = useTransaction({ client, walletClient });

await execute({ market, userAddress, amount });

// steps tracks each phase:
// steps.switchChain → { status: 'idle' | 'pending' | 'success' | 'error', needed: boolean }
// steps.approval    → { status, needed, error? }
// steps.supply      → { status, needed: true, error? }
```

## Theming

```tsx
<SuperLendWidget
  // ...
  theme={{
    bg: '#1a1a2e',
    primary: '#00d395',
    text: '#ffffff',
    radius: '12px',
  }}
/>
```

## License

MIT
