import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { StudioLeftPanel } from './StudioLeftPanel'
import { StudioRightPanel } from './StudioRightPanel'
import { ActionButton } from '@/components/ActionButton'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut'

interface StudioViewProps {
  initialKeyId?: string | null
  onKeyIdChange: (keyId: string | null) => void
}

export function StudioView({ initialKeyId, onKeyIdChange }: StudioViewProps) {
  const navigate = useNavigate()
  const { activeProject, saveCurrentProject, setSelectedKeys, selectedKeyIds } =
    useProjectStore()

  useEffect(() => {
    if (!activeProject) return

    if (!initialKeyId) {
      const firstKey = activeProject.keys.find((k) => k.visible)
      if (firstKey) onKeyIdChange(firstKey.id)
      return
    }

    if (selectedKeyIds[0] !== initialKeyId) {
      setSelectedKeys([initialKeyId])
    }
  }, [initialKeyId, activeProject?.id])

  useEffect(() => {
    if (selectedKeyIds.length === 1 && selectedKeyIds[0] !== initialKeyId) {
      onKeyIdChange(selectedKeyIds[0])
    }
  }, [selectedKeyIds, initialKeyId])

  const handleNavigate = useCallback(
    (newId: string) => {
      onKeyIdChange(newId)
      setSelectedKeys([newId])
    },
    [onKeyIdChange, setSelectedKeys],
  )

  const getVisibleKeys = () =>
    activeProject?.keys.filter((k) => k.visible) || []

  const handleNavigatePrev = useCallback(() => {
    const visible = getVisibleKeys()
    const idx = visible.findIndex((k) => k.id === initialKeyId)
    if (idx > 0) handleNavigate(visible[idx - 1].id)
  }, [initialKeyId, activeProject, handleNavigate])

  const handleNavigateNext = useCallback(() => {
    const visible = getVisibleKeys()
    const idx = visible.findIndex((k) => k.id === initialKeyId)
    if (idx < visible.length - 1) handleNavigate(visible[idx + 1].id)
  }, [initialKeyId, activeProject, handleNavigate])

  const handleNavigateVertical = useCallback(
    (direction: 'up' | 'down') => {
      const visible = getVisibleKeys()
      const current = visible.find((k) => k.id === initialKeyId)
      if (!current) return

      const currentCenter = current.col + current.widthUnits / 2
      const candidates = visible.filter((k) =>
        direction === 'up' ? k.row < current.row : k.row > current.row,
      )
      if (candidates.length === 0) return

      const targetRow =
        direction === 'up'
          ? Math.max(...candidates.map((k) => k.row))
          : Math.min(...candidates.map((k) => k.row))

      const rowKeys = candidates.filter((k) => k.row === targetRow)
      const closest = rowKeys.reduce((prev, curr) => {
        const prevDiff = Math.abs(
          prev.col + prev.widthUnits / 2 - currentCenter,
        )
        const currDiff = Math.abs(
          curr.col + curr.widthUnits / 2 - currentCenter,
        )
        return currDiff < prevDiff ? curr : prev
      })

      handleNavigate(closest.id)
    },
    [initialKeyId, activeProject, handleNavigate],
  )

  useKeyboardShortcuts([
    { key: 'ArrowLeft', callback: handleNavigatePrev },
    { key: 'ArrowRight', callback: handleNavigateNext },
    { key: 'ArrowUp', callback: () => handleNavigateVertical('up') },
    { key: 'ArrowDown', callback: () => handleNavigateVertical('down') },
  ])

  const handleBack = async () => {
    await saveCurrentProject()
    navigate({ to: `/project/${activeProject?.id}` })
  }

  if (!activeProject || !initialKeyId) return null

  const activeKey = activeProject.keys.find((k) => k.id === initialKeyId)
  const visibleKeys = getVisibleKeys()
  const currentIndex = visibleKeys.findIndex((k) => k.id === initialKeyId) + 1

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      <div className="h-12 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <ActionButton
            type="button"
            onClick={handleBack}
            variant="ghost"
            size="n"
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </ActionButton>
          <span className="text-sm font-bold text-[var(--sea-ink)]">
            Key Studio
          </span>
        </div>
        <div className="text-sm text-[var(--sea-ink-soft)] font-mono">
          {activeKey?.label || 'Key'} — Row {(activeKey?.row || 0) + 1}, Col{' '}
          {(activeKey?.col || 0) + 1}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <StudioLeftPanel />
        <StudioRightPanel
          activeKeyId={initialKeyId}
          currentIndex={currentIndex}
          totalKeys={visibleKeys.length}
          onNavigatePrev={handleNavigatePrev}
          onNavigateNext={handleNavigateNext}
        />
      </div>
    </div>
  )
}
