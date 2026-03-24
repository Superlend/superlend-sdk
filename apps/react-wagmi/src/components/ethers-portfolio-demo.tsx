import { PortfolioWidget } from "@superlend/react-sdk";
import { CodePreview } from "@/components/code-preview";
import { useDemoSettings } from "@/context/demo-settings";
import { useEthersWallet } from "@/context/ethers-wallet";
import { useWidgetTheme } from "@/context/widget-theme";

export function EthersPortfolioDemo() {
  const { address } = useEthersWallet();
  const { theme } = useWidgetTheme();
  const { showCode } = useDemoSettings();

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            Your Portfolio
          </p>
          <p className="text-xs" style={{ color: `${theme.text}99` }}>
            Active lending and borrowing positions
          </p>
        </div>
        <PortfolioWidget
          apiKey={import.meta.env.VITE_SUPERLEND_API_KEY || ""}
          userAddress={address}
          baseUrl={import.meta.env.VITE_SUPERLEND_API_URL || undefined}
          theme={theme}
        />
      </div>
      {showCode && <CodePreview mode="portfolio" />}
    </>
  );
}
