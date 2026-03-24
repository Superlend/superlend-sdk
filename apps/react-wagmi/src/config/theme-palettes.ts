import type { ThemeConfig } from "@superlend/react-sdk";

export type BackgroundOption = {
  name: string;
  bg: string;
  text: string;
  border: string;
  isDark: boolean;
};

export type AccentColor = {
  name: string;
  light: { primary: string; accent: string };
  dark: { primary: string; accent: string };
  swatch: string; // display color for the button
};

export const BACKGROUNDS: BackgroundOption[] = [
  {
    name: "White",
    bg: "#ffffff",
    text: "#1f2328",
    border: "rgba(0,0,0,0.12)",
    isDark: false,
  },
  {
    name: "Snow",
    bg: "#f8f9fa",
    text: "#1a1a2e",
    border: "rgba(0,0,0,0.10)",
    isDark: false,
  },
  {
    name: "Cream",
    bg: "#fdf6e3",
    text: "#433422",
    border: "rgba(0,0,0,0.10)",
    isDark: false,
  },
  {
    name: "Slate",
    bg: "#1e293b",
    text: "#e2e8f0",
    border: "rgba(255,255,255,0.08)",
    isDark: true,
  },
  {
    name: "Charcoal",
    bg: "#1a1a2e",
    text: "#ffffff",
    border: "rgba(255,255,255,0.08)",
    isDark: true,
  },
  {
    name: "Midnight",
    bg: "#0f172a",
    text: "#e2e8f0",
    border: "rgba(255,255,255,0.06)",
    isDark: true,
  },
  {
    name: "Black",
    bg: "#09090b",
    text: "#fafafa",
    border: "rgba(255,255,255,0.06)",
    isDark: true,
  },
];

export const ACCENT_COLORS: AccentColor[] = [
  {
    name: "Blue",
    swatch: "#3b82f6",
    light: { primary: "#2563eb", accent: "#3b82f6" },
    dark: { primary: "#60a5fa", accent: "#93bbfd" },
  },
  {
    name: "Cyan",
    swatch: "#06b6d4",
    light: { primary: "#0891b2", accent: "#06b6d4" },
    dark: { primary: "#22d3ee", accent: "#67e8f9" },
  },
  {
    name: "Teal",
    swatch: "#14b8a6",
    light: { primary: "#0d9488", accent: "#14b8a6" },
    dark: { primary: "#2dd4bf", accent: "#5eead4" },
  },
  {
    name: "Green",
    swatch: "#22c55e",
    light: { primary: "#16a34a", accent: "#22c55e" },
    dark: { primary: "#4ade80", accent: "#86efac" },
  },
  {
    name: "Emerald",
    swatch: "#00d395",
    light: { primary: "#059669", accent: "#10b981" },
    dark: { primary: "#34d399", accent: "#6ee7b7" },
  },
  {
    name: "Violet",
    swatch: "#8b5cf6",
    light: { primary: "#7c3aed", accent: "#8b5cf6" },
    dark: { primary: "#a78bfa", accent: "#c4b5fd" },
  },
  {
    name: "Purple",
    swatch: "#a855f7",
    light: { primary: "#9333ea", accent: "#a855f7" },
    dark: { primary: "#c084fc", accent: "#d8b4fe" },
  },
  {
    name: "Pink",
    swatch: "#ec4899",
    light: { primary: "#db2777", accent: "#ec4899" },
    dark: { primary: "#f472b6", accent: "#f9a8d4" },
  },
  {
    name: "Red",
    swatch: "#ef4444",
    light: { primary: "#dc2626", accent: "#ef4444" },
    dark: { primary: "#f87171", accent: "#fca5a5" },
  },
  {
    name: "Orange",
    swatch: "#f97316",
    light: { primary: "#ea580c", accent: "#f97316" },
    dark: { primary: "#fb923c", accent: "#fdba74" },
  },
  {
    name: "Amber",
    swatch: "#f59e0b",
    light: { primary: "#d97706", accent: "#f59e0b" },
    dark: { primary: "#fbbf24", accent: "#fcd34d" },
  },
  {
    name: "Rose",
    swatch: "#f43f5e",
    light: { primary: "#e11d48", accent: "#f43f5e" },
    dark: { primary: "#fb7185", accent: "#fda4af" },
  },
];

export function buildTheme(
  background: BackgroundOption,
  accent: AccentColor,
  radius: string,
): ThemeConfig {
  const colors = background.isDark ? accent.dark : accent.light;
  return {
    bg: background.bg,
    primary: colors.primary,
    accent: colors.accent,
    text: background.text,
    radius,
    border: background.border,
  };
}

export const RADIUS_OPTIONS: { label: string; value: string }[] = [
  { label: "None", value: "0px" },
  { label: "SM", value: "4px" },
  { label: "MD", value: "8px" },
  { label: "LG", value: "12px" },
  { label: "XL", value: "16px" },
  { label: "Full", value: "9999px" },
];
