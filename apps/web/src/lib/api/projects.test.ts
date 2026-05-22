import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Project } from '@/lib/types'

const mockFrom = vi.fn()
const mockSupabase = { from: mockFrom }

vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
  isSupabaseConfigured: true,
}))

function chain(resolved: { data?: unknown; error?: unknown }) {
  const result = Promise.resolve(resolved)
  const builder: Record<string, unknown> = {
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  }
  for (const method of [
    'select',
    'eq',
    'in',
    'order',
    'insert',
    'update',
    'delete',
    'single',
    'maybeSingle',
  ]) {
    builder[method] = () => builder
  }
  return builder
}

function tableRouter(handlers: Record<string, () => unknown>) {
  return vi.fn((table: string) => {
    const handler = handlers[table]
    if (!handler) throw new Error(`Unexpected table: ${table}`)
    return handler()
  })
}

describe('projects API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrom.mockReset()
  })

  it('fetchProject returns null when project is missing', async () => {
    mockFrom.mockImplementation(
      tableRouter({
        projects: () => chain({ data: null, error: null }),
      }),
    )

    const { fetchProject } = await import('@/lib/api/projects')
    await expect(fetchProject('missing')).resolves.toBeNull()
  })

  it('fetchProject assembles scenes with scene_characters', async () => {
    const project: Project = {
      id: 'p1',
      user_id: 'u1',
      title: 'Story',
      genre: '',
      synopsis: '',
      target_word_count: null,
      created_at: '',
      updated_at: '',
    }

    mockFrom.mockImplementation(
      tableRouter({
        projects: () => chain({ data: project, error: null }),
        characters: () => chain({ data: [], error: null }),
        locations: () => chain({ data: [], error: null }),
        scenes: () =>
          chain({
            data: [
              {
                id: 's1',
                project_id: 'p1',
                title: 'Opening',
                summary: '',
                location_id: null,
                word_count: 100,
                sort_order: 0,
                pov_character_id: null,
              },
            ],
            error: null,
          }),
        scene_characters: () =>
          chain({
            data: [{ scene_id: 's1', character_id: 'c1' }],
            error: null,
          }),
        character_arcs: () => chain({ data: [], error: null }),
        arc_beats: () => chain({ data: [], error: null }),
        scene_arc_events: () => chain({ data: [], error: null }),
      }),
    )

    const { fetchProject } = await import('@/lib/api/projects')
    const result = await fetchProject('p1')
    expect(result?.scenes[0].character_ids).toEqual(['c1'])
    expect(result?.scenes[0].arc_events).toEqual([])
    expect(result?.characters[0]?.arc).toBeNull()
  })

  it('createProject inserts and returns empty relations', async () => {
    const created: Project = {
      id: 'p-new',
      user_id: 'u1',
      title: 'New',
      genre: 'Fantasy',
      synopsis: '',
      target_word_count: null,
      created_at: '',
      updated_at: '',
    }

    mockFrom.mockImplementation(
      tableRouter({
        projects: () => chain({ data: created, error: null }),
      }),
    )

    const { createProject } = await import('@/lib/api/projects')
    const result = await createProject('u1', { title: 'New', genre: 'Fantasy' })
    expect(result).toMatchObject({
      id: 'p-new',
      characters: [],
      locations: [],
      scenes: [],
    })
  })

  it('upsertScene updates scene and replaces scene_characters and arc events', async () => {
    const updateEq = vi.fn().mockResolvedValue({ error: null })
    const deleteEq = vi.fn().mockResolvedValue({ error: null })
    const insert = vi.fn().mockResolvedValue({ error: null })
    const eventsDeleteEq = vi.fn().mockResolvedValue({ error: null })
    const eventsInsert = vi.fn().mockResolvedValue({ error: null })
    const touchUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) })

    mockFrom.mockImplementation((table: string) => {
      if (table === 'scenes') {
        return {
          update: vi.fn().mockReturnValue({ eq: updateEq }),
        }
      }
      if (table === 'scene_characters') {
        return {
          delete: vi.fn().mockReturnValue({ eq: deleteEq }),
          insert,
        }
      }
      if (table === 'scene_arc_events') {
        return {
          delete: vi.fn().mockReturnValue({ eq: eventsDeleteEq }),
          insert: eventsInsert,
        }
      }
      if (table === 'projects') {
        return { update: touchUpdate }
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const { upsertScene } = await import('@/lib/api/projects')
    await upsertScene('p1', {
      id: 's1',
      title: 'Updated',
      summary: 'Summary',
      location_id: null,
      word_count: 200,
      character_ids: ['c1', 'c2'],
      pov_character_id: 'c1',
      arc_events: [
        { character_id: 'c1', beat_id: 'b1', note: '', sort_order: 0 },
      ],
    })

    expect(updateEq).toHaveBeenCalledWith('id', 's1')
    expect(deleteEq).toHaveBeenCalledWith('scene_id', 's1')
    expect(insert).toHaveBeenCalledWith([
      { scene_id: 's1', character_id: 'c1' },
      { scene_id: 's1', character_id: 'c2' },
    ])
    expect(eventsDeleteEq).toHaveBeenCalledWith('scene_id', 's1')
    expect(eventsInsert).toHaveBeenCalledWith([
      {
        scene_id: 's1',
        character_id: 'c1',
        beat_id: 'b1',
        note: '',
        sort_order: 0,
      },
    ])
  })
})
