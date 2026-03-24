import { HttpResponse, http } from "msw";

const BASE_URL = "https://sdk-api.superlend.xyz";

const mockToken = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/token-1-usdc",
  priceUsd: 0.9999,
};

const makeRate = (base: number, reward: number) => ({
  current: {
    base,
    reward,
    net: base + reward,
    rewardBreakdown:
      reward > 0
        ? [
            {
              apy: reward,
              token: {
                address: "0x58d97b57bb95320f9a05dc918aef65434969c2b2",
                name: "Morpho Token",
                symbol: "MORPHO",
                decimals: 18,
                logo: "https://cdn.morpho.org/assets/logos/morpho.svg",
                priceUsd: 1.92,
              },
            },
          ]
        : [],
  },
  avg_7d: base * 0.95,
  avg_30d: base * 0.98,
});

const zeroRate = makeRate(0, 0);

export const mockMarketsResponse = {
  success: true,
  message: "Markets fetched successfully",
  data: {
    markets: [
      {
        token: mockToken,
        chainId: 1,
        platform: {
          name: "Morpho",
          displayName: "Steakhouse Reservoir USDC",
          platformName: "MORPHO-BLUE-ETHEREUM",
          protocolId: 15,
          platformId: "397d3bd8-12f1-4d4e-93d1-37ce91a6287f",
          logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/morpho-logo.svg",
          vault: "0xbeef346d7099865208ff331e4f648f4154ddaa05",
          type: "MORPHO_VAULT",
          redirectionUrl:
            "https://app.morpho.org/ethereum/vault/0xbeef346d7099865208ff331e4f648f4154ddaa05",
          curator: {
            name: "Steakhouse Financial",
            logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/curator-steakhouse-financial",
          },
        },
        supplyRate: makeRate(3.23, 4.17),
        borrowRate: zeroRate,
        totalSuppliedToken: 88759203,
        totalSuppliedUsd: 88752277,
        supplyCapToken: 0,
        remainingSupplyCap: 9007199254740991,
        totalBorrowedToken: 0,
        totalBorrowedUsd: 0,
        totalLiquidityToken: 0,
        totalLiquidityUsd: 0,
        borrowCap: 0,
        ltv: 0,
        lltv: 0,
        utilizationRate: 0,
        canUseAsCollateral: true,
        isBorrowEnabled: false,
        collateralExposure: [],
        collateralTokens: [],
        merklRewards: [],
        riskRating: null,
      },
      {
        token: mockToken,
        chainId: 1,
        platform: {
          name: "Morpho",
          displayName: "Steakhouse USDC",
          platformName: "MORPHO-BLUE-ETHEREUM",
          protocolId: 15,
          platformId: "9990132b-63f7-4742-94c0-5ec1c4470162",
          logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/morpho-logo.svg",
          vault: "0xbeef01735c132ada46aa9aa4c54623caa92a64cb",
          type: "MORPHO_VAULT",
          redirectionUrl:
            "https://app.morpho.org/ethereum/vault/0xbeef01735c132ada46aa9aa4c54623caa92a64cb",
          curator: {
            name: "Steakhouse Financial",
            logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/curator-steakhouse-financial",
          },
        },
        supplyRate: makeRate(2.82, 0.25),
        borrowRate: zeroRate,
        totalSuppliedToken: 160271750,
        totalSuppliedUsd: 160259243,
        supplyCapToken: 0,
        remainingSupplyCap: 9007199254740991,
        totalBorrowedToken: 0,
        totalBorrowedUsd: 0,
        totalLiquidityToken: 0,
        totalLiquidityUsd: 0,
        borrowCap: 0,
        ltv: 0,
        lltv: 0,
        utilizationRate: 0,
        canUseAsCollateral: true,
        isBorrowEnabled: false,
        collateralExposure: [],
        collateralTokens: [],
        merklRewards: [],
        riskRating: null,
      },
      {
        token: mockToken,
        chainId: 1,
        platform: {
          name: "Euler",
          displayName: "EVK Vault eUSDC-95",
          platformName: "EULER-FINANCE-ETHEREUM",
          protocolId: 22,
          platformId: "0x7fab04ff2717d9a6b71a51c56c29697179597d40",
          logo: "https://superlend-public-assets.s3.ap-south-1.amazonaws.com/euler_logo.png",
          type: "EULER",
          redirectionUrl:
            "https://app.euler.finance/vault/0x7fab04ff2717d9a6b71a51c56c29697179597d40?network=ethereum",
        },
        supplyRate: makeRate(6.31, 9.77),
        borrowRate: makeRate(9.29, 12.54),
        totalSuppliedToken: 1095344,
        totalSuppliedUsd: 1095281,
        supplyCapToken: 0,
        remainingSupplyCap: 9007199254740991,
        totalBorrowedToken: 838804,
        totalBorrowedUsd: 838756,
        totalLiquidityToken: 256539,
        totalLiquidityUsd: 256524,
        borrowCap: 0,
        ltv: 0,
        lltv: 0,
        utilizationRate: 76.58,
        canUseAsCollateral: false,
        isBorrowEnabled: true,
        collateralExposure: [],
        collateralTokens: [],
        merklRewards: [],
        riskRating: null,
      },
    ],
    total: 3,
  },
};

export const mockSupplyCalldata = {
  success: true,
  message: "Supply calldata built successfully",
  data: {
    to: "0x1234567890abcdef1234567890abcdef12345678",
    data: "0xabcdef",
    value: "0",
  },
};

export const mockVaultMarketsResponse = {
  success: true,
  message: "Vault markets fetched successfully",
  data: {
    vaults: [
      {
        token: mockToken,
        vaultId: "1-0xvault111111111111111111111111111111111111",
        defaultDepositToken: mockToken.address,
        depositTokens: [{ type: "DIRECT", token: mockToken.address }],
        chainId: 1,
        vault: {
          name: "Example Loop Vault",
          symbol: "exlvUSDC",
          decimals: 18,
          logo: "https://example.com/vault.png",
          type: "LOOP",
          vaultAddress: "0xvault111111111111111111111111111111111111",
          description: "Example",
          profile: "example",
          vaultRouter: "0xrouter2222222222222222222222222222222222222",
          depositManager: "0xmgr33333333333333333333333333333333333333",
          curator: { name: "Superlend", logo: "https://example.com/c.png" },
        },
        apy: { base: 4.5, reward: 1.7, net: 6.2, rewardBreakdown: [] },
      },
    ],
    total: 1,
  },
};

export const mockVaultDepositCalldata = {
  success: true,
  message: "Vault deposit calldata built successfully",
  data: {
    to: "0xrouter2222222222222222222222222222222222222",
    data: "0xf00d",
    value: "0",
  },
};

export const handlers = [
  http.post(`${BASE_URL}/sdk/markets/token`, () => {
    return HttpResponse.json(mockMarketsResponse);
  }),

  http.post(`${BASE_URL}/sdk/action/supply`, () => {
    return HttpResponse.json(mockSupplyCalldata);
  }),

  http.post(`${BASE_URL}/sdk/vaults/token`, () => {
    return HttpResponse.json(mockVaultMarketsResponse);
  }),

  http.post(`${BASE_URL}/sdk/action/vault/deposit`, () => {
    return HttpResponse.json(mockVaultDepositCalldata);
  }),
];
