<p align="center">
  <img src="https://app.superlend.xyz/images/superlend-logo.webp" alt="SuperLend" width="200" />
</p>

# SuperLend SDK

Embed lending opportunities into your app. After a user swaps tokens, show them the best supply rates across DeFi protocols.

## Packages

| Package | Description |
|---|---|
| [`@superlend/sdk`](./packages/sdk) | TypeScript client — fetch markets, build supply calldata |
| [`@superlend/react-sdk`](./packages/react) | React widget and headless hooks |

## Quick Start

```bash
pnpm add @superlend/sdk @superlend/react-sdk
```

```tsx
import { SuperLendWidget, walletAdapters } from '@superlend/react-sdk';

<SuperLendWidget
  apiKey="your_key"
  tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  amount="1000000"
  chainId={8453}
  walletClient={walletAdapters.fromViemWalletClient(viemClient)}
/>
```

See individual package READMEs for full API docs.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
```

## License

[MIT](./LICENSE)
