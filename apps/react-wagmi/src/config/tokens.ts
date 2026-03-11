export type TokenConfig = {
  symbol: string
  address: string
  decimals: number
  demoAmount: string
}

export type NetworkConfig = {
  chainId: number
  name: string
  tokens: TokenConfig[]
}

export const NETWORKS: NetworkConfig[] = [
  {
    chainId: 1,
    name: "Ethereum",
    tokens: [
      { symbol: "USDC",   address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",   address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "DAI",    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, demoAmount: "10000000000000000000" },
      { symbol: "WETH",   address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "wstETH", address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", decimals: 18, demoAmount: "5000000000000000"  },
    ],
  },
  {
    chainId: 8453,
    name: "Base",
    tokens: [
      { symbol: "USDC",   address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",   address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "DAI",    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18, demoAmount: "10000000000000000000" },
      { symbol: "WETH",   address: "0x4200000000000000000000000000000000000006", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "wstETH", address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452", decimals: 18, demoAmount: "5000000000000000"  },
    ],
  },
  {
    chainId: 42161,
    name: "Arbitrum",
    tokens: [
      { symbol: "USDC",   address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",   address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "DAI",    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18, demoAmount: "10000000000000000000" },
      { symbol: "WETH",   address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "wstETH", address: "0x5979D7b546E38E414F7E9822514be443A4800529", decimals: 18, demoAmount: "5000000000000000"  },
    ],
  },
  {
    chainId: 10,
    name: "Optimism",
    tokens: [
      { symbol: "USDC",   address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",   address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "DAI",    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18, demoAmount: "10000000000000000000" },
      { symbol: "WETH",   address: "0x4200000000000000000000000000000000000006", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "wstETH", address: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb", decimals: 18, demoAmount: "5000000000000000"  },
    ],
  },
  {
    chainId: 42793,
    name: "Etherlink",
    tokens: [
      { symbol: "USDC",  address: "0x796ea11fa2dd751ed01b53c372ffdb4aaa8f00f9", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",  address: "0x2c03058c8afc06713be23e58d2febc8337dbfe6a", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "WETH",  address: "0xfc24f770f94edbca6d6f885e12d4317320bcb401", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "WBTC",  address: "0xbfc94cd2b1e55999cfc7347a9313e88702b83d0f", decimals: 8,  demoAmount: "15000"       },
      { symbol: "LBTC",  address: "0xecac9c5f704e954931349da37f60e39f515c11c1", decimals: 8,  demoAmount: "15000"       },
      { symbol: "WXTZ",  address: "0xc9b53ab2679f573e480d01e0f49e2b5cfb7a3eab", decimals: 18, demoAmount: "28000000000000000000" },
      { symbol: "stXTZ", address: "0x01f07f4d78d47a64f4c3b2b65f513f15be6e1854", decimals: 6,  demoAmount: "26000000"    },
    ],
  },
  {
    chainId: 137,
    name: "Polygon",
    tokens: [
      { symbol: "USDC",   address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "USDT",   address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6,  demoAmount: "10000000"    },
      { symbol: "DAI",    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18, demoAmount: "10000000000000000000" },
      { symbol: "WETH",   address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18, demoAmount: "5000000000000000"  },
      { symbol: "wstETH", address: "0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD", decimals: 18, demoAmount: "5000000000000000"  },
    ],
  },
]

export const DEFAULT_NETWORK = NETWORKS[0]
export const DEFAULT_TOKEN = DEFAULT_NETWORK.tokens[0]
