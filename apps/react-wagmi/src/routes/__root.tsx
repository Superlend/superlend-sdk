import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Header } from "@/components/header"

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-svh">
      <Header />
      <main className="mx-auto max-w-md px-6 py-8">
        <Outlet />
      </main>
    </div>
  ),
})
