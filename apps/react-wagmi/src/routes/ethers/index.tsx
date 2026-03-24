import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ethers/")({
  component: () => <Navigate to="/ethers/aggregators" />,
});
