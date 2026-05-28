import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ActionButton } from '@/components/ActionButton'

interface NavigationBarProps {
  currentIndex: number
  totalKeys: number
  onPrev: () => void
  onNext: () => void
}

export function NavigationBar({
  currentIndex,
  totalKeys,
  onPrev,
  onNext,
}: NavigationBarProps) {
  const canGoPrev = currentIndex > 1
  const canGoNext = currentIndex < totalKeys

  return (
    <div className="h-16 border-t border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0">
      <ActionButton
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        variant="outline"
        size="sm"
        className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
          canGoPrev
            ? 'bg-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--line-strong)]'
            : 'bg-[var(--line)] text-[var(--sea-ink-soft)] opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </ActionButton>

      <div className="text-sm text-[var(--sea-ink-soft)] font-mono">
        {currentIndex} / {totalKeys}
      </div>

      <ActionButton
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        variant="outline"
        size="sm"
        className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
          canGoNext
            ? 'bg-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--line-strong)]'
            : 'bg-[var(--line)] text-[var(--sea-ink-soft)] opacity-50 cursor-not-allowed'
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </ActionButton>
    </div>
  )
}
