import { useState } from 'react'
import { LayersTab } from './LayersTab'
import { ImagesTab } from './ImagesTab'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ActionButton } from '@/components/ActionButton'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

export function RightPanel() {
  const [tab, setTab] = useState<'layers' | 'images'>('layers')
  const { activeProject, updateGlobalSettings } = useProjectStore()
  const { rightPanelOpen } = useUIStore()

  if (!activeProject) {
    return (
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 border-l border-[var(--line)] bg-[var(--surface)] z-10 overflow-hidden ${rightPanelOpen ? 'w-[280px]' : 'w-0 border-l-0'}`}
      >
        <div className="w-[280px] h-full flex flex-col">
          <div className="flex border-b border-[var(--line)] shrink-0 p-2 gap-2">
            <div className="flex-1 h-8 bg-[var(--line)] rounded animate-pulse" />
            <div className="flex-1 h-8 bg-[var(--line)] rounded animate-pulse" />
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4">
            <div className="w-full h-12 bg-[var(--line)] rounded animate-pulse" />
            <div className="w-full h-12 bg-[var(--line)] rounded animate-pulse" />
            <div className="w-full h-12 bg-[var(--line)] rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out shrink-0 border-l border-[var(--line)] bg-[var(--surface)] z-10 overflow-hidden ${rightPanelOpen ? 'w-[280px]' : 'w-0 border-l-0'}`}
    >
      <div className="w-[280px] h-full flex flex-col">
        <LayoutGroup id="right-panel-tabs">
          <div className="flex border-b border-[var(--line)] shrink-0 relative">
            <ActionButton
              type="button"
              onClick={() => setTab('layers')}
              variant="ghost"
              size="n"
              className={`flex-1 py-3 text-xs font-bold transition-colors relative ${tab === 'layers' ? 'text-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)]'}`}
            >
              <span className="relative z-10">Layers</span>
              {tab === 'layers' && (
                <motion.span
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-action)]"
                  transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                />
              )}
            </ActionButton>
            <ActionButton
              type="button"
              onClick={() => setTab('images')}
              variant="ghost"
              size="n"
              className={`flex-1 py-3 text-xs font-bold transition-colors relative ${tab === 'images' ? 'text-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)]'}`}
            >
              <span className="relative z-10">Images Library</span>
              {tab === 'images' && (
                <motion.span
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-action)]"
                  transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                />
              )}
            </ActionButton>
          </div>
        </LayoutGroup>
        <div className="p-4 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              {tab === 'layers' ? <LayersTab /> : <ImagesTab />}
            </motion.div>
          </AnimatePresence>
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
