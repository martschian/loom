import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useProjects } from '@/hooks/useProjects'

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

describe('useProjects', () => {
  it('loads projects from local storage', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.projects.some((p) => p.title === 'The Ember Coast')).toBe(
      true,
    )
  })

  it('createProject persists a new project', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const before = result.current.projects.length

    await result.current.createProject({ title: 'Hook Story', genre: 'Mystery' })

    await waitFor(() =>
      expect(result.current.projects.length).toBe(before + 1),
    )
    expect(
      result.current.projects.some((p) => p.title === 'Hook Story'),
    ).toBe(true)
  })
})
