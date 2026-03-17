# @superlend/sdk

TypeScript client for the SuperLend API. Fetch lending markets and build supply calldata.

## Install

```bash
pnpm add @superlend/sdk
```

## Usage

```ts
import { SuperLendClient } from '@superlend/sdk';

const client = new SuperLendClient({ apiKey: 'your_key' });

const markets = await client.getTokenMarkets({
  tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
});

markets.match(
  (data) => console.log(data.markets),
  (err) => console.error(err.code, err.message),
);

const calldata = await client.buildSupplyCalldata({
  protocolId: 'aave-v3',
  platformId: 'aave-v3-base',
  token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amount: '1000000',
  userAddress: '0x...',
});

calldata.match(
  ({ to, data, value }) => wallet.sendTransaction({ to, data, value }),
  (err) => console.error(err),
);
```

All methods return `ResultAsync<T, HttpError>` via [neverthrow](https://github.com/supermacro/neverthrow).

## License

MIT
