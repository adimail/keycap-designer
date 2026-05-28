import { createFileRoute } from '@tanstack/react-router'
import { ActionLink } from '@/components/ActionLink'
import { ShieldAlert } from 'lucide-react'

export const Route = createFileRoute('/NotFound')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-16 w-16 text-[var(--color-action)] mb-6 animate-bounce" />
      <h2 className="display-title text-4xl font-extrabold text-[var(--sea-ink)] mb-3">
        404 - Design Out Of Bounds
      </h2>
      <p className="text-sm text-[var(--sea-ink-soft)] max-w-md leading-relaxed mb-8">
        The layout or project catalog address you searched for does not exist on
        our keycap mapping tables.
      </p>
      <ActionLink to="/" variant="primary" size="md">
        Return to Catalog Browser
      </ActionLink>
    </div>
  )
}
