import { Dialog } from "@base-ui/react/dialog";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../context/theme.context";

type WidgetDialogProps = {
  children: ReactNode;
  trigger?: ReactNode;
};

const WidgetDialog: React.FC<WidgetDialogProps> = ({ children, trigger }) => {
  const theme = useTheme();

  const contentStyle: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(400px, 90vw)",
    maxHeight: "85vh",
    overflowY: "auto",
    borderRadius: theme.radius,
    background: theme.bg,
    padding: "20px",
    zIndex: 9999,
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
        <Dialog.Popup style={contentStyle}>{children}</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { WidgetDialog, type WidgetDialogProps };
