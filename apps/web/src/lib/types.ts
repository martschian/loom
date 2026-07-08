export interface Profile {
  id: string
  display_name: string
  created_at: string
}

export interface ArcBeat {
  id: string
  arc_id: string
  label: string
  sort_order: number
}

export interface CharacterArc {
  id: string
  character_id: string
  title: string
  summary: string
  sort_order: number
  beats: ArcBeat[]
}

export type ArcBeatInput = Pick<ArcBeat, 'label' | 'sort_order'> & { id?: string }

export interface CharacterArcInput {
  title: string
  summary: string
  beats: ArcBeatInput[]
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
  arc: CharacterArc | null
}

export interface Location {
  id: string
  project_id: string
  name: string
  color: string
  summary: string
}

export interface SceneArcEvent {
  id: string
  scene_id: string
  character_id: string
  beat_id: string | null
  note: string
  sort_order: number
}

export type SceneArcEventInput = Pick<
  SceneArcEvent,
  'character_id' | 'beat_id' | 'note' | 'sort_order'
>

export interface Scene {
  id: string
  project_id: string
  title: string
  summary: string
  location_id: string | null
  word_count: number
  sort_order: number
  character_ids: string[]
  pov_character_id: string | null
  arc_events: SceneArcEvent[]
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
  word_count: number
  character_ids: string[]
  pov_character_id: string | null
  arc_events: SceneArcEventInput[]
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
  arc: CharacterArcInput | null
}

export interface LocationInput {
  id?: string
  name: string
  summary: string
  color: string
}
