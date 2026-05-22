import { CHAR_COLORS, LOC_COLORS } from '@/lib/constants'
import type {
  CharacterInput,
  LocationInput,
  NewProjectInput,
  Profile,
  ProjectSettingsInput,
  ProjectWithRelations,
  SceneInput,
} from '@/lib/types'

const STORAGE_KEY = 'loom_data'

interface LocalStore {
  profile: Profile
  projects: ProjectWithRelations[]
}

function migrateStore(store: LocalStore): LocalStore {
  for (const project of store.projects) {
    project.characters = project.characters.map((c) => ({
      ...c,
      age: c.age ?? '',
      pronouns: c.pronouns ?? '',
      relationships: c.relationships ?? '',
      traits: c.traits ?? [],
    }))
    project.scenes = project.scenes.map((s) => ({
      ...s,
      pov_character_id: s.pov_character_id ?? null,
    }))
  }
  return store
}

function loadStore(): LocalStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? migrateStore(JSON.parse(raw) as LocalStore) : null
  } catch {
    return null
  }
}

function saveStore(store: LocalStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function defaultStore(): LocalStore {
  const now = new Date().toISOString()
  const userId = 'local-user'
  return {
    profile: {
      id: userId,
      display_name: 'Local Writer',
      created_at: now,
    },
    projects: [
      {
        id: 'p1',
        user_id: userId,
        title: 'The Ember Coast',
        genre: 'Fantasy',
        synopsis:
          'A coastal kingdom where fire is sacred — and slowly dying.',
        target_word_count: 80000,
        created_at: now,
        updated_at: now,
        characters: [
          {
            id: 'c1',
            project_id: 'p1',
            name: 'Lyra Ashveil',
            role: 'Protagonist',
            color: CHAR_COLORS[0],
            summary:
              "A former harbour-keeper's daughter with a rare immunity to cold flame.",
            age: 'mid-twenties',
            pronouns: 'she/her',
            relationships: 'Childhood friend of Maren. Uneasy subject of Oryn\'s attention.',
            traits: ['redhead', 'determined', 'guarded', 'immunity to cold flame'],
          },
          {
            id: 'c2',
            project_id: 'p1',
            name: 'Oryn',
            role: 'Antagonist',
            color: CHAR_COLORS[1],
            summary:
              'The Flame Regent who rules the Citadel with absolute authority.',
            age: '',
            pronouns: 'he/him',
            relationships: '',
            traits: ['patient', 'calculating', 'outwardly warm'],
          },
        ],
        locations: [
          {
            id: 'l1',
            project_id: 'p1',
            name: 'The Cinderport',
            color: LOC_COLORS[0],
            summary: 'A salt-bitten harbour town at the edge of the ember coast.',
          },
        ],
        scenes: [
          {
            id: 's1',
            project_id: 'p1',
            title: 'Arrival at Cinderport',
            sort_order: 0,
            location_id: 'l1',
            character_ids: ['c1'],
            pov_character_id: 'c1',
            summary:
              'Lyra docks after weeks at sea. The harbour fires burn low.',
            mood: 'Mysterious',
            word_count: 940,
          },
        ],
      },
    ],
  }
}

function getOrInit(): LocalStore {
  const store = loadStore() ?? defaultStore()
  saveStore(store)
  return store
}

export const localStorageAdapter = {
  getProfile(): Profile {
    return getOrInit().profile
  },

  updateProfile(displayName: string): Profile {
    const store = getOrInit()
    store.profile.display_name = displayName
    saveStore(store)
    return store.profile
  },

  fetchProjects(): ProjectWithRelations[] {
    return getOrInit().projects
  },

  fetchProject(id: string): ProjectWithRelations | null {
    return getOrInit().projects.find((p) => p.id === id) ?? null
  },

  createProject(input: NewProjectInput): ProjectWithRelations {
    const store = getOrInit()
    const now = new Date().toISOString()
    const project: ProjectWithRelations = {
      id: `p${Date.now()}`,
      user_id: store.profile.id,
      title: input.title,
      genre: input.genre ?? '',
      synopsis: input.synopsis ?? '',
      target_word_count: null,
      created_at: now,
      updated_at: now,
      characters: [],
      locations: [],
      scenes: [],
    }
    store.projects.unshift(project)
    saveStore(store)
    return project
  },

  updateProjectSettings(projectId: string, settings: ProjectSettingsInput) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')
    Object.assign(project, settings, { updated_at: new Date().toISOString() })
    saveStore(store)
  },

  upsertScene(projectId: string, input: SceneInput & { id?: string }) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    if (input.id) {
      const idx = project.scenes.findIndex((s) => s.id === input.id)
      if (idx >= 0) {
        project.scenes[idx] = {
          ...project.scenes[idx],
          ...input,
          location_id: input.location_id || null,
          mood: input.mood || '',
          pov_character_id: input.pov_character_id ?? null,
        }
      }
    } else {
      project.scenes.push({
        id: `s${Date.now()}`,
        project_id: projectId,
        title: input.title,
        summary: input.summary,
        location_id: input.location_id || null,
        mood: input.mood || '',
        word_count: input.word_count,
        sort_order: project.scenes.length,
        character_ids: input.character_ids,
        pov_character_id: input.pov_character_id ?? null,
      })
    }
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  deleteScene(projectId: string, sceneId: string) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')
    project.scenes = project.scenes.filter((s) => s.id !== sceneId)
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  upsertCharacter(projectId: string, input: CharacterInput & { id?: string }) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    if (input.id) {
      const idx = project.characters.findIndex((c) => c.id === input.id)
      if (idx >= 0) project.characters[idx] = { ...project.characters[idx], ...input, project_id: projectId }
    } else {
      project.characters.push({
        id: `c${Date.now()}`,
        project_id: projectId,
        name: input.name,
        role: input.role,
        color: input.color,
        summary: input.summary,
        age: input.age,
        pronouns: input.pronouns,
        relationships: input.relationships,
        traits: input.traits,
      })
    }
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  deleteCharacter(projectId: string, characterId: string) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')
    project.characters = project.characters.filter((c) => c.id !== characterId)
    project.scenes = project.scenes.map((s) => ({
      ...s,
      character_ids: s.character_ids.filter((id) => id !== characterId),
    }))
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  upsertLocation(projectId: string, input: LocationInput & { id?: string }) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    if (input.id) {
      const idx = project.locations.findIndex((l) => l.id === input.id)
      if (idx >= 0) project.locations[idx] = { ...project.locations[idx], ...input, project_id: projectId }
    } else {
      project.locations.push({
        id: `l${Date.now()}`,
        project_id: projectId,
        name: input.name,
        color: input.color,
        summary: input.summary,
      })
    }
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  deleteLocation(projectId: string, locationId: string) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')
    project.locations = project.locations.filter((l) => l.id !== locationId)
    project.scenes = project.scenes.map((s) => ({
      ...s,
      location_id: s.location_id === locationId ? null : s.location_id,
    }))
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },

  reorderScenes(projectId: string, orderedIds: string[]) {
    const store = getOrInit()
    const project = store.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')
    orderedIds.forEach((id, index) => {
      const scene = project.scenes.find((s) => s.id === id)
      if (scene) scene.sort_order = index
    })
    project.updated_at = new Date().toISOString()
    saveStore(store)
  },
}
