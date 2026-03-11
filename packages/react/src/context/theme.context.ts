import { createContext, useContext } from "react";
import type { ResolvedTheme, ThemeConfig } from "../types";

const DEFAULT_THEME: ResolvedTheme = {
  bg: "#1a1a2e",
  primary: "#00d395",
  accent: "#00d395",
  text: "#ffffff",
  radius: "8px",
  border: "rgba(255, 255, 255, 0.18)",
};

const resolveTheme = (theme?: ThemeConfig): ResolvedTheme => {
  return { ...DEFAULT_THEME, ...theme };
};

const ThemeContext = createContext<ResolvedTheme>(DEFAULT_THEME);

const useTheme = (): ResolvedTheme => {
  return useContext(ThemeContext);
};

export { DEFAULT_THEME, resolveTheme, ThemeContext, useTheme };
