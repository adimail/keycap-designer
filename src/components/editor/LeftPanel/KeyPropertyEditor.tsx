import { useProjectStore } from '@/store/useProjectStore'
import { ColorPicker } from '../../ui/ColorPicker'
import { RotateCcw } from 'lucide-react'
import { ActionButton } from '@/components/ActionButton'

const FONTS = [
  'Inter',
  'JetBrains Mono',
  'DM Mono',
  'IBM Plex Mono',
  'Futura',
  'Helvetica Neue',
  'Roboto Mono',
  'Space Mono',
]

export function KeyPropertyEditor() {
  const {
    activeProject,
    selectedKeyIds,
    updateSelectedKeys,
    updateKeyLabelStyle,
    resetSelectedKeys,
  } = useProjectStore()
  if (!activeProject || selectedKeyIds.length === 0) return null

  const firstKey = activeProject.keys.find((k) => k.id === selectedKeyIds[0])
  if (!firstKey) return null

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]

  return (
    <div className="flex flex-col gap-6 py-4 border-b border-[var(--line)]">
      <div>
        <label className="block text-xs font-bold mb-2 text-[var(--sea-ink-soft)]">
          Key Color
        </label>
        <ColorPicker
          color={firstKey.colour}
          onChange={(c) => updateSelectedKeys({ colour: c })}
        />
      </div>
      <div className="p-3 bg-[var(--line)] rounded-lg flex flex-col gap-3">
        <label className="block text-xs font-bold text-[var(--sea-ink)]">
          Legend
        </label>
        <input
          type="text"
          value={firstKey.label}
          onChange={(e) => updateSelectedKeys({ label: e.target.value })}
          className="w-full px-2 py-1.5 text-xs border border-[var(--line)] rounded bg-[var(--surface)]"
          placeholder="Multiple values..."
        />
        <div className="flex gap-2">
          <select
            value={firstKey.labelStyle.fontFamily}
            onChange={(e) =>
              updateKeyLabelStyle({ fontFamily: e.target.value })
            }
            className="flex-1 px-2 py-1.5 text-xs border border-[var(--line)] rounded bg-[var(--surface)]"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="8"
            max="72"
            value={firstKey.labelStyle.fontSize}
            onChange={(e) =>
              updateKeyLabelStyle({ fontSize: Number(e.target.value) })
            }
            className="w-16 px-2 py-1.5 text-xs border border-[var(--line)] rounded bg-[var(--surface)]"
          />
        </div>
        <ColorPicker
          color={firstKey.labelStyle.color}
          onChange={(c) => updateKeyLabelStyle({ color: c })}
        />
        <div className="grid grid-cols-3 gap-1 w-24 mx-auto mt-2">
          {positions.map((pos) => (
            <ActionButton
              type="button"
              key={pos}
              onClick={() => updateKeyLabelStyle({ position: pos })}
              variant="ghost"
              size="n"
              className={`w-6 h-6 rounded border ${firstKey.labelStyle.position === pos ? 'bg-[var(--color-action)] border-[var(--color-action)]' : 'border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--line)]'}`}
            >
              <span className="sr-only">{pos}</span>
            </ActionButton>
          ))}
        </div>
      </div>
      <ActionButton
        type="button"
        onClick={resetSelectedKeys}
        variant="outline"
        size="sm"
      >
        <RotateCcw className="w-3 h-3" /> Reset to Defaults
      </ActionButton>
    </div>
  )
}
