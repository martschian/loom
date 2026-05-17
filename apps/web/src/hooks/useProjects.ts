import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api/projects'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { localStorageAdapter } from '@/lib/storage/local-storage-adapter'
import { useAuth } from '@/hooks/useAuth'
import type { NewProjectInput, ProjectWithRelations } from '@/lib/types'

export function useProjects() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['projects', userId],
    queryFn: async (): Promise<ProjectWithRelations[]> => {
      if (!userId) return []
      if (!isSupabaseConfigured) return localStorageAdapter.fetchProjects()
      return api.fetchProjects(userId)
    },
    enabled: Boolean(userId),
  })

  const createMutation = useMutation({
    mutationFn: async (input: NewProjectInput) => {
      if (!userId) throw new Error('Not authenticated')
      if (!isSupabaseConfigured) return localStorageAdapter.createProject(input)
      return api.createProject(userId, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
    },
  })

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProject: createMutation.mutateAsync,
  }
}
