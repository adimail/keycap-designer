import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useProjectStore } from '@/store/useProjectStore'
import { LayerRow } from './LayerRow'
import { AnimatePresence, motion } from 'framer-motion'

export function LayersTab() {
  const { activeProject, selectedKeyIds, reorderLayers } = useProjectStore()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (!activeProject || selectedKeyIds.length === 0)
    return (
      <p className="text-xs text-[var(--sea-ink-soft)] mt-4">
        Select a key to manage its layers.
      </p>
    )

  const firstKey = activeProject.keys.find((k) => k.id === selectedKeyIds[0])
  if (!firstKey) return null

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = firstKey.layers.findIndex((l) => l.id === active.id)
      const newIndex = firstKey.layers.findIndex((l) => l.id === over.id)
      reorderLayers(oldIndex, newIndex)
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {selectedKeyIds.length > 1 && (
        <div className="p-2 mb-2 bg-[var(--color-ledger)] border border-[var(--line)] rounded text-[10px] text-[var(--sea-ink)] leading-tight font-bold">
          Showing layers for {firstKey.label || firstKey.id}. Edits will apply
          to all {selectedKeyIds.length} selected keys.
        </div>
      )}

      <div className="flex items-center gap-2 p-2 bg-[var(--surface)] border border-[var(--line)] rounded mb-1 opacity-70">
        <div className="w-4 h-4" />
        <div className="w-6 h-6 flex items-center justify-center font-serif font-black text-xs border border-[var(--line)] rounded bg-[var(--surface)] text-[var(--sea-ink)]">
          A
        </div>
        <div className="flex-1 text-xs font-bold text-[var(--sea-ink)]">
          Legend
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={firstKey.layers.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {[...firstKey.layers].reverse().map((layer) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LayerRow layer={layer} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      <AnimatePresence>
        {firstKey.layers.length === 0 && (
          <motion.p
            className="text-xs text-[var(--sea-ink-soft)] text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No image layers added.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 p-2 bg-[var(--surface)] border border-[var(--line)] rounded mt-1">
        <div className="w-4 h-4" />
        <div
          className="w-6 h-6 rounded border border-[var(--line)]"
          style={{ backgroundColor: firstKey.colour }}
        />
        <div className="flex-1 text-xs font-bold text-[var(--sea-ink)]">
          Base Color
        </div>
      </div>
    </div>
  )
}
