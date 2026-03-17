# CLAUDE.md — SuperLend SDK Monorepo

## Project Overview

SuperLend SDK allows third-party integrators (e.g., Bungee, Socket, etc.) to embed a post-swap lending widget into their apps. After a user completes a swap, the widget shows the best lending/looping opportunities powered by SuperLend.

Example use case:

```
Successfully swapped 10 USDC

Let's put them to good use

LEND     upto 8%
LOOP     upto 9%

powered by SuperLend
```

## Architecture

```
Third-party App (Bungee, etc.)
  └── @superlend/react-sdk (UI widget, client-only)
        └── @superlend/sdk (headless client)
              └── sdk-microservice (BE, encodes calldata, tracks analytics)
```

## Monorepo Structure

```
superlend-sdk/                  # Open source
├── packages/
│   ├── sdk/                    # @superlend/sdk — headless, framework-agnostic
│   └── react/                  # @superlend/react-sdk — UI components
├── apps/
│   ├── nextjs-example/         # Integration demo
│   └── storybook/              # Component playground (internal dev tool)
├── turbo.json
└── pnpm-workspace.yaml

superlend-sdk-docs/             # Private, separate repo
└── astro site                  # Docs + API reference (TypeDoc generated)
```

## Packages

### @superlend/sdk

- Pure TypeScript, no React dependency, no web3 lib dependency
- SuperLendClient class wrapping the sdk-microservice API
- Two main methods: getOpportunities() and getCalldata()
- Custom fetch wrapper using neverthrow Result types + zod validation
- All errors are typed and explicit — no thrown exceptions
- Tiny bundle, zero heavy dependencies
- Returns raw calldata strings — integrator uses their own web3 stack to execute
- FE SDK version is decoupled from BE microservice version

### @superlend/react-sdk

- Client-only — no SSR support needed (post-tx hook context)
- UI components built on Base UI (from Radix/MUI team) for accessibility
- Inline styles for most styling — NO CSS imports required by integrators
- Small injected `<style>` tag (data-superlend attribute) for pseudo-selectors (:hover, :focus-visible)
- CSS variables for theming (--sl-primary, --sl-radius, --sl-bg, --sl-accent, --sl-text)
- sl- prefixed classes for the few class-based styles to prevent collisions
- Base UI Skeleton for loading states
- Base UI Dialog for modal variant
- Three widget variants:
  - `inline` — embeds directly in integrator's UI
  - `dialog` — renders trigger button, opens accessible modal on click
  - `compact` — minimal single-row for tight spaces
- Two wallet interaction modes:
  - Pass walletClient prop → widget handles tx execution (peer: viem, wagmi)
  - Use onAction callback → integrator gets calldata and handles tx themselves

### Components

```
SuperLendWidget (entry point, variant switching)
├── WidgetHeader
├── OpportunityCard (Base UI Button)
├── ActionButton
├── WidgetSkeleton (Base UI Skeleton)
├── WidgetDialog (Base UI Dialog, for dialog variant)
└── PoweredBy
```

## Dependencies

```
@superlend/sdk:
  - neverthrow           # Result types for explicit error handling
  - zod                  # Runtime validation of API responses and integrator input

@superlend/react-sdk:
  - @base-ui/react       # Unstyled accessible primitives (button, skeleton, dialog)
  - peer: react
  - peer (optional): viem, wagmi  # Only needed if using walletClient mode

devDeps (root):
  - turbo                # Monorepo build orchestration
  - tsup                 # Bundle packages (ESM + CJS + dts)
  - changesets           # Versioning and changelogs across packages
  - vitest               # Unit testing
  - msw                  # Mock sdk-microservice API for testing and storybook
  - biome                # Linting + formatting (replaces eslint + prettier)
  - playwright           # E2E testing for nextjs-example
  - typedoc              # API reference generation from TSDoc comments
  - storybook            # Component playground for internal development
```

## Tooling Decisions

- **Web3**: viem (tree-shakeable, wagmi-native) — only as optional peer dep in @superlend/react-sdk. No web3 lib in @superlend/sdk.
- **Linting + Formatting**: Biome — single tool, zero config headaches, fast.
- **Bundler**: tsup — ESM + CJS dual output with dts generation.
- **Monorepo**: Turborepo + pnpm workspaces.
- **Versioning**: changesets — independent versioning per package.
- **Docs site**: Astro in separate private repo (superlend-sdk-docs). API reference auto-generated via TypeDoc from TSDoc comments, published on release via CI.

## Styling Rules

- NO Tailwind, NO CSS-in-JS libraries, NO CSS file imports
- Inline styles (React style objects) for all component styling
- CSS variables for theming — integrators override via theme prop or parent CSS
- One injected `<style>` tag per widget mount for pseudo-selectors
- All class names prefixed with sl- to avoid collisions with integrator styles
- Base UI provides accessible behavior (focus, keyboard nav, ARIA) with zero styling opinions

## SDK Design Principles

- neverthrow Result types for ALL async operations — never throw exceptions
- zod schemas validate every API response and integrator-facing prop
- Custom fetch wrapper handles timeout, retries, error classification
- Error types: NETWORK_ERROR, TIMEOUT, API_ERROR (with status), VALIDATION_ERROR
- HttpError union type — integrators get full type safety on error handling

## Analytics

- NO client-side analytics SDK in the bundle — zero PostHog or similar in @superlend/sdk or @superlend/react-sdk
- Analytics tracked server-side via the microservice:
  - Impressions = getOpportunities() API calls
  - Conversions = getCalldata() API calls
  - Partner attribution from API key (x-api-key header)
  - Chain, token, action breakdown from request params
- PostHog integration lives in the microservice, not the client packages

## Backend

- New app in existing BE monorepo: apps/sdk-microservice
- FE SDK version is decoupled from BE version
- API versioned via URL prefix (/v1/)

### Endpoints

```
GET  /v1/opportunities?token=&chainId=&actions=&limit=
POST /v1/calldata  { opportunityId, userAddress, amount, token, chainId }
GET  /v1/supported-chains
GET  /v1/supported-tokens?chainId=
```

### Auth & Rate Limiting

- API key auth via x-api-key header
- Partner attribution via x-partner-id header
- Rate limiting per IP (configurable per API key)
- API keys provisioned manually through marketing channel (no self-serve dashboard for now)
- CORS config per partner (deferred — implement when needed)
- Domain allowlisting per API key (deferred — implement when needed)

## Integrator DX Goal

One import. No CSS. No providers. Just works:

```tsx
import { SuperLendWidget } from '@superlend/react-sdk';

// Inline variant
<SuperLendWidget
  apiKey="partner_xxxxx"
  token="USDC"
  amount={rawAmount}
  chainId={8453}
  walletClient={walletClient}
  variant="inline"
  theme={{
    'bg': '#1a1a2e',
    'accent': '#00d395',
  }}
/>

// Dialog variant
<SuperLendWidget
  apiKey="partner_xxxxx"
  token="USDC"
  amount={rawAmount}
  chainId={8453}
  onAction={(opp, calldata) => handleTx(calldata)}
  variant="dialog"
/>
```

## Testing Strategy

- **Unit**: Vitest for SDK client, fetch wrapper, zod schemas
- **Component**: Vitest + MSW for React components with mocked API
- **E2E**: Playwright for nextjs-example app
- **Visual**: Storybook for internal component development and review

## DX

- README per package with quickstart guide
- TSDoc comments on all public APIs
- TypeDoc auto-generated API reference → published to Astro docs site
- Storybook for internal development and component iteration
- Chromatic for visual regression (consider later)

## Build & Dev Commands

```bash
pnpm install                  # Install all dependencies
pnpm dev                      # Dev mode for all packages
pnpm build                    # Build all packages
pnpm test                     # Run tests across all packages
pnpm test:e2e                 # Run Playwright E2E tests
pnpm lint                     # Biome lint
pnpm format                   # Biome format
pnpm storybook                # Launch storybook
pnpm changeset                # Create a changeset for versioning
pnpm changeset version        # Bump versions
pnpm changeset publish        # Publish to npm
pnpm docs:generate            # Generate TypeDoc API reference
```

## Key Files

```
packages/sdk/src/client.ts                         — SuperLendClient class
packages/sdk/src/lib/request.ts                    — Custom fetch wrapper (neverthrow + zod)
packages/sdk/src/types/index.ts                    — All shared types
packages/sdk/src/schemas/index.ts                  — Zod schemas for API responses
packages/react/src/components/SuperLendWidget.tsx   — Main widget entry (variant switching)
packages/react/src/components/OpportunityCard.tsx   — Single opportunity row
packages/react/src/components/WidgetDialog.tsx      — Dialog variant (Base UI Dialog)
packages/react/src/components/WidgetSkeleton.tsx    — Loading state (Base UI Skeleton)
packages/react/src/components/PoweredBy.tsx         — Attribution footer
packages/react/src/hooks/useOpportunities.ts        — Data fetching hook
packages/react/src/hooks/useTransaction.ts          — Wallet transaction hook
packages/react/src/styles/inject.ts                 — Style injection utility
```
