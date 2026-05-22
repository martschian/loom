import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProject } from '@/hooks/useProject'
import { localStorageAdapter } from '@/lib/storage/local-storage-adapter'

vi.mock('@/lib/supabase/client', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ userId: 'local-user' }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useProject', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads a project by id', async () => {
    const projectId = localStorageAdapter.fetchProjects()[0].id
    const { result } = renderHook(() => useProject(projectId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.project).not.toBeNull())
    expect(result.current.project?.id).toBe(projectId)
  })

  it('saveScene updates project data after mutation', async () => {
    const projectId = localStorageAdapter.fetchProjects()[0].id
    const { result } = renderHook(() => useProject(projectId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.project).not.toBeNull())

    await result.current.saveScene({
      title: 'Hook Scene',
      summary: '',
      location_id: null,
      mood: '',
      word_count: 50,
      character_ids: [],
      pov_character_id: null,
    })

    await waitFor(() =>
      expect(
        result.current.project?.scenes.some((s) => s.title === 'Hook Scene'),
      ).toBe(true),
    )
  })
})
