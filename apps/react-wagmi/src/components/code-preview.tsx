import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import { useDemoConfig } from "@/context/demo-config";
import { useDemoSettings } from "@/context/demo-settings";
import { useWidgetTheme } from "@/context/widget-theme";

type CodePreviewMode = "aggregator" | "portfolio";
type CodePreviewAdapter = "wagmi" | "ethers";

function useThemeSnippetLines() {
  const { theme } = useWidgetTheme();

  return useMemo(() => {
    const entries: string[] = [];
    if (theme.bg) entries.push(`    bg: "${theme.bg}"`);
    if (theme.primary) entries.push(`    primary: "${theme.primary}"`);
    if (theme.accent && theme.accent !== theme.primary)
      entries.push(`    accent: "${theme.accent}"`);
    if (theme.text) entries.push(`    text: "${theme.text}"`);
    if (theme.radius) entries.push(`    radius: "${theme.radius}"`);
    return entries;
  }, [theme]);
}

function useAggregatorSnippet(adapter: CodePreviewAdapter) {
  const { network, token } = useDemoConfig();
  const { variant, useCallback } = useDemoSettings();
  const themeLines = useThemeSnippetLines();

  return useMemo(() => {
    const lines: string[] = [];

    // Imports
    if (useCallback) {
      lines.push(
        `import { SuperLendWidget } from "@superlend/react-sdk";`,
        `import type { Market, SupplyCalldataResponse } from "@superlend/sdk";`,
      );
    } else {
      lines.push(
        `import { SuperLendWidget, walletAdapters } from "@superlend/react-sdk";`,
      );
    }

    lines.push("");

    // Setup code
    if (useCallback) {
      lines.push(
        `function handleTx(market: Market, calldata: SupplyCalldataResponse) {`,
        `  // Execute the transaction with your preferred web3 library`,
        `  const txHash = await sendTransaction({`,
        `    to: calldata.tx.to,`,
        `    data: calldata.tx.data,`,
        `    value: calldata.tx.value,`,
        `  });`,
        `}`,
      );
    } else if (adapter === "ethers") {
      lines.push(
        `// Create a wallet client from your ethers signer`,
        `const walletClient = walletAdapters.fromEthers(signer, { eip1193Provider, chainId });`,
      );
    } else {
      lines.push(
        `// Create a wallet client from your wagmi/viem wallet`,
        `const walletClient = walletAdapters.fromViem(wagmiWalletClient, publicClient);`,
      );
    }

    lines.push("");

    // JSX
    const props: string[] = [];
    const push = (prop: string) => props.push(`  ${prop}`);

    push(`apiKey="your-api-key"`);
    push(`tokenAddress="${token.address}"`);
    push(`initialAmount="${token.demoAmount}"`);
    push(`chainId={${network.chainId}}`);
    push(`userAddress={address}`);

    if (variant !== "inline") {
      push(`variant="${variant}"`);
    }

    if (useCallback) {
      push(`onAction={handleTx}`);
    } else {
      push(`walletClient={walletClient}`);
    }

    if (themeLines.length) {
      push(`theme={{`);
      props.push(themeLines.join(",\n"));
      props.push("  }}");
    }

    lines.push(`<SuperLendWidget`);
    lines.push(...props);
    lines.push(`/>`);

    return lines.join("\n");
  }, [network, token, variant, useCallback, themeLines, adapter]);
}

function usePortfolioSnippet() {
  const themeLines = useThemeSnippetLines();

  return useMemo(() => {
    const lines: string[] = [
      `import { PortfolioWidget } from "@superlend/react-sdk";`,
      ``,
    ];

    const props: string[] = [];
    const push = (prop: string) => props.push(`  ${prop}`);

    push(`apiKey="your-api-key"`);
    push(`userAddress={address}`);

    if (themeLines.length) {
      push(`theme={{`);
      props.push(themeLines.join(",\n"));
      props.push("  }}");
    }

    lines.push(`<PortfolioWidget`);
    lines.push(...props);
    lines.push(`/>`);

    return lines.join("\n");
  }, [themeLines]);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useWidgetTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded px-2 py-1 text-[10px] font-medium transition-colors"
      style={{
        backgroundColor: `${theme.text}15`,
        color: `${theme.text}aa`,
        border: `1px solid ${theme.text}20`,
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function CodePreview({
  mode,
  adapter = "wagmi",
}: {
  mode: CodePreviewMode;
  adapter?: CodePreviewAdapter;
}) {
  const aggregatorCode = useAggregatorSnippet(adapter);
  const portfolioCode = usePortfolioSnippet();
  const code = mode === "portfolio" ? portfolioCode : aggregatorCode;
  const { theme, background } = useWidgetTheme();
  const [html, setHtml] = useState("");

  useEffect(() => {
    const shikiTheme = background.isDark ? "github-dark" : "github-light";
    codeToHtml(code, { lang: "tsx", theme: shikiTheme }).then(setHtml);
  }, [code, background.isDark]);

  return (
    <>
      <hr style={{ borderColor: `${theme.text}15` }} />
      <div
        className="relative overflow-hidden rounded-lg border"
        style={{ borderColor: `${theme.text}15` }}
      >
        <CopyButton text={code} />
        <div
          className="overflow-x-auto text-xs leading-relaxed [&_pre]:!bg-transparent [&_pre]:p-4"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}
