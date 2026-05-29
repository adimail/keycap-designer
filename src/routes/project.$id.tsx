import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
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
  const { setActiveProject } = useProjectStore()

  useEffect(() => {
    async function load() {
      try {
        const proj = await getProject(id)
        if (proj) {
          setActiveProject(proj)
        }
      } catch {
        toast.error('Failed to load project')
      }
    }
    load()
  }, [id, setActiveProject])

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
