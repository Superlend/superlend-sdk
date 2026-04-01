"use client";

import { useWidgetTheme } from "@/context/widget-theme";

export default function EthersVaultsPage() {
  const { theme } = useWidgetTheme();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-12 text-center">
      <p className="text-sm font-semibold" style={{ color: theme.text }}>
        Vaults
      </p>
      <p className="text-xs" style={{ color: `${theme.text}77` }}>
        Curated yield vaults — coming soon.
      </p>
    </div>
  );
}
