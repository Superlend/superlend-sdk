import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/wagmi/")({
  component: () => <Navigate to="/wagmi/aggregators" />,
});
