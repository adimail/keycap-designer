import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ActionButton } from '@/components/ActionButton'
import { useClickOutside } from '@/hooks/useClickOutside'

export function ColorPicker({
  color,
  onChange,
}: {
  color: string
  onChange: (c: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <ActionButton
          type="button"
          variant="ghost"
          size="n"
          className="w-8 h-8 rounded border border-[var(--line)] shadow-sm cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open color picker</span>
        </ActionButton>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-[var(--line)] rounded bg-transparent uppercase font-mono"
        />
      </div>
      {isOpen && (
        <div className="absolute top-10 left-0 z-50 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-[var(--line)]">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
