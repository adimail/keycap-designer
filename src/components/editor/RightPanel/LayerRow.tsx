import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Trash2, Maximize } from 'lucide-react'
import type { Layer } from '../../../types'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { ActionButton } from '@/components/ActionButton'

export function LayerRow({ layer }: { layer: Layer }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: layer.id })
  const { updateLayer, deleteLayer, globalImages } = useProjectStore()
  const { setEditingLayerId } = useUIStore()

  const style = { transform: CSS.Transform.toString(transform), transition }

  const imgObj = globalImages.find((i) => i.id === layer.imageData)
  const imageSrc = imgObj ? imgObj.data : layer.imageData

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 bg-[var(--surface)] border border-[var(--line)] rounded mb-2 ${!layer.visible ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {imageSrc && (
        <img
          src={imageSrc as string}
          alt=""
          className="w-6 h-6 object-cover rounded bg-white"
        />
      )}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={layer.name}
          onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
          className="text-xs font-bold bg-transparent outline-none w-full truncate"
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={layer.opacity}
          onChange={(e) =>
            updateLayer(layer.id, { opacity: parseFloat(e.target.value) })
          }
          className="w-full h-1"
        />
      </div>
      <div className="flex items-center gap-1">
        <ActionButton
          type="button"
          onClick={() => {
            setEditingLayerId(layer.id)
          }}
          variant="ghost"
          size="n"
          className="p-1 hover:bg-[var(--line)] rounded text-[var(--color-action)]"
          title="Transform Layer"
        >
          <Maximize className="w-3.5 h-3.5" />
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
          variant="ghost"
          size="n"
          className="p-1 hover:bg-[var(--line)] rounded"
        >
          {layer.visible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => deleteLayer(layer.id)}
          variant="danger"
          size="n"
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded border-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </ActionButton>
      </div>
    </div>
  )
}
