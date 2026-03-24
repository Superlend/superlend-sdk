import { Link } from "@tanstack/react-router";
import { SuperlendLogo } from "@/components/superlend-logo";
import { useWidgetTheme } from "@/context/widget-theme";

export function Header() {
  const { theme } = useWidgetTheme();

  return (
    <header
      className="border-b transition-colors duration-300"
      style={{ backgroundColor: theme.bg, borderColor: `${theme.text}15` }}
    >
      <div className="flex items-center px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <SuperlendLogo size={22} />
          <span className="text-sm font-semibold" style={{ color: theme.text }}>
            SDK Demo
          </span>
        </Link>
      </div>
    </header>
  );
}
