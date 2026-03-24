import type { ThemeConfig } from "@superlend/react-sdk";

export type Palette = {
  name: string;
  theme: ThemeConfig;
};

export type PaletteGroup = {
  label: string;
  palettes: Palette[];
};

export const TOKYO_NIGHT_LIGHT: ThemeConfig = {
  bg: "#d5d6db",
  primary: "#34548a",
  accent: "#5a4a78",
  text: "#343b58",
  radius: "8px",
  border: "rgba(0,0,0,0.15)",
};

export const PALETTE_GROUPS: PaletteGroup[] = [
  {
    label: "Light",
    palettes: [
      {
        name: "Tokyo Light",
        theme: TOKYO_NIGHT_LIGHT,
      },
      {
        name: "Latte",
        theme: {
          bg: "#eff1f5",
          primary: "#8839ef",
          accent: "#1e66f5",
          text: "#4c4f69",
          radius: "8px",
          border: "rgba(0,0,0,0.15)",
        },
      },
      {
        name: "Rose Pine",
        theme: {
          bg: "#faf4ed",
          primary: "#d7827e",
          accent: "#907aa9",
          text: "#575279",
          radius: "8px",
          border: "rgba(0,0,0,0.15)",
        },
      },
      {
        name: "GitHub",
        theme: {
          bg: "#ffffff",
          primary: "#0969da",
          accent: "#218bff",
          text: "#1f2328",
          radius: "8px",
          border: "rgba(0,0,0,0.15)",
        },
      },
      {
        name: "Sol. Light",
        theme: {
          bg: "#fdf6e3",
          primary: "#268bd2",
          accent: "#2aa198",
          text: "#657b83",
          radius: "8px",
          border: "rgba(0,0,0,0.15)",
        },
      },
    ],
  },
  {
    label: "Dark",
    palettes: [
      {
        name: "Tokyo Night",
        theme: {
          bg: "#1a1b26",
          primary: "#7aa2f7",
          accent: "#bb9af7",
          text: "#c0caf5",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Midnight",
        theme: {
          bg: "#1a1a2e",
          primary: "#00d395",
          accent: "#00d395",
          text: "#ffffff",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Catppuccin",
        theme: {
          bg: "#1e1e2e",
          primary: "#cba6f7",
          accent: "#89b4fa",
          text: "#cdd6f4",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Dracula",
        theme: {
          bg: "#282a36",
          primary: "#bd93f9",
          accent: "#ff79c6",
          text: "#f8f8f2",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Nord",
        theme: {
          bg: "#2e3440",
          primary: "#88c0d0",
          accent: "#81a1c1",
          text: "#eceff4",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Gruvbox",
        theme: {
          bg: "#282828",
          primary: "#fabd2f",
          accent: "#b8bb26",
          text: "#ebdbb2",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
      {
        name: "Solarized",
        theme: {
          bg: "#002b36",
          primary: "#268bd2",
          accent: "#2aa198",
          text: "#657b83",
          radius: "8px",
          border: "rgba(255,255,255,0.18)",
        },
      },
    ],
  },
];

export const RADIUS_OPTIONS: { label: string; value: string }[] = [
  { label: "None", value: "0px" },
  { label: "SM", value: "4px" },
  { label: "MD", value: "8px" },
  { label: "LG", value: "12px" },
  { label: "XL", value: "16px" },
  { label: "Full", value: "9999px" },
];
