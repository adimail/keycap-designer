import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { TopBar } from '../components/editor/TopBar'
import { LeftPanel } from '../components/editor/LeftPanel'
import { RightPanel } from '../components/editor/RightPanel'
import { Viewport3D } from '../components/editor/Viewport3D'
import { getProject } from '../lib/db'
import { useProjectStore } from '../store/useProjectStore'
import { toast } from 'sonner'

export const Route = createFileRoute('/project/$id')({
  component: EditorRoute,
})

function EditorRoute() {
  const { id } = Route.useParams()
  const { setActiveProject, activeProject } = useProjectStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const loadingToast = toast.loading('Loading workspace...')
      try {
        const proj = await getProject(id)
        if (proj) {
          setActiveProject(proj)
          toast.success(`Loaded "${proj.name}"`, { id: loadingToast })
        } else {
          toast.error('Project not found', { id: loadingToast })
        }
      } catch {
        toast.error('Failed to load project', { id: loadingToast })
      }
      setLoading(false)
    }
    load()
  }, [id, setActiveProject])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">
        Mounting Workspace...
      </div>
    )
  if (!activeProject && !loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Project not found.
      </div>
    )

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel />
        <Viewport3D />
        <RightPanel />
      </div>
    </div>
  )
}
