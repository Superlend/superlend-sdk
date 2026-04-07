"use client";

import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { ThemePanel } from "@/components/settings-panel";

export default function HomePage() {
  return (
    <PageLayout rightPane={<ThemePanel />}>
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div>
          <h2 className="text-lg font-semibold">SDK Demo</h2>
          <p className="mt-1 text-sm opacity-60">
            Choose a wallet adapter to explore the widget integration
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/wagmi"
            className="rounded-lg border px-6 py-4 text-center no-underline transition-colors"
          >
            <p className="text-sm font-semibold">wagmi</p>
            <p className="mt-1 text-xs opacity-60">RainbowKit + viem</p>
          </Link>
          <Link
            href="/ethers"
            className="rounded-lg border px-6 py-4 text-center no-underline transition-colors"
          >
            <p className="text-sm font-semibold">ethers.js</p>
            <p className="mt-1 text-xs opacity-60">EIP-1193 + raw provider</p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
