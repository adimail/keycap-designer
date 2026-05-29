import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { KeyPropertyEditor } from './KeyPropertyEditor'
import { QuickSelect } from './QuickSelect'
import { ActionButton } from '@/components/ActionButton'
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion'
import { PROFILE_OPTIONS } from '@/lib/constants'

export function LeftPanel() {
  const { selectedKeyIds, activeProject, updateGlobalSettings } =
    useProjectStore()
  const { leftPanelOpen } = useUIStore()

  if (!activeProject) {
    return (
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 border-r border-[var(--line)] bg-[var(--surface)] z-10 overflow-hidden ${leftPanelOpen ? 'w-[260px]' : 'w-0 border-r-0'}`}
      >
        <div className="w-[260px] h-full p-4 flex flex-col gap-6">
          <div className="w-24 h-4 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-full h-20 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-24 h-4 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-full h-32 bg-[var(--line)] rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out shrink-0 border-r border-[var(--line)] bg-[var(--surface)] z-10 overflow-hidden ${leftPanelOpen ? 'w-[260px]' : 'w-0 border-r-0'}`}
    >
      <div className="w-[260px] h-full overflow-y-auto p-4 flex flex-col">
        <div className="flex flex-col gap-4 pb-6 border-b border-[var(--line)] mb-4">
          <h3 className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-wider">
            Global Config
          </h3>
          <div>
            <label className="block text-[10px] font-bold mb-1.5 text-[var(--sea-ink-soft)] uppercase">
              Project Profile
            </label>
            <LayoutGroup id="project-profile-options">
              <div className="grid grid-cols-2 gap-2">
                {PROFILE_OPTIONS.map((option) => {
                  const isActive =
                    activeProject.globalSettings.profile === option.value

                  return (
                    <ActionButton
                      type="button"
                      key={option.value}
                      onClick={() =>
                        updateGlobalSettings({ profile: option.value })
                      }
                      variant="ghost"
                      size="sm"
                      className={`relative isolate w-full overflow-hidden border ${
                        isActive
                          ? 'border-transparent text-white shadow-md'
                          : 'border-[var(--color-ledger)] bg-white/50 text-[var(--color-ink)] hover:border-[var(--color-action)] hover:text-[var(--color-action)] dark:bg-black/20'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-project-profile"
                          className="absolute inset-0 -z-10 rounded bg-[var(--color-action)]"
                          transition={{
                            type: 'spring',
                            stiffness: 520,
                            damping: 38,
                          }}
                        />
                      )}
                      <span className="relative z-10">{option.label}</span>
                    </ActionButton>
                  )
                })}
              </div>
            </LayoutGroup>
          </div>
        </div>

        <QuickSelect />

        <AnimatePresence mode="wait">
          {selectedKeyIds.length === 0 ? (
            <motion.div
              key="empty"
              className="flex-1 flex items-center justify-center text-center p-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <p className="text-xs text-[var(--sea-ink-soft)] italic">
                Click a key in the 3D view or select a group to edit colors and
                legends.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <div className="text-sm font-bold text-[var(--sea-ink)] mb-2 uppercase tracking-tight">
                Selected: {selectedKeyIds.length} Keys
              </div>
              <KeyPropertyEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
