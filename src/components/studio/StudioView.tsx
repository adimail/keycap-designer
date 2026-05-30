import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { StudioLeftPanel } from './StudioLeftPanel'
import { StudioRightPanel } from './StudioRightPanel'
import { ActionButton } from '@/components/ActionButton'
import { useKeyNavigation } from '@/hooks/useKeyNavigation'

interface StudioViewProps {
  initialKeyId?: string | null
  onKeyIdChange: (keyId: string | null) => void
}

export function StudioView({ initialKeyId, onKeyIdChange }: StudioViewProps) {
  const navigate = useNavigate()
  const { activeProject, saveCurrentProject, setSelectedKeys, selectedKeyIds } =
    useProjectStore()

  const navigateKey = useKeyNavigation()

  useEffect(() => {
    if (!activeProject) return

    if (!initialKeyId) {
      const firstKey = activeProject.keys.find((k) => k.visible)
      if (firstKey) onKeyIdChange(firstKey.id)
      return
    }

    if (!selectedKeyIds.includes(initialKeyId)) {
      setSelectedKeys([initialKeyId])
    }
  }, [initialKeyId, activeProject?.id])

  useEffect(() => {
    if (selectedKeyIds.length > 0) {
      const headId = selectedKeyIds[selectedKeyIds.length - 1]
      if (headId !== initialKeyId) {
        onKeyIdChange(headId)
      }
    }
  }, [selectedKeyIds, initialKeyId, onKeyIdChange])

  const getVisibleKeys = () =>
    activeProject?.keys.filter((k) => k.visible) || []

  const handleNavigatePrev = useCallback(() => {
    navigateKey('left', false)
  }, [navigateKey])

  const handleNavigateNext = useCallback(() => {
    navigateKey('right', false)
  }, [navigateKey])

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
