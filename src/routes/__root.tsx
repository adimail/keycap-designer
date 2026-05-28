import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="bottom-right" richColors closeButton />
      <Outlet />
    </div>
  )
}
