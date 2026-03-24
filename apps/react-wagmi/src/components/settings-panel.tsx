import type { WidgetVariant } from "@superlend/react-sdk";
import type { ReactNode } from "react";
import { TokenNetworkSelector } from "@/components/token-network-selector";
import {
  BACKGROUNDS,
  ACCENT_COLORS,
  RADIUS_OPTIONS,
} from "@/config/theme-palettes";
import { useDemoSettings } from "@/context/demo-settings";
import { useWidgetTheme } from "@/context/widget-theme";

const VARIANTS: { value: WidgetVariant; label: string }[] = [
  { value: "inline", label: "Inline" },
  { value: "dialog", label: "Dialog" },
];

const WALLET_MODES: { value: boolean; label: string }[] = [
  { value: false, label: "walletClient" },
  { value: true, label: "onAction callback" },
];

function SectionLabel({
  children,
  theme,
}: { children: ReactNode; theme: { text: string } }) {
  return (
    <p
      className="mb-2 text-xs font-semibold"
      style={{ color: `${theme.text}aa` }}
    >
      {children}
    </p>
  );
}

function SubLabel({
  children,
  theme,
}: { children: ReactNode; theme: { text: string } }) {
  return (
    <p
      className="mb-2 text-[10px] font-medium uppercase tracking-wider"
      style={{ color: `${theme.text}66` }}
    >
      {children}
    </p>
  );
}

function PanelShell({ children }: { children: ReactNode }) {
  const { theme } = useWidgetTheme();
  return (
    <aside
      className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-l p-4 transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        borderColor: `${theme.text}15`,
        color: theme.text,
      }}
    >
      {children}
    </aside>
  );
}

function ThemeSections() {
  const { theme, background, accent, setBackground, setAccent, setRadius } =
    useWidgetTheme();

  return (
    <>
      <div>
        <SectionLabel theme={theme}>Background / Theme</SectionLabel>
        <div className="grid grid-cols-4 gap-1.5">
          {BACKGROUNDS.map((bg) => {
            const isActive = background.name === bg.name;
            return (
              <button
                type="button"
                key={bg.name}
                onClick={() => setBackground(bg)}
                className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors"
                style={{
                  border: `1px solid ${isActive ? theme.primary : `${theme.text}20`}`,
                  backgroundColor: isActive
                    ? `${theme.primary}15`
                    : "transparent",
                }}
              >
                <span
                  className="size-5 rounded-sm border"
                  style={{
                    background: bg.bg,
                    borderColor: bg.isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                  }}
                />
                <span
                  className="text-[8px] leading-none"
                  style={{ color: `${theme.text}88` }}
                >
                  {bg.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel theme={theme}>Main Color</SectionLabel>
        <div className="grid grid-cols-6 gap-1.5">
          {ACCENT_COLORS.map((color) => {
            const isActive = accent.name === color.name;
            return (
              <button
                type="button"
                key={color.name}
                onClick={() => setAccent(color)}
                className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors"
                style={{
                  border: `1px solid ${isActive ? theme.primary : `${theme.text}20`}`,
                  backgroundColor: isActive
                    ? `${theme.primary}15`
                    : "transparent",
                }}
                title={color.name}
              >
                <span
                  className="size-4 rounded-full"
                  style={{ background: color.swatch }}
                />
                <span
                  className="text-[7px] leading-none"
                  style={{ color: `${theme.text}88` }}
                >
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel theme={theme}>Radius</SectionLabel>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setRadius(opt.value)}
              className="flex-1 rounded py-1 text-[10px] font-medium transition-colors"
              style={{
                border: `1px solid ${theme.radius === opt.value ? theme.primary : `${theme.text}20`}`,
                backgroundColor:
                  theme.radius === opt.value
                    ? `${theme.primary}15`
                    : "transparent",
                color: theme.text,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/** Right pane for home — theme only */
export function ThemePanel() {
  return (
    <PanelShell>
      <ThemeSections />
    </PanelShell>
  );
}

/** Right pane for adapter routes — wallet + props + theme */
export function SettingsPanel({
  walletButton,
}: { walletButton?: ReactNode }) {
  const { theme } = useWidgetTheme();
  const { variant, setVariant, useCallback, setUseCallback } =
    useDemoSettings();

  return (
    <PanelShell>
      {walletButton && (
        <div>
          <SectionLabel theme={theme}>Wallet</SectionLabel>
          {walletButton}
        </div>
      )}

      <div>
        <SectionLabel theme={theme}>Network & Token</SectionLabel>
        <TokenNetworkSelector />
      </div>

      <div>
        <SectionLabel theme={theme}>Variant</SectionLabel>
        <div className="flex gap-1.5">
          {VARIANTS.map((v) => (
            <button
              type="button"
              key={v.value}
              onClick={() => setVariant(v.value)}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                border: `1px solid ${variant === v.value ? theme.primary : `${theme.text}20`}`,
                backgroundColor:
                  variant === v.value ? `${theme.primary}15` : "transparent",
                color: theme.text,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel theme={theme}>Wallet Interaction</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {WALLET_MODES.map((mode) => (
            <button
              type="button"
              key={String(mode.value)}
              onClick={() => setUseCallback(mode.value)}
              className="rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors"
              style={{
                border: `1px solid ${useCallback === mode.value ? theme.primary : `${theme.text}20`}`,
                backgroundColor:
                  useCallback === mode.value
                    ? `${theme.primary}15`
                    : "transparent",
                color: theme.text,
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: `${theme.text}15` }} />

      <ThemeSections />
    </PanelShell>
  );
}
