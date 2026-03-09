import type { ResolvedTheme } from "../types";

const STYLE_ID = "data-superlend";

const buildCss = (theme: ResolvedTheme): string => {
  return `
.sl-opportunity-card:hover {
  background: ${theme.accent}14;
}
.sl-opportunity-card:focus-visible {
  outline: 2px solid ${theme.accent};
  outline-offset: 2px;
}
.sl-action-button:hover {
  opacity: 0.9;
}
.sl-action-button:focus-visible {
  outline: 2px solid ${theme.text};
  outline-offset: 2px;
}
.sl-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.sl-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}
.sl-powered-by:hover {
  opacity: 0.8;
}
`.trim();
};

const injectStyles = (theme: ResolvedTheme): void => {
  if (typeof document === "undefined") return;

  let style = document.querySelector(`style[${STYLE_ID}]`) as HTMLStyleElement;

  if (!style) {
    style = document.createElement("style");
    style.setAttribute(STYLE_ID, "");
    document.head.appendChild(style);
  }

  style.textContent = buildCss(theme);
};

export { injectStyles };
