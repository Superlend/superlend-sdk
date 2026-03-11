import { Dialog } from "@base-ui/react/dialog";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../context/theme.context";
import { PoweredBy } from "./powered-by";

type WidgetDialogProps = {
  children: ReactNode;
  trigger?: ReactNode;
};

const WidgetDialog: React.FC<WidgetDialogProps> = ({ children, trigger }) => {
  const theme = useTheme();

  const popupStyle: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(400px, 90vw)",
    minHeight: "300px",
    height: "480px",
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.radius,
    border: `1px solid ${theme.border}`,
    background: theme.bg,
    paddingTop: "20px",
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: theme.text,
  };

  const scrollStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    paddingLeft: "20px",
    paddingRight: "20px",
    scrollbarGutter: "stable both-edges",
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.border} transparent`,
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          trigger ? (
            <>{trigger}</>
          ) : (
            <button
              type="button"
              className="sl-action-button"
              style={{
                padding: "10px 20px",
                borderRadius: theme.radius,
                background: theme.primary,
                color: theme.bg,
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              View Opportunities
            </button>
          )
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="sl-dialog-overlay" />
        <Dialog.Popup style={popupStyle}>
          <div className="sl-widget-scroll" style={scrollStyle}>
            {children}
          </div>
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <PoweredBy />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { WidgetDialog, type WidgetDialogProps };
