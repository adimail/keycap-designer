import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import type { Layer } from '@/types'
import { ActionButton } from '@/components/ActionButton'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

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

  const handleScale = (delta: number) => {
    updateLayer(layer.id, { scale: Math.max(0.01, layer.scale + delta) })
  }

  const handleRotation = (delta: number) => {
    updateLayer(layer.id, { rotation: layer.rotation + delta })
  }

  const handleXOffset = (delta: number) => {
    const val = layer.position.x + delta
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
  }

  const handleYOffset = (delta: number) => {
    const val = layer.position.y + delta
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
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 pointer-events-none">
      <div className="bg-[var(--surface-strong)] p-4 rounded-xl shadow-2xl border border-[var(--line)] pointer-events-auto flex flex-col gap-4 w-[480px] backdrop-blur-md">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-[var(--line)] px-3 py-2 rounded-lg">
              <label className="text-[10px] font-black text-[var(--sea-ink-soft)] uppercase tracking-tighter">
                Scale
              </label>
              <div className="flex gap-1">
                <ActionButton
                  type="button"
                  onClick={() => handleScale(-0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ZoomOut className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleScale(0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ZoomIn className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[var(--line)] px-3 py-2 rounded-lg">
              <label className="text-[10px] font-black text-[var(--sea-ink-soft)] uppercase tracking-tighter">
                Rotation
              </label>
              <div className="flex gap-1">
                <ActionButton
                  type="button"
                  onClick={() => handleRotation(0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <RotateCcw className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleRotation(-0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <RotateCw className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-[var(--line)] px-3 py-2 rounded-lg">
              <label className="text-[10px] font-black text-[var(--sea-ink-soft)] uppercase tracking-tighter">
                X Offset
              </label>
              <div className="flex gap-1">
                <ActionButton
                  type="button"
                  onClick={() => handleXOffset(-0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleXOffset(0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ArrowRight className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[var(--line)] px-3 py-2 rounded-lg">
              <label className="text-[10px] font-black text-[var(--sea-ink-soft)] uppercase tracking-tighter">
                Y Offset
              </label>
              <div className="flex gap-1">
                <ActionButton
                  type="button"
                  onClick={() => handleYOffset(0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ArrowDown className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleYOffset(-0.01)}
                  variant="outline"
                  size="n"
                  className="p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--color-action)] hover:text-white border-[var(--line)]"
                >
                  <ArrowUp className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
