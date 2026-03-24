import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ethers/")({
  component: () => <Navigate to="/ethers/aggregators" />,
});
