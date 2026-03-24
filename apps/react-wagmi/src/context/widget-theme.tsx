import type { ResolvedTheme, ThemeConfig } from "@superlend/react-sdk";
import { createContext, useContext, useState } from "react";
import {
  ACCENT_COLORS,
  type AccentColor,
  BACKGROUNDS,
  type BackgroundOption,
  buildTheme,
} from "@/config/theme-palettes";

type WidgetThemeContextValue = {
  theme: ResolvedTheme;
  background: BackgroundOption;
  accent: AccentColor;
  radius: string;
  setBackground: (bg: BackgroundOption) => void;
  setAccent: (accent: AccentColor) => void;
  setRadius: (radius: string) => void;
  updateTheme: (key: keyof ThemeConfig, value: string) => void;
  setPalette: (palette: ThemeConfig) => void;
};

const DEFAULT_BG = BACKGROUNDS[0]; // White
const DEFAULT_ACCENT = ACCENT_COLORS[0]; // Blue
const DEFAULT_RADIUS = "8px";

const WidgetThemeContext = createContext<WidgetThemeContextValue | null>(null);

export function WidgetThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [background, setBackgroundState] = useState(DEFAULT_BG);
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);
  const [radius, setRadiusState] = useState(DEFAULT_RADIUS);
  const [theme, setTheme] = useState<ResolvedTheme>(
    buildTheme(DEFAULT_BG, DEFAULT_ACCENT, DEFAULT_RADIUS),
  );

  const setBackground = (bg: BackgroundOption) => {
    setBackgroundState(bg);
    setTheme(buildTheme(bg, accent, radius));
  };

  const setAccent = (a: AccentColor) => {
    setAccentState(a);
    setTheme(buildTheme(background, a, radius));
  };

  const setRadius = (r: string) => {
    setRadiusState(r);
    setTheme(buildTheme(background, accent, r));
  };

  const updateTheme = (key: keyof ThemeConfig, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const setPalette = (palette: ThemeConfig) => {
    setTheme((prev) => ({ ...prev, ...palette }));
  };

  return (
    <WidgetThemeContext.Provider
      value={{
        theme,
        background,
        accent,
        radius,
        setBackground,
        setAccent,
        setRadius,
        updateTheme,
        setPalette,
      }}
    >
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
