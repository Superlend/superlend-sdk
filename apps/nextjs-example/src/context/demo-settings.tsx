"use client";

import type { WidgetVariant } from "@superlend/react-sdk";
import { createContext, useContext, useState } from "react";

type DemoSettingsContextValue = {
  variant: WidgetVariant;
  setVariant: (v: WidgetVariant) => void;
  useCallback: boolean;
  setUseCallback: (v: boolean) => void;
  showCode: boolean;
  setShowCode: (v: boolean) => void;
};

const DemoSettingsContext = createContext<DemoSettingsContextValue | null>(
  null,
);

export function DemoSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [variant, setVariant] = useState<WidgetVariant>("inline");
  const [useCallback, setUseCallback] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <DemoSettingsContext.Provider
      value={{
        variant,
        setVariant,
        useCallback,
        setUseCallback,
        showCode,
        setShowCode,
      }}
    >
      {children}
    </DemoSettingsContext.Provider>
  );
}

export function useDemoSettings() {
  const ctx = useContext(DemoSettingsContext);
  if (!ctx)
    throw new Error("useDemoSettings must be used within DemoSettingsProvider");
  return ctx;
}
