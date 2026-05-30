import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { saveProject } from '@/lib/db'
import { getLayoutKeys } from '@/lib/layouts'
import type { Project } from '@/types'
import { toast } from 'sonner'

export const Route = createFileRoute('/new')({
  component: NewProjectRoute,
})

function NewProjectRoute() {
  const navigate = useNavigate()

  useEffect(() => {
    async function createProject() {
      const loadingToast = toast.loading('Forging new workspace...')
      const newId = uuidv4()
      const project: Project = {
        id: newId,
        name: 'Untitled Design',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '',
        layout: '60%',
        keys: getLayoutKeys('60%'),
        images: [],
        globalSettings: {
          caseColor: '#173a40',
          caseMaterial: 'aluminum',
          profile: 'Cherry',
          finish: 'matte',
          caseStyle: 'none',
        },
      }
      await saveProject(project)
      toast.success('Workspace ready', { id: loadingToast })
      navigate({ to: '/project/$id', params: { id: newId } })
    }
    createProject()
  }, [navigate])

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center bg-[var(--bg-base)]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-action)] border-t-transparent mb-6" />
      <p className="text-sm font-bold uppercase tracking-widest text-[var(--sea-ink)]">
        Forging standard layout plate...
      </p>
    </div>
  )
}
