import { PortfolioWidget } from "@superlend/react-sdk";
import { useAccount } from "wagmi";
import { useWidgetTheme } from "@/context/widget-theme";

export function WagmiPortfolioDemo() {
  const { address } = useAccount();
  const { theme } = useWidgetTheme();

  return (
    <div className="flex flex-col gap-4">
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
  );
}
