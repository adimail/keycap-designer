import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllProjects, getProject, saveProject, deleteProject } from '@/lib/db'
import { toast } from 'sonner'

const PROJECT_QUERY_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: unknown) =>
    [...PROJECT_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROJECT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROJECT_QUERY_KEYS.details(), id] as const,
} as const

export function useAllProjects() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.list(),
    queryFn: async () => {
      const data = await getAllProjects()
      return data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    },
  })
}

export function useProject(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? PROJECT_QUERY_KEYS.detail(id) : ['projects', 'null'],
    queryFn: () => {
      if (!id) return Promise.reject(new Error('No ID provided'))
      return getProject(id)
    },
    enabled: !!id,
  })
}

export function useSaveProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.lists() })
      queryClient.setQueryData(
        PROJECT_QUERY_KEYS.detail(variables.id),
        variables,
      )
    },
    onError: () => {
      toast.error('Failed to save project')
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.lists() })
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })
}
