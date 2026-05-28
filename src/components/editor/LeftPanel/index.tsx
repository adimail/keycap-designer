import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { KeyPropertyEditor } from './KeyPropertyEditor'
import { QuickSelect } from './QuickSelect'
import { ActionButton } from '@/components/ActionButton'
import { LayoutGroup, motion } from 'framer-motion'

const profileOptions = [
  { label: 'Cherry', value: 'Cherry' },
  { label: 'OEM', value: 'OEM' },
  { label: 'SA', value: 'SA' },
  { label: 'DSA', value: 'DSA' },
  { label: 'XDA', value: 'XDA' },
] as const

export function LeftPanel() {
  const { selectedKeyIds, activeProject, updateGlobalSettings } = useProjectStore()
  const { leftPanelOpen } = useUIStore()

  if (!activeProject) return null

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
                {profileOptions.map((option) => {
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

        {selectedKeyIds.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <p className="text-xs text-[var(--sea-ink-soft)] italic">
              Click a key in the 3D view or select a group to edit colors and
              legends.
            </p>
          </div>
        ) : (
          <>
            <div className="text-sm font-bold text-[var(--sea-ink)] mb-2 uppercase tracking-tight">
              Selected: {selectedKeyIds.length} Keys
            </div>
            <KeyPropertyEditor />
          </>
        )}
      </div>
    </div>
  )
}
