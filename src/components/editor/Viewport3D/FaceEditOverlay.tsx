import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import type { Layer } from '@/types'
import { ActionButton } from '@/components/ActionButton'

export function FaceEditOverlay() {
  const { editingLayerId, setEditingLayerId } = useUIStore()
  const { updateLayer, activeProject } = useProjectStore()

  if (!editingLayerId || !activeProject) return null

  let layer: Layer | undefined
  for (const k of activeProject.keys) {
    layer = k.layers.find((l) => l.id === editingLayerId)
    if (layer) break
  }

  if (!layer) return null

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 pointer-events-none">
      <div className="bg-[var(--surface-strong)] p-4 rounded-xl shadow-2xl border border-[var(--line)] pointer-events-auto flex flex-col gap-4 w-80 backdrop-blur-md">
        <div className="text-sm font-bold flex justify-between items-center text-[var(--sea-ink)] border-b border-[var(--line)] pb-2">
          <span>Transform Layer</span>
          <ActionButton
            type="button"
            onClick={() => {
              setEditingLayerId(null)
            }}
            variant="outline"
            size="n"
            className="text-[10px] bg-[var(--line)] px-2 py-1 rounded"
          >
            Done
          </ActionButton>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[var(--sea-ink-soft)] flex justify-between">
            Scale <span>{layer.scale.toFixed(2)}x</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="25"
            step="0.1"
            value={layer.scale}
            onChange={(e) =>
              updateLayer(layer.id, { scale: parseFloat(e.target.value) })
            }
            className="w-full accent-[var(--color-action)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[var(--sea-ink-soft)] flex justify-between">
            Rotation{' '}
            <span>{Math.round(layer.rotation * (180 / Math.PI))}°</span>
          </label>
          <input
            type="range"
            min="-3.14"
            max="3.14"
            step="0.05"
            value={layer.rotation}
            onChange={(e) =>
              updateLayer(layer.id, { rotation: parseFloat(e.target.value) })
            }
            className="w-full accent-[var(--color-action)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[var(--sea-ink-soft)]">
              X Offset
            </label>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.1"
              value={layer.position.x}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                const updates: Partial<Layer> = {
                  position: {
                    ...layer.position,
                    x: val,
                  },
                }
                if (layer.position3D) {
                  updates.position3D = {
                    ...layer.position3D,
                    x: val,
                  }
                }
                updateLayer(layer.id, updates)
              }}
              className="accent-[var(--color-action)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[var(--sea-ink-soft)]">
              Y Offset
            </label>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.1"
              value={layer.position.y}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                const updates: Partial<Layer> = {
                  position: {
                    ...layer.position,
                    y: val,
                  },
                }
                if (layer.position3D) {
                  updates.position3D = {
                    ...layer.position3D,
                    z: val,
                  }
                }
                updateLayer(layer.id, updates)
              }}
              className="accent-[var(--color-action)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
