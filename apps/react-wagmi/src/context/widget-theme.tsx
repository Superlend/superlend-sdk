import type { ThemeConfig } from "@superlend/react";
import { createContext, useContext, useState } from "react";

type WidgetThemeContextValue = {
  theme: ThemeConfig;
  updateTheme: (key: keyof ThemeConfig, value: string) => void;
  setPalette: (palette: ThemeConfig) => void;
};

const DEFAULT_THEME: ThemeConfig = {
  bg: "#1a1a2e",
  primary: "#00d395",
  accent: "#00d395",
  text: "#ffffff",
  radius: "8px",
};

const WidgetThemeContext = createContext<WidgetThemeContextValue | null>(null);

export function WidgetThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);

  const updateTheme = (key: keyof ThemeConfig, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const setPalette = (palette: ThemeConfig) => {
    setTheme((prev) => ({ ...prev, ...palette }));
  };

  return (
    <WidgetThemeContext.Provider value={{ theme, updateTheme, setPalette }}>
      {children}
    </WidgetThemeContext.Provider>
  );
}

export function useWidgetTheme() {
  const ctx = useContext(WidgetThemeContext);
  if (!ctx)
    throw new Error("useWidgetTheme must be used within WidgetThemeProvider");
  return ctx;
}
