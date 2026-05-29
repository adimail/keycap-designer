import { useState, useMemo } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ActionButton } from '@/components/ActionButton'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useProjectStore } from '@/store/useProjectStore'
import { PRESET_COLORS } from '#/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'

export function ColorPicker({
  color,
  onChange,
}: {
  color: string
  onChange: (c: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  const { activeProject } = useProjectStore()

  const projectColors = useMemo(() => {
    if (!activeProject) return []
    const colors = new Set<string>()

    if (color) colors.add(color.toLowerCase())

    activeProject.keys.forEach((k) => {
      if (k.colour) colors.add(k.colour.toLowerCase())
      if (k.labelStyle?.color) colors.add(k.labelStyle.color.toLowerCase())
    })

    return Array.from(colors).filter(Boolean).slice(0, 14)
  }, [activeProject, color])

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <motion.div whileTap={{ scale: 0.9 }}>
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
        </motion.div>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-[var(--line)] rounded bg-transparent uppercase font-mono"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-10 left-0 z-50 p-4 bg-[var(--surface-strong)] backdrop-blur-md rounded-xl shadow-2xl border border-[var(--line)] w-[240px] flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: '100%', height: '160px' }}
          />

          {projectColors.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                Project Colors
              </span>
              <div className="flex flex-wrap gap-1.5">
                {projectColors.map((c) => (
                  <motion.button
                    key={`proj-${c}`}
                    type="button"
                    onClick={() => onChange(c)}
                    whileHover={{ scale: 1.15 }}
                    className={`w-5 h-5 rounded border shadow-sm transition-transform hover:scale-110 ${
                      color.toLowerCase() === c.toLowerCase()
                        ? 'border-[var(--color-action)] ring-1 ring-[var(--color-action)]'
                        : 'border-[var(--line)]'
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((c) => (
                <motion.button
                  key={`pre-${c}`}
                  type="button"
                  onClick={() => onChange(c)}
                  whileHover={{ scale: 1.15 }}
                  className={`w-5 h-5 rounded border shadow-sm transition-transform hover:scale-110 ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'border-[var(--color-action)] ring-1 ring-[var(--color-action)]'
                      : 'border-[var(--line)]'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
