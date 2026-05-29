import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Cloud, PanelLeft, PanelRight, Aperture } from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { useState } from 'react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { toast } from 'sonner'
import { ActionButton } from '@/components/ActionButton'
import { ActionLink } from '@/components/ActionLink'
import { LayoutGroup, motion } from 'framer-motion'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut'
import { LAYOUT_OPTIONS } from '#/lib/constants'

export function TopBar() {
  const navigate = useNavigate()
  const {
    activeProject,
    saveCurrentProject,
    updateProjectName,
    hasUnsavedChanges,
    changeLayout,
  } = useProjectStore()
  const { leftPanelOpen, rightPanelOpen, toggleLeftPanel, toggleRightPanel } =
    useUIStore()

  const [isSaving, setIsSaving] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    onConfirm: () => void
    danger?: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: () => {},
  })

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }))

  useBeforeUnload(hasUnsavedChanges)

  const handleSave = async () => {
    setIsSaving(true)
    toast.promise(saveCurrentProject(), {
      loading: 'Saving project to local database...',
      success: () => {
        setIsSaving(false)
        return `Project "${activeProject?.name}" saved successfully`
      },
      error: () => {
        setIsSaving(false)
        return 'Failed to save project'
      },
    })
  }

  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      callback: () => handleSave(),
    },
    {
      key: 's',
      metaKey: true,
      callback: () => handleSave(),
    },
  ])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate({ to: '/' })
  }

  const handleLayoutRequest = (newLayout: string) => {
    if (newLayout === activeProject?.layout) return

    setModalConfig({
      isOpen: true,
      title: 'Switch Layout?',
      message:
        'Switching layouts will reset key visibility and sizing overrides. Your colors and legends will be preserved where possible.',
      confirmText: 'Switch Layout',
      danger: false,
      onConfirm: () => {
        changeLayout(newLayout)
        closeModal()
      },
    })
  }

  if (!activeProject) {
    return (
      <div className="h-12 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-[1px] h-4 bg-[var(--line)] mx-1 hidden lg:block" />
          <div className="w-32 h-5 bg-[var(--line)] rounded animate-pulse" />
        </div>
        <div className="hidden md:flex items-center gap-1">
          <div className="w-64 h-8 bg-[var(--line)] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-8 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-20 h-8 bg-[var(--line)] rounded animate-pulse" />
          <div className="w-[1px] h-4 bg-[var(--line)] mx-1 hidden lg:block" />
          <div className="w-8 h-8 bg-[var(--line)] rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-12 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <ActionButton
          type="button"
          onClick={handleBack}
          variant="ghost"
          size="n"
          className="p-1 text-[var(--sea-ink-soft)] hover:text-[var(--color-action)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          type="button"
          onClick={toggleLeftPanel}
          variant="ghost"
          size="n"
          className={`p-1.5 rounded transition-colors hidden lg:flex ${leftPanelOpen ? 'bg-[var(--line)] text-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)] hover:text-[var(--sea-ink)]'}`}
        >
          <PanelLeft className="w-4 h-4" />
        </ActionButton>
        <div className="w-[1px] h-4 bg-[var(--line)] mx-1 hidden lg:block" />
        <div className="text-sm font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <span className="text-[var(--sea-ink-soft)] hidden sm:inline">
            KeyForge /
          </span>
          {isEditingName ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => {
                updateProjectName(tempName || 'Untitled')
                setIsEditingName(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateProjectName(tempName || 'Untitled')
                  setIsEditingName(false)
                }
              }}
              className="bg-transparent border-b border-[var(--color-action)] outline-none px-1 w-32 sm:w-auto"
            />
          ) : (
            <span
              onClick={() => {
                setTempName(activeProject.name)
                setIsEditingName(true)
              }}
              className="cursor-pointer hover:text-[var(--color-action)] truncate max-w-[150px] sm:max-w-[300px]"
            >
              {activeProject.name}{' '}
              {hasUnsavedChanges && (
                <span className="text-[var(--color-action)]">*</span>
              )}
            </span>
          )}
        </div>
      </div>

      <LayoutGroup id="editor-layout-options">
        <div className="hidden md:flex items-center rounded-md bg-[var(--line)] p-1 gap-1">
          {LAYOUT_OPTIONS.map((option) => (
            <ActionButton
              type="button"
              key={option.value}
              onClick={() => handleLayoutRequest(option.value)}
              variant="ghost"
              size="n"
              className={`relative isolate min-w-10 overflow-hidden px-2 py-1 rounded text-xs font-bold transition-colors ${
                activeProject.layout === option.value
                  ? 'text-[var(--sea-ink)] shadow-sm'
                  : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
              }`}
            >
              {activeProject.layout === option.value && (
                <motion.span
                  layoutId="active-editor-layout"
                  className="absolute inset-0 -z-10 rounded bg-white dark:bg-zinc-700"
                  transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </ActionButton>
          ))}
        </div>
      </LayoutGroup>

      <div className="flex items-center gap-3">
        <ActionButton
          type="button"
          onClick={handleSave}
          variant="primary"
          size="sm"
        >
          <Cloud className="h-3.5 w-3.5" />
          {isSaving ? 'Saving...' : 'Save'}
        </ActionButton>
        <ActionLink
          to="/studio/$id"
          params={{ id: activeProject.id }}
          variant="outline"
          size="sm"
        >
          <Aperture className="h-3.5 w-3.5" />
          Studio
        </ActionLink>
        <div className="w-[1px] h-4 bg-[var(--line)] mx-1 hidden lg:block" />
        <ActionButton
          type="button"
          onClick={toggleRightPanel}
          variant="ghost"
          size="n"
          className={`p-1.5 rounded transition-colors hidden lg:flex ${rightPanelOpen ? 'bg-[var(--line)] text-[var(--color-action)]' : 'text-[var(--sea-ink-soft)] hover:bg-[var(--line)] hover:text-[var(--sea-ink)]'}`}
        >
          <PanelRight className="w-4 h-4" />
        </ActionButton>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        danger={modalConfig.danger}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </div>
  )
}
