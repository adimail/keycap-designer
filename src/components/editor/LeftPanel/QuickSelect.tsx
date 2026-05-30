import { useProjectStore } from '@/store/useProjectStore'
import { cn } from '@/utils/cn'
import { ActionButton } from '@/components/ActionButton'
import { getLayoutKeys } from '@/lib/layouts'

export function QuickSelect() {
  const { activeProject, selectedKeyIds, setSelectedKeys } = useProjectStore()

  if (!activeProject) return null

  const originalKeys = getLayoutKeys(activeProject.layout)

  const getOrigLabel = (k: any) => {
    const orig = originalKeys.find((ok) => ok.id === k.id)
    return orig?.label || k.label || ''
  }

  const GROUPS = [
    { name: 'All', match: () => true },
    {
      name: 'Alphas',
      match: (k: any) => /^[a-zA-Z]$/.test(getOrigLabel(k)),
    },
    {
      name: 'Numbers',
      match: (k: any) => /^[0-9]$/.test(getOrigLabel(k)),
    },
    {
      name: 'F-Keys',
      match: (k: any) => /^F[1-9]$|^F1[0-2]$/i.test(getOrigLabel(k)),
    },
    {
      name: 'Mods',
      match: (k: any) => {
        const lbl = String(getOrigLabel(k)).toUpperCase()
        return [
          'SHIFT',
          'CTRL',
          'CONTROL',
          'WIN',
          'ALT',
          'FN',
          'MENU',
          'CAPS',
          'CAPSLOCK',
          'CMD',
          'COMMAND',
          'OPT',
          'OPTION',
          'SUPER',
          'META',
        ].includes(lbl)
      },
    },
    {
      name: 'Nav',
      match: (k: any) => {
        const lbl = String(getOrigLabel(k)).toUpperCase()
        return [
          'UP',
          'DOWN',
          'LEFT',
          'RIGHT',
          'HM',
          'HOME',
          'PU',
          'PAGEUP',
          'PGUP',
          'PD',
          'PAGEDOWN',
          'PGDN',
          'END',
          'DEL',
          'DELETE',
          'INS',
          'INSERT',
          'PRT',
          'PRINT',
          'SCR',
          'SCROLL',
          'PAU',
          'PAUSE',
          'ARROW',
        ].includes(lbl)
      },
    },
  ]

  const toggleGroup = (matchFn: (k: any) => boolean) => {
    const groupKeys = activeProject.keys
      .filter((k) => k.visible && matchFn(k))
      .map((k) => k.id)

    if (groupKeys.length === 0) return

    const isFullySelected = groupKeys.every((id) => selectedKeyIds.includes(id))

    if (isFullySelected) {
      setSelectedKeys(selectedKeyIds.filter((id) => !groupKeys.includes(id)))
    } else {
      const newSet = new Set([...selectedKeyIds, ...groupKeys])
      setSelectedKeys(Array.from(newSet))
    }
  }

  return (
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--line)] mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-wider">
          Quick Select
        </h3>
        {selectedKeyIds.length > 0 && (
          <ActionButton
            type="button"
            onClick={() => setSelectedKeys([])}
            variant="link"
            size="n"
            className="text-[10px] text-red-500"
          >
            Clear
          </ActionButton>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {GROUPS.map((g) => {
          const groupKeys = activeProject.keys
            .filter((k) => k.visible && g.match(k))
            .map((k) => k.id)

          const isFullySelected =
            groupKeys.length > 0 &&
            groupKeys.every((id) => selectedKeyIds.includes(id))

          return (
            <ActionButton
              type="button"
              key={g.name}
              onClick={() => toggleGroup(g.match)}
              variant={isFullySelected ? 'primary' : 'outline'}
              size="n"
              className={cn(
                'px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors',
                g.name === 'All' && 'col-span-2',
                isFullySelected
                  ? 'border-[var(--color-action)] bg-[var(--color-action)] text-white'
                  : 'border-[var(--line)] text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--line)] bg-[var(--surface)]',
              )}
            >
              {g.name}
            </ActionButton>
          )
        })}
      </div>
    </div>
  )
}
