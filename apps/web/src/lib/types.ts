export type Mood =
  | 'Joyful'
  | 'Tense'
  | 'Mysterious'
  | 'Ominous'
  | 'Melancholic'
  | 'Action'
  | 'Romantic'
  | 'Comedic'
  | 'Hopeful'
  | 'Dark'

export interface Profile {
  id: string
  display_name: string
  created_at: string
}

export interface Character {
  id: string
  project_id: string
  name: string
  role: string
  color: string
  summary: string
  age: string
  pronouns: string
  relationships: string
  traits: string[]
}

export interface Location {
  id: string
  project_id: string
  name: string
  color: string
  summary: string
}

export interface Scene {
  id: string
  project_id: string
  title: string
  summary: string
  location_id: string | null
  mood: Mood | ''
  word_count: number
  sort_order: number
  character_ids: string[]
}

export interface Project {
  id: string
  user_id: string
  title: string
  genre: string
  synopsis: string
  target_word_count: number | null
  created_at: string
  updated_at: string
}

export interface ProjectWithRelations extends Project {
  characters: Character[]
  locations: Location[]
  scenes: Scene[]
}

export interface NewProjectInput {
  title: string
  genre?: string
  synopsis?: string
}

export interface ProjectSettingsInput {
  title: string
  genre: string
  synopsis: string
  target_word_count: number | null
}

export interface SceneInput {
  id?: string
  title: string
  summary: string
  location_id: string | null
  mood: Mood | ''
  word_count: number
  character_ids: string[]
}

export interface CharacterInput {
  id?: string
  name: string
  role: string
  summary: string
  color: string
  age: string
  pronouns: string
  relationships: string
  traits: string[]
}

export interface LocationInput {
  id?: string
  name: string
  summary: string
  color: string
}
