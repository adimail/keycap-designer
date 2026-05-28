import { createFileRoute } from '@tanstack/react-router'
import { StudioView } from '../components/studio/StudioView'
import { getProject } from '../lib/db'
import { useProjectStore } from '../store/useProjectStore'
import { useEffect } from 'react'

export const Route = createFileRoute('/studio/$id')({
  validateSearch: (search: Record<string, unknown>) => ({
    keyId: (search.keyId as string) || null,
  }),
  loader: async ({ params: { id } }) => {
    const project = await getProject(id)
    if (!project) throw new Error('Project not found')
    return project
  },
  component: StudioRoute,
})

function StudioRoute() {
  const project = Route.useLoaderData()
  const { keyId } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setActiveProject } = useProjectStore()

  useEffect(() => {
    setActiveProject(project)
  }, [project.id])

  const handleKeyIdChange = (newKeyId: string | null) => {
    navigate({
      search: (prev) => ({ ...prev, keyId: newKeyId }),
      replace: true,
    })
  }

  return <StudioView initialKeyId={keyId} onKeyIdChange={handleKeyIdChange} />
}
