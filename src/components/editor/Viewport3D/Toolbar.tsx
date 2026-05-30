import {
  Focus,
  ZoomIn,
  ZoomOut,
  Camera,
  Maximize,
  Minimize,
} from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { ActionButton } from '@/components/ActionButton'

export function Toolbar() {
  const {
    setCameraCommand,
    stampMode,
    editingLayerId,
    leftPanelOpen,
    rightPanelOpen,
    toggleFullscreen,
  } = useUIStore()

  if (stampMode || editingLayerId) return null

  const isFullscreen = !leftPanelOpen && !rightPanelOpen

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[var(--surface-strong)] p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-[var(--line)] z-10 backdrop-blur-md">
      <ActionButton
        type="button"
        onClick={() => setCameraCommand('center')}
        variant="ghost"
        size="n"
        className="p-2 hover:bg-[var(--line)] rounded-full text-[var(--sea-ink)] transition-colors"
        title="Center Canvas"
      >
        <Focus className="w-5 h-5" />
      </ActionButton>
      <div className="w-[1px] h-6 bg-[var(--line)] mx-1" />
      <ActionButton
        type="button"
        onClick={() => setCameraCommand('zoom-in')}
        variant="ghost"
        size="n"
        className="p-2 hover:bg-[var(--line)] rounded-full text-[var(--sea-ink)] transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </ActionButton>
      <ActionButton
        type="button"
        onClick={() => setCameraCommand('zoom-out')}
        variant="ghost"
        size="n"
        className="p-2 hover:bg-[var(--line)] rounded-full text-[var(--sea-ink)] transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </ActionButton>
      <div className="w-[1px] h-6 bg-[var(--line)] mx-1" />
      <ActionButton
        type="button"
        onClick={() => setCameraCommand('screenshot')}
        variant="ghost"
        size="n"
        className="p-2 hover:text-white hover:bg-[var(--color-action)] rounded-full text-[var(--sea-ink)] transition-colors"
        title="Capture Snapshot"
      >
        <Camera className="w-5 h-5" />
      </ActionButton>
      <div className="w-[1px] h-6 bg-[var(--line)] mx-1" />
      <ActionButton
        type="button"
        onClick={toggleFullscreen}
        variant="ghost"
        size="n"
        className="p-2 hover:text-white hover:bg-[var(--color-action)] rounded-full text-[var(--sea-ink)] transition-colors"
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </ActionButton>
    </div>
  )
}
