import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { RootShell } from "@/components/root-shell";

export const metadata: Metadata = {
  title: "SuperLend SDK Demo — Next.js",
  description: "Next.js integration demo for @superlend/react-sdk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <RootShell>{children}</RootShell>
        </Providers>
      </body>
    </html>
  );
}
