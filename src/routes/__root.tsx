import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

export const Route = createRootRoute({
  component: RootComponent,
})

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function RootComponent() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--surface-strong)',
            border: '1px solid var(--line)',
            color: 'var(--sea-ink)',
          },
          className: 'backdrop-blur-md',
        }}
        closeButton
      />
      <AnimatePresence mode="wait">
        <PageTransition key={router.state.location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
