import { Link, useRouterState } from "@tanstack/react-router";
import { useWidgetTheme } from "@/context/widget-theme";

const NAV_TREE = [
  {
    label: "wagmi",
    children: [
      { to: "/wagmi/aggregators", label: "aggregator" },
      { to: "/wagmi/portfolio", label: "portfolio" },
    ],
  },
  {
    label: "ethers",
    children: [
      { to: "/ethers", label: "aggregator" },
      { to: "/ethers/dialog", label: "portfolio" },
    ],
  },
] as const;

export function NavPanel() {
  const { theme } = useWidgetTheme();
  const router = useRouterState();
  const pathname = router.location.pathname;

  return (
    <aside
      className="flex w-52 shrink-0 flex-col overflow-y-auto border-r p-4 transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        borderColor: `${theme.text}15`,
        color: theme.text,
      }}
    >
      <nav className="flex flex-col gap-3">
        {NAV_TREE.map((group) => (
          <div key={group.label}>
            <p
              className="mb-1 text-xs font-semibold"
              style={{ color: `${theme.text}aa` }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5 pl-3">
              {group.children.map((item) => {
                const isActive =
                  pathname === item.to || pathname === `${item.to}/`;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-md px-2 py-1 text-xs font-medium no-underline transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? `${theme.primary}20`
                        : "transparent",
                      color: isActive ? theme.text : `${theme.text}77`,
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
