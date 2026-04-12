import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tailor")({
  component: TailorLayout,
});

function TailorLayout() {
  return <Outlet />;
}
