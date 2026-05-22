import { describe, expect, it, vi } from 'vitest'
import { localStorageAdapter } from '@/lib/storage/local-storage-adapter'

describe('localStorageAdapter', () => {
  it('backfills missing fields when loading old-schema localStorage data', () => {
    // Simulate pre-migration data written without the new character fields
    const legacyStore = {
      profile: { id: 'local-user', display_name: 'Old Writer', created_at: '' },
      projects: [
        {
          id: 'p-old',
          user_id: 'local-user',
          title: 'Old Project',
          genre: '',
          synopsis: '',
          target_word_count: null,
          created_at: '',
          updated_at: '',
          characters: [
            {
              id: 'c-old',
              project_id: 'p-old',
              name: 'Legacy Hero',
              role: 'Protagonist',
              color: '#7c3aed',
              summary: 'Existed before migration',
              // age, pronouns, relationships, traits intentionally absent
            },
          ],
          locations: [],
          scenes: [],
        },
      ],
    }
    localStorage.setItem('loom_data', JSON.stringify(legacyStore))

    const project = localStorageAdapter.fetchProject('p-old')!
    const character = project.characters[0]
    expect(character.traits).toEqual([])
    expect(character.age).toBe('')
    expect(character.pronouns).toBe('')
    expect(character.relationships).toBe('')
  })

  it('backfills missing pov_character_id on legacy scenes', () => {
    const legacyStore = {
      profile: { id: 'local-user', display_name: 'Writer', created_at: '' },
      projects: [
        {
          id: 'p-old',
          user_id: 'local-user',
          title: 'Old Project',
          genre: '',
          synopsis: '',
          target_word_count: null,
          created_at: '',
          updated_at: '',
          characters: [],
          locations: [],
          scenes: [
            {
              id: 's-old',
              project_id: 'p-old',
              title: 'Legacy Scene',
              summary: '',
              location_id: null,
              mood: '',
              word_count: 0,
              sort_order: 0,
              character_ids: [],
            },
          ],
        },
      ],
    }
    localStorage.setItem('loom_data', JSON.stringify(legacyStore))

    const scene = localStorageAdapter.fetchProject('p-old')!.scenes[0]
    expect(scene.pov_character_id).toBeNull()
  })

  it('falls back to default store when localStorage JSON is corrupt', () => {
    localStorage.setItem('loom_data', '{not valid json')
    const projects = localStorageAdapter.fetchProjects()
    expect(projects[0].title).toBe('The Ember Coast')
  })

  it('returns null for unknown project id', () => {
    expect(localStorageAdapter.fetchProject('missing-id')).toBeNull()
  })

  it('returns default demo project when store is empty', () => {
    const projects = localStorageAdapter.fetchProjects()
    expect(projects.length).toBeGreaterThan(0)
    expect(projects[0].title).toBe('The Ember Coast')
  })

  it('returns profile', () => {
    expect(localStorageAdapter.getProfile().display_name).toBe('Local Writer')
  })

  it('updates profile', () => {
    localStorageAdapter.updateProfile('Pen Name')
    expect(localStorageAdapter.getProfile().display_name).toBe('Pen Name')
  })

  it('creates a new project', () => {
    const before = localStorageAdapter.fetchProjects().length
    const project = localStorageAdapter.createProject({
      title: 'New Story',
      genre: 'Sci-Fi',
    })
    expect(project.title).toBe('New Story')
    expect(localStorageAdapter.fetchProjects().length).toBe(before + 1)
    expect(localStorageAdapter.fetchProject(project.id)?.title).toBe('New Story')
  })

  it('updates project settings', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    localStorageAdapter.updateProjectSettings(project.id, {
      title: 'Renamed',
      genre: 'Drama',
      synopsis: 'Updated',
      target_word_count: 50000,
    })
    const updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.title).toBe('Renamed')
    expect(updated.target_word_count).toBe(50000)
  })

  it('upserts and deletes a scene', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    localStorageAdapter.upsertScene(project.id, {
      title: 'Test Scene',
      summary: 'Summary',
      location_id: null,
      mood: '',
      word_count: 100,
      character_ids: [],
      pov_character_id: null,
    })
    const updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.scenes.some((s) => s.title === 'Test Scene')).toBe(true)

    const scene = updated.scenes.find((s) => s.title === 'Test Scene')!
    localStorageAdapter.upsertScene(project.id, {
      id: scene.id,
      title: 'Updated Scene',
      summary: 'New summary',
      location_id: null,
      mood: 'Tense',
      word_count: 200,
      character_ids: [],
      pov_character_id: null,
    })
    const afterUpdate = localStorageAdapter.fetchProject(project.id)!
    expect(afterUpdate.scenes.find((s) => s.id === scene.id)?.title).toBe(
      'Updated Scene',
    )

    localStorageAdapter.deleteScene(project.id, scene.id)
    const afterDelete = localStorageAdapter.fetchProject(project.id)!
    expect(afterDelete.scenes.some((s) => s.id === scene.id)).toBe(false)
  })

  it('upserts and deletes characters', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    const baseChar = { role: 'Protagonist', color: '#7c3aed', summary: 'Main character', age: '', pronouns: 'she/her', relationships: '', traits: ['brave'] }
    localStorageAdapter.upsertCharacter(project.id, { name: 'Hero', ...baseChar })
    let updated = localStorageAdapter.fetchProject(project.id)!
    const character = updated.characters.find((c) => c.name === 'Hero')!
    expect(character).toBeDefined()

    localStorageAdapter.upsertCharacter(project.id, {
      id: character.id,
      name: 'Hero Updated',
      role: 'Protagonist',
      color: '#7c3aed',
      summary: 'Updated',
      age: '',
      pronouns: 'she/her',
      relationships: '',
      traits: ['brave', 'cunning'],
    })
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.characters.find((c) => c.id === character.id)?.name).toBe(
      'Hero Updated',
    )

    localStorageAdapter.deleteCharacter(project.id, character.id)
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.characters.some((c) => c.id === character.id)).toBe(false)
  })

  it('removes deleted character ids from scene character_ids', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    const baseChar = {
      role: 'Protagonist',
      color: '#7c3aed',
      summary: '',
      age: '',
      pronouns: '',
      relationships: '',
      traits: [] as string[],
    }
    localStorageAdapter.upsertCharacter(project.id, { name: 'Linked', ...baseChar })
    let updated = localStorageAdapter.fetchProject(project.id)!
    const character = updated.characters.find((c) => c.name === 'Linked')!

    localStorageAdapter.upsertScene(project.id, {
      title: 'Linked Scene',
      summary: '',
      location_id: null,
      mood: '',
      word_count: 0,
      character_ids: [character.id],
      pov_character_id: null,
    })
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(
      updated.scenes.find((s) => s.title === 'Linked Scene')?.character_ids,
    ).toContain(character.id)

    localStorageAdapter.deleteCharacter(project.id, character.id)
    updated = localStorageAdapter.fetchProject(project.id)!
    const scene = updated.scenes.find((s) => s.title === 'Linked Scene')!
    expect(scene.character_ids).not.toContain(character.id)
  })

  it('upserts and deletes locations', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    localStorageAdapter.upsertLocation(project.id, {
      name: 'Castle',
      color: '#1d4ed8',
      summary: 'A fortress',
    })
    let updated = localStorageAdapter.fetchProject(project.id)!
    const location = updated.locations.find((l) => l.name === 'Castle')!
    expect(location).toBeDefined()

    localStorageAdapter.upsertLocation(project.id, {
      id: location.id,
      name: 'Castle Keep',
      color: '#1e40af',
      summary: 'The inner keep',
    })
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.locations.find((l) => l.id === location.id)?.name).toBe(
      'Castle Keep',
    )

    localStorageAdapter.deleteLocation(project.id, location.id)
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(updated.locations.some((l) => l.id === location.id)).toBe(false)
  })

  it('clears location_id on scenes when a location is deleted', () => {
    const project = localStorageAdapter.fetchProjects()[0]
    localStorageAdapter.upsertLocation(project.id, {
      name: 'Harbour',
      color: '#1d4ed8',
      summary: 'The docks',
    })
    let updated = localStorageAdapter.fetchProject(project.id)!
    const location = updated.locations.find((l) => l.name === 'Harbour')!

    localStorageAdapter.upsertScene(project.id, {
      title: 'Dock Scene',
      summary: '',
      location_id: location.id,
      mood: '',
      word_count: 0,
      character_ids: [],
      pov_character_id: null,
    })
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(
      updated.scenes.find((s) => s.title === 'Dock Scene')?.location_id,
    ).toBe(location.id)

    localStorageAdapter.deleteLocation(project.id, location.id)
    updated = localStorageAdapter.fetchProject(project.id)!
    expect(
      updated.scenes.find((s) => s.title === 'Dock Scene')?.location_id,
    ).toBeNull()
  })

  it('reorders scenes by ordered id list', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))

    const project = localStorageAdapter.createProject({
      title: 'Reorder Test',
      genre: '',
    })
    const sceneInput = {
      summary: '',
      location_id: null,
      mood: '',
      word_count: 0,
      character_ids: [] as string[],
      pov_character_id: null,
    }
    localStorageAdapter.upsertScene(project.id, { title: 'First', ...sceneInput })
    vi.advanceTimersByTime(1)
    localStorageAdapter.upsertScene(project.id, { title: 'Second', ...sceneInput })
    vi.advanceTimersByTime(1)
    localStorageAdapter.upsertScene(project.id, { title: 'Third', ...sceneInput })
    vi.useRealTimers()

    let updated = localStorageAdapter.fetchProject(project.id)!
    const ids = [...updated.scenes]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => s.id)

    localStorageAdapter.reorderScenes(project.id, [ids[2], ids[0], ids[1]])
    updated = localStorageAdapter.fetchProject(project.id)!
    const reordered = [...updated.scenes].sort((a, b) => a.sort_order - b.sort_order)
    expect(reordered.map((s) => s.title)).toEqual(['Third', 'First', 'Second'])
  })

  it('throws when operating on unknown project id', () => {
    expect(() =>
      localStorageAdapter.updateProjectSettings('bad-id', {
        title: 'X',
        genre: '',
        synopsis: '',
        target_word_count: null,
      }),
    ).toThrow('Project not found')
  })
})
