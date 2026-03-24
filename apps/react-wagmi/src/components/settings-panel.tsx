import type { WidgetVariant } from "@superlend/react-sdk";
import type { ReactNode } from "react";
import { TokenNetworkSelector } from "@/components/token-network-selector";
import { PALETTE_GROUPS, RADIUS_OPTIONS } from "@/config/theme-palettes";
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

/** Theme-only sections shared by both panels */
function ThemeSections() {
  const { theme, updateTheme, setPalette } = useWidgetTheme();

  return (
    <>
      <div>
        <SectionLabel theme={theme}>Network & Token</SectionLabel>
        <TokenNetworkSelector />
      </div>

      <div>
        <SectionLabel theme={theme}>Color Palette</SectionLabel>
        <div className="flex flex-col gap-4">
          {PALETTE_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className="mb-2 text-[10px] font-medium uppercase tracking-wider"
                style={{ color: `${theme.text}66` }}
              >
                {group.label}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {group.palettes.map((palette) => {
                  const isActive =
                    theme.bg === palette.theme.bg &&
                    theme.primary === palette.theme.primary;
                  return (
                    <button
                      type="button"
                      key={palette.name}
                      onClick={() => setPalette(palette.theme)}
                      className="flex flex-col items-center gap-1.5 rounded-md border p-2 transition-colors"
                      style={{
                        borderColor: isActive
                          ? theme.primary
                          : `${theme.text}20`,
                        backgroundColor: isActive
                          ? `${theme.primary}15`
                          : "transparent",
                      }}
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
                      <span
                        className="text-[9px] leading-none"
                        style={{ color: `${theme.text}88` }}
                      >
                        {palette.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel theme={theme}>Radius</SectionLabel>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => updateTheme("radius", opt.value)}
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
