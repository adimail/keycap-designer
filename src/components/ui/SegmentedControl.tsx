import { ActionButton } from '@/components/ActionButton'
import { LayoutGroup, motion } from 'framer-motion'

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  orientation = 'horizontal',
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <LayoutGroup>
      <div
        className={`flex bg-[var(--line)] p-1 rounded-md gap-1 ${orientation === 'vertical' ? 'flex-col' : ''}`}
      >
        {options.map((opt) => (
          <ActionButton
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            variant="ghost"
            size="n"
            className={`relative isolate flex-1 overflow-hidden text-xs py-1.5 rounded font-medium transition-colors ${
              value === opt.value
                ? 'text-[var(--sea-ink)] shadow-sm'
                : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
            }`}
          >
            {value === opt.value && (
              <motion.span
                layoutId="segmented-control-active"
                className="absolute inset-0 -z-10 rounded bg-white dark:bg-zinc-700"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </ActionButton>
        ))}
      </div>
    </LayoutGroup>
  )
}
