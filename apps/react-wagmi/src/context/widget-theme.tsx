import type { ThemeConfig } from "@superlend/react-sdk";
import { createContext, useContext, useState } from "react";

type WidgetThemeContextValue = {
  theme: ThemeConfig;
  updateTheme: (key: keyof ThemeConfig, value: string) => void;
  setPalette: (palette: ThemeConfig) => void;
};

const DEFAULT_THEME: ThemeConfig = {
  bg: "#ffffff",
  primary: "#0969da",
  accent: "#218bff",
  text: "#1f2328",
  radius: "8px",
  border: "rgba(0,0,0,0.15)",
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
