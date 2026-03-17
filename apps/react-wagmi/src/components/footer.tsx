import type { ThemeConfig } from "@superlend/react-sdk";
import { useState } from "react";
import { useWidgetTheme } from "@/context/widget-theme";
import { cn } from "@/lib/utils";

type Palette = {
  name: string;
  theme: ThemeConfig;
};

const PALETTES: Palette[] = [
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
];

const RADIUS_OPTIONS: { label: string; value: string }[] = [
  { label: "None", value: "0px" },
  { label: "SM", value: "4px" },
  { label: "MD", value: "8px" },
  { label: "LG", value: "12px" },
  { label: "XL", value: "16px" },
  { label: "Full", value: "9999px" },
];

export function Footer() {
  const [open, setOpen] = useState(false);
  const { theme, updateTheme, setPalette } = useWidgetTheme();

  return (
    <footer className="sticky bottom-0 z-50 border-t bg-background">
      <div className="mx-auto max-w-4xl px-6 py-3">
        <div className="relative flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <span
              className="size-3 rounded-full border"
              style={{ background: theme.accent }}
            />
            Theme
            <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
          </button>

          {open && (
            <div className="absolute bottom-full right-0 mb-2 w-72 rounded-lg border bg-popover p-4 shadow-lg">
              <p className="mb-3 text-xs font-semibold text-foreground">
                Color Palette
              </p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {PALETTES.map((palette) => {
                  const isActive =
                    theme.bg === palette.theme.bg &&
                    theme.primary === palette.theme.primary;
                  return (
                    <button
                      type="button"
                      key={palette.name}
                      onClick={() => setPalette(palette.theme)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-md border p-2 transition-colors hover:bg-muted",
                        isActive && "border-primary bg-muted",
                      )}
                    >
                      <div className="flex gap-0.5">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: palette.theme.bg }}
                        />
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: palette.theme.primary }}
                        />
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: palette.theme.accent }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground leading-none">
                        {palette.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mb-2 text-xs font-semibold text-foreground">
                Radius
              </p>
              <div className="flex gap-1.5">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateTheme("radius", opt.value)}
                    className={cn(
                      "flex-1 rounded border py-1 text-[10px] font-medium transition-colors hover:bg-muted",
                      theme.radius === opt.value &&
                        "border-primary bg-muted text-foreground",
                      theme.radius !== opt.value && "text-muted-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
