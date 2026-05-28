import { useProjectStore } from '@/store/useProjectStore'
import { NavigationBar } from './NavigationBar'
import { KeyPreview3D } from './KeyPreview3D'

interface StudioRightPanelProps {
  activeKeyId: string
  currentIndex: number
  totalKeys: number
  onNavigatePrev: () => void
  onNavigateNext: () => void
}

export function StudioRightPanel({
  activeKeyId,
  currentIndex,
  totalKeys,
  onNavigatePrev,
  onNavigateNext,
}: StudioRightPanelProps) {
  const { activeProject } = useProjectStore()

  if (!activeProject) return null
  const activeKey = activeProject.keys.find((k) => k.id === activeKeyId)
  if (!activeKey) return null

  return (
    <div className="w-1/2 overflow-hidden flex flex-col bg-[var(--surface-strong)]">
      <div className="flex-1 relative bg-gradient-to-b from-black/20 to-transparent">
        <div className="absolute top-4 left-4 z-10">
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-action)]">
            Precision Preview
          </div>
          <div className="text-xl font-bold text-[var(--sea-ink)]">
            {activeKey.label || 'Unnamed Key'}
          </div>
        </div>
        <KeyPreview3D keyId={activeKeyId} />
      </div>

      <NavigationBar
        currentIndex={currentIndex}
        totalKeys={totalKeys}
        onPrev={onNavigatePrev}
        onNext={onNavigateNext}
      />
    </div>
  )
}
