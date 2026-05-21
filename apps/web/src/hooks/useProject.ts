import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api/projects'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { localStorageAdapter } from '@/lib/storage/local-storage-adapter'
import { useAuth } from '@/hooks/useAuth'
import type {
  CharacterInput,
  LocationInput,
  ProjectSettingsInput,
  SceneInput,
} from '@/lib/types'

export function useProject(projectId: string) {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['project', projectId]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!isSupabaseConfigured) return localStorageAdapter.fetchProject(projectId)
      return api.fetchProject(projectId)
    },
    enabled: Boolean(projectId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey })
    queryClient.invalidateQueries({ queryKey: ['projects', userId] })
  }

  const updateSettings = useMutation({
    mutationFn: (settings: ProjectSettingsInput) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.updateProjectSettings(projectId, settings)
        return Promise.resolve()
      }
      return api.updateProjectSettings(projectId, settings)
    },
    onSuccess: invalidate,
  })

  const saveScene = useMutation({
    mutationFn: (input: SceneInput & { id?: string }) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.upsertScene(projectId, input)
        return Promise.resolve()
      }
      return api.upsertScene(projectId, input)
    },
    onSuccess: invalidate,
  })

  const deleteScene = useMutation({
    mutationFn: (sceneId: string) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.deleteScene(projectId, sceneId)
        return Promise.resolve()
      }
      return api.deleteScene(projectId, sceneId)
    },
    onSuccess: invalidate,
  })

  const reorderScenes = useMutation({
    mutationFn: (orderedIds: string[]) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.reorderScenes(projectId, orderedIds)
        return Promise.resolve()
      }
      return api.reorderScenes(projectId, orderedIds)
    },
    onSuccess: invalidate,
  })

  const saveCharacter = useMutation({
    mutationFn: (input: CharacterInput & { id?: string }) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.upsertCharacter(projectId, input)
        return Promise.resolve()
      }
      return api.upsertCharacter(projectId, input)
    },
    onSuccess: invalidate,
  })

  const deleteCharacter = useMutation({
    mutationFn: (characterId: string) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.deleteCharacter(projectId, characterId)
        return Promise.resolve()
      }
      return api.deleteCharacter(projectId, characterId)
    },
    onSuccess: invalidate,
  })

  const saveLocation = useMutation({
    mutationFn: (input: LocationInput & { id?: string }) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.upsertLocation(projectId, input)
        return Promise.resolve()
      }
      return api.upsertLocation(projectId, input)
    },
    onSuccess: invalidate,
  })

  const deleteLocation = useMutation({
    mutationFn: (locationId: string) => {
      if (!isSupabaseConfigured) {
        localStorageAdapter.deleteLocation(projectId, locationId)
        return Promise.resolve()
      }
      return api.deleteLocation(projectId, locationId)
    },
    onSuccess: invalidate,
  })

  return {
    project: query.data ?? null,
    isLoading: query.isLoading,
    updateSettings: updateSettings.mutateAsync,
    saveScene: saveScene.mutateAsync,
    deleteScene: deleteScene.mutateAsync,
    reorderScenes: reorderScenes.mutateAsync,
    saveCharacter: saveCharacter.mutateAsync,
    deleteCharacter: deleteCharacter.mutateAsync,
    saveLocation: saveLocation.mutateAsync,
    deleteLocation: deleteLocation.mutateAsync,
  }
}
