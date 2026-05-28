import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { ActionButton } from '@/components/ActionButton'

export function StampHUD() {
  const {
    stampMode,
    stampScope,
    stampSnapToCenter,
    setStampMode,
    setStampSnapToCenter,
    setEditingLayerId,
    setStampHoverInfo,
  } = useUIStore()
  const { selectedKeyIds, activeProject } = useProjectStore()

  if (!stampMode || !activeProject) return null

  const numKeys =
    stampScope === 'selected'
      ? selectedKeyIds.length
      : activeProject.keys.filter((k) => k.visible).length

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[var(--surface-strong)] px-4 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-[var(--color-action)] flex items-center gap-4 z-50 pointer-events-auto backdrop-blur-md">
      <span className="text-xs font-bold text-[var(--sea-ink)] whitespace-nowrap">
        Placing on {numKeys} keys
      </span>
      <div className="w-[1px] h-4 bg-[var(--line)]" />
      <div className="flex bg-[var(--line)] p-0.5 rounded gap-0.5">
        <ActionButton
          type="button"
          onClick={() =>
            setStampMode(true, useUIStore.getState().stampImageId, 'all')
          }
          variant={stampScope === 'all' ? 'primary' : 'ghost'}
          size="n"
          className={`px-2 py-1 text-[10px] rounded font-bold transition-colors whitespace-nowrap ${stampScope === 'all' ? 'bg-[var(--color-action)] text-white shadow-sm' : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'}`}
        >
          All Keys
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() =>
            setStampMode(
              true,
              useUIStore.getState().stampImageId,
              'selected',
            )
          }
          variant={stampScope === 'selected' ? 'primary' : 'ghost'}
          size="n"
          className={`px-2 py-1 text-[10px] rounded font-bold transition-colors whitespace-nowrap ${stampScope === 'selected' ? 'bg-[var(--color-action)] text-white shadow-sm' : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'}`}
        >
          Selected Keys
        </ActionButton>
      </div>
      <div className="w-[1px] h-4 bg-[var(--line)]" />
      <label className="text-[10px] font-bold text-[var(--sea-ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          checked={stampSnapToCenter}
          onChange={(e) => setStampSnapToCenter(e.target.checked)}
          className="accent-[var(--color-action)]"
        />
        Snap Center
      </label>
      <div className="w-[1px] h-4 bg-[var(--line)]" />
      <ActionButton
        type="button"
        onClick={() => {
          setStampMode(false)
          setStampHoverInfo(null)
          setEditingLayerId(null)
        }}
        variant="link"
        size="n"
        className="text-[10px] text-[var(--sea-ink-soft)] hover:text-red-500 font-bold uppercase tracking-wider whitespace-nowrap"
      >
        Exit (Esc)
      </ActionButton>
    </div>
  )
}
