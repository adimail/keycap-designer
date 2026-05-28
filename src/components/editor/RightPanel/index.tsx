import { useState } from 'react'
import { LayersTab } from './LayersTab'
import { ImagesTab } from './ImagesTab'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ActionButton } from '@/components/ActionButton'

export function RightPanel() {
  const [tab, setTab] = useState<'layers' | 'images'>('layers')
  const { activeProject, updateGlobalSettings } = useProjectStore()
  const { rightPanelOpen } = useUIStore()

  if (!activeProject) return null

  return (
    <div
      className={`transition-all duration-300 ease-in-out shrink-0 border-l border-[var(--line)] bg-[var(--surface)] z-10 overflow-hidden ${rightPanelOpen ? 'w-[280px]' : 'w-0 border-l-0'}`}
    >
      <div className="w-[280px] h-full flex flex-col">
        <div className="flex border-b border-[var(--line)] shrink-0">
          <ActionButton
            type="button"
            onClick={() => setTab('layers')}
            variant="ghost"
            size="n"
            className={`flex-1 py-3 text-xs font-bold transition-colors ${tab === 'layers' ? 'text-[var(--color-action)] border-b-2 border-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)]'}`}
          >
            Layers
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => setTab('images')}
            variant="ghost"
            size="n"
            className={`flex-1 py-3 text-xs font-bold transition-colors ${tab === 'images' ? 'text-[var(--color-action)] border-b-2 border-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)]'}`}
          >
            Images Library
          </ActionButton>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {tab === 'layers' ? <LayersTab /> : <ImagesTab />}
        </div>
        <div className="sticky bottom-0 shrink-0 border-t border-[var(--line)] bg-[var(--surface)] p-4">
          <label className="block text-[10px] font-bold mb-1.5 text-[var(--sea-ink-soft)] uppercase">
            Project Finish
          </label>
          <SegmentedControl
            options={[
              { label: 'Matte', value: 'matte' },
              { label: 'Glossy', value: 'glossy' },
              { label: 'Clear', value: 'transparent' },
            ]}
            value={activeProject.globalSettings.finish}
            onChange={(v) => updateGlobalSettings({ finish: v })}
          />
        </div>
      </div>
    </div>
  )
}
