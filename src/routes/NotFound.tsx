import { createFileRoute } from '@tanstack/react-router'
import { ActionLink } from '@/components/ActionLink'
import { ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/NotFound')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <ShieldAlert className="h-16 w-16 text-[var(--color-action)] mb-6" />
      </motion.div>
      <motion.h2
        className="display-title text-4xl font-extrabold text-[var(--sea-ink)] mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        404 - Design Out Of Bounds
      </motion.h2>
      <motion.p
        className="text-sm text-[var(--sea-ink-soft)] max-w-md leading-relaxed mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        The layout or project catalog address you searched for does not exist on
        our keycap mapping tables.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <ActionLink to="/" variant="primary" size="md">
          Return to Catalog Browser
        </ActionLink>
      </motion.div>
    </div>
  )
}
