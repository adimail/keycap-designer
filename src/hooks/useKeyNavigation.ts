import { useCallback } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'

export function useKeyNavigation() {
  const { activeProject, selectedKeyIds, setSelectedKeys } = useProjectStore()

  const navigate = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down', shiftKey: boolean) => {
      if (!activeProject) return

      const visibleKeys = activeProject.keys.filter((k) => k.visible)
      if (visibleKeys.length === 0) return

      // Sort keys in natural reading order
      const sortedKeys = [...visibleKeys].sort((a, b) => {
        if (a.row === b.row) return a.col - b.col
        return a.row - b.row
      })

      if (selectedKeyIds.length === 0) {
        const firstId = sortedKeys[0].id
        setSelectedKeys([firstId])
        useUIStore.getState().setCameraCommand('focus-key', firstId)
        return
      }

      // In our array, index 0 acts as the selection anchor
      // The last item acts as the actively moving head
      const anchorId = selectedKeyIds[0]
      const headId = selectedKeyIds[selectedKeyIds.length - 1]

      const headIndex = sortedKeys.findIndex((k) => k.id === headId)
      const headKey = sortedKeys[headIndex]

      if (!headKey) return

      let targetKey = null

      if (direction === 'left') {
        if (headIndex > 0) targetKey = sortedKeys[headIndex - 1]
      } else if (direction === 'right') {
        if (headIndex < sortedKeys.length - 1)
          targetKey = sortedKeys[headIndex + 1]
      } else if (direction === 'up' || direction === 'down') {
        const currentCenter = headKey.col + headKey.widthUnits / 2
        const candidates = sortedKeys.filter((k) =>
          direction === 'up' ? k.row < headKey.row : k.row > headKey.row,
        )

        if (candidates.length > 0) {
          const targetRow =
            direction === 'up'
              ? Math.max(...candidates.map((k) => k.row))
              : Math.min(...candidates.map((k) => k.row))

          const rowKeys = candidates.filter((k) => k.row === targetRow)
          targetKey = rowKeys.reduce((prev, curr) => {
            const prevDiff = Math.abs(
              prev.col + prev.widthUnits / 2 - currentCenter,
            )
            const currDiff = Math.abs(
              curr.col + curr.widthUnits / 2 - currentCenter,
            )
            return currDiff < prevDiff ? curr : prev
          })
        }
      }

      if (targetKey) {
        if (shiftKey) {
          // Range selection logic
          const anchorIndex = sortedKeys.findIndex((k) => k.id === anchorId)
          const targetIndex = sortedKeys.findIndex(
            (k) => k.id === targetKey!.id,
          )

          const minIdx = Math.min(anchorIndex, targetIndex)
          const maxIdx = Math.max(anchorIndex, targetIndex)

          const newSelection = sortedKeys
            .slice(minIdx, maxIdx + 1)
            .map((k) => k.id)

          // Filter target out temporarily to re-append it
          const filtered = newSelection.filter((id) => id !== targetKey!.id)

          // Reconstruct array: Keep anchor first, dedup middle keys, and forcefully append target as head
          const finalArray = Array.from(new Set([anchorId, ...filtered]))
          const withoutTarget = finalArray.filter((id) => id !== targetKey!.id)
          withoutTarget.push(targetKey!.id)

          setSelectedKeys(withoutTarget)
        } else {
          // Standard single selection
          setSelectedKeys([targetKey.id])
        }

        // Auto pan & zoom the camera to clearly show the currently targeted key
        useUIStore.getState().setCameraCommand('focus-key', targetKey.id)
      }
    },
    [activeProject, selectedKeyIds, setSelectedKeys],
  )

  return navigate
}
