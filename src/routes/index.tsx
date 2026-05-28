import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { Project } from '../types'
import { ProjectCard } from '../components/browser/ProjectCard'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { v4 as uuidv4 } from 'uuid'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ActionLink } from '@/components/ActionLink'
import {
  useAllProjects,
  useSaveProjectMutation,
  useDeleteProjectMutation,
} from '@/hooks/queries/useProjectQueries'

export const Route = createFileRoute('/')({
  component: ProjectBrowser,
})

function ProjectBrowser() {
  const { data: projects = [], isLoading } = useAllProjects()
  const saveMutation = useSaveProjectMutation()
  const deleteMutation = useDeleteProjectMutation()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleDuplicate(p: Project) {
    const loadingToast = toast.loading('Duplicating project...')
    const newProj = { ...p, id: uuidv4(), name: `${p.name} (Copy)` }
    try {
      await saveMutation.mutateAsync(newProj)
      toast.success(`Duplicated as "${newProj.name}"`, { id: loadingToast })
    } catch {
      toast.error('Failed to duplicate project', { id: loadingToast })
    }
  }

  async function handleRename(id: string, newName: string) {
    const loadingToast = toast.loading('Renaming project...')
    const proj = projects.find((p) => p.id === id)
    if (proj) {
      const updated = {
        ...proj,
        name: newName,
        updatedAt: new Date().toISOString(),
      }
      try {
        await saveMutation.mutateAsync(updated)
        toast.success(`Renamed to "${newName}"`, { id: loadingToast })
      } catch {
        toast.error('Failed to rename project', { id: loadingToast })
      }
    } else {
      toast.dismiss(loadingToast)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 w-full">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--sea-ink)]">
          KeyForge
        </h1>
        <ActionLink to="/new" variant="primary" size="md">
          <Plus className="w-4 h-4" /> New Design
        </ActionLink>
      </div>
      <h2 className="text-lg font-bold mb-6 text-[var(--sea-ink-soft)] uppercase tracking-widest">
        Your Catalog
      </h2>
      {isLoading ? (
        <div className="text-center py-32">
          <p className="text-[var(--sea-ink-soft)]">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 bg-[var(--surface)] border border-[var(--line)] rounded-2xl border-dashed">
          <p className="text-[var(--sea-ink-soft)] mb-4">
            No custom plates forged yet.
          </p>
          <ActionLink to="/new" variant="link" size="n" className="text-lg">
            <Plus className="w-5 h-5" /> Initialize Workspace
          </ActionLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={setDeleteId}
              onDuplicate={handleDuplicate}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project?"
        message="This action cannot be undone. All layout and layer data will be lost."
        confirmText="Delete"
        danger
        onConfirm={async () => {
          if (deleteId) {
            const loadingToast = toast.loading('Deleting project...')
            try {
              await deleteMutation.mutateAsync(deleteId)
              setDeleteId(null)
              toast.success('Project deleted', { id: loadingToast })
            } catch {
              toast.error('Failed to delete project', { id: loadingToast })
            }
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
