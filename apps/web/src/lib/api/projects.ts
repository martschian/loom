import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase/client'
import type {
  Character,
  CharacterArcInput,
  CharacterInput,
  LocationInput,
  NewProjectInput,
  Project,
  ProjectSettingsInput,
  ProjectWithRelations,
  SceneInput,
} from '@/lib/types'

async function getClient(): Promise<SupabaseClient<Database>> {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

async function fetchSceneCharacterIds(
  sceneIds: string[],
): Promise<Map<string, string[]>> {
  const client = await getClient()
  const map = new Map<string, string[]>()
  if (sceneIds.length === 0) return map

  const { data, error } = await client
    .from('scene_characters')
    .select('scene_id, character_id')
    .in('scene_id', sceneIds)

  if (error) throw error
  for (const row of data ?? []) {
    const existing = map.get(row.scene_id) ?? []
    existing.push(row.character_id)
    map.set(row.scene_id, existing)
  }
  return map
}

async function fetchCharacterArcs(
  characterIds: string[],
): Promise<Map<string, Character['arc']>> {
  const client = await getClient()
  const map = new Map<string, Character['arc']>()
  if (characterIds.length === 0) return map

  const { data: arcs, error: arcsError } = await client
    .from('character_arcs')
    .select('id, character_id, title, summary, sort_order')
    .in('character_id', characterIds)

  if (arcsError) throw arcsError
  const arcIds = (arcs ?? []).map((a) => a.id)
  const beatsByArc = new Map<string, NonNullable<Character['arc']>['beats']>()

  if (arcIds.length > 0) {
    const { data: beats, error: beatsError } = await client
      .from('arc_beats')
      .select('id, arc_id, label, sort_order')
      .in('arc_id', arcIds)
      .order('sort_order')

    if (beatsError) throw beatsError
    for (const beat of beats ?? []) {
      const list = beatsByArc.get(beat.arc_id) ?? []
      list.push(beat)
      beatsByArc.set(beat.arc_id, list)
    }
  }

  for (const arc of arcs ?? []) {
    map.set(arc.character_id, {
      ...arc,
      beats: beatsByArc.get(arc.id) ?? [],
    })
  }
  return map
}

async function fetchSceneArcEvents(sceneIds: string[]) {
  const client = await getClient()
  const map = new Map<string, ProjectWithRelations['scenes'][0]['arc_events']>()
  if (sceneIds.length === 0) return map

  const { data, error } = await client
    .from('scene_arc_events')
    .select('id, scene_id, character_id, beat_id, note, sort_order')
    .in('scene_id', sceneIds)
    .order('sort_order')

  if (error) throw error
  for (const row of data ?? []) {
    const existing = map.get(row.scene_id) ?? []
    existing.push(row)
    map.set(row.scene_id, existing)
  }
  return map
}

async function syncCharacterArc(
  characterId: string,
  arc: CharacterArcInput | null,
) {
  const client = await getClient()
  await client.from('character_arcs').delete().eq('character_id', characterId)

  if (!arc?.title.trim()) return

  const { data: inserted, error: arcError } = await client
    .from('character_arcs')
    .insert({
      character_id: characterId,
      title: arc.title.trim(),
      summary: arc.summary,
      sort_order: 0,
    })
    .select('id')
    .single()

  if (arcError) throw arcError

  const beats = (arc.beats ?? [])
    .filter((b) => b.label.trim())
    .map((b, index) => ({
      arc_id: inserted.id,
      label: b.label.trim(),
      sort_order: b.sort_order ?? index,
    }))

  if (beats.length > 0) {
    const { error: beatsError } = await client.from('arc_beats').insert(beats)
    if (beatsError) throw beatsError
  }
}

async function assembleProject(
  project: Project,
): Promise<ProjectWithRelations> {
  const client = await getClient()
  const [charactersRes, locationsRes, scenesRes] = await Promise.all([
    client.from('characters').select('*').eq('project_id', project.id),
    client.from('locations').select('*').eq('project_id', project.id),
    client
      .from('scenes')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order'),
  ])

  if (charactersRes.error) throw charactersRes.error
  if (locationsRes.error) throw locationsRes.error
  if (scenesRes.error) throw scenesRes.error

  const characters = charactersRes.data ?? []
  const characterIds = characters.map((c) => c.id)
  const sceneIds = (scenesRes.data ?? []).map((s) => s.id)
  const [charMap, arcMap, eventsMap] = await Promise.all([
    fetchSceneCharacterIds(sceneIds),
    fetchCharacterArcs(characterIds),
    fetchSceneArcEvents(sceneIds),
  ])

  return {
    ...project,
    characters: characters.map((c) => ({
      ...c,
      arc: arcMap.get(c.id) ?? null,
    })),
    locations: locationsRes.data ?? [],
    scenes: (scenesRes.data ?? []).map((s) => ({
      ...s,
      character_ids: charMap.get(s.id) ?? [],
      arc_events: eventsMap.get(s.id) ?? [],
    })),
  }
}

export async function fetchProjects(userId: string): Promise<ProjectWithRelations[]> {
  const client = await getClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return Promise.all((data ?? []).map(assembleProject))
}

export async function fetchProject(id: string): Promise<ProjectWithRelations | null> {
  const client = await getClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return assembleProject(data)
}

export async function createProject(
  userId: string,
  input: NewProjectInput,
): Promise<ProjectWithRelations> {
  const client = await getClient()
  const { data, error } = await client
    .from('projects')
    .insert({
      user_id: userId,
      title: input.title,
      genre: input.genre ?? '',
      synopsis: input.synopsis ?? '',
    })
    .select('*')
    .single()

  if (error) throw error
  return {
    ...data,
    characters: [],
    locations: [],
    scenes: [],
  }
}

export async function updateProjectSettings(
  projectId: string,
  settings: ProjectSettingsInput,
): Promise<void> {
  const client = await getClient()
  const { error } = await client
    .from('projects')
    .update({
      title: settings.title,
      genre: settings.genre,
      synopsis: settings.synopsis,
      target_word_count: settings.target_word_count,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)

  if (error) throw error
}

async function touchProject(projectId: string) {
  const client = await getClient()
  await client
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', projectId)
}

export async function upsertScene(
  projectId: string,
  input: SceneInput & { id?: string },
  sortOrder?: number,
): Promise<void> {
  const client = await getClient()
  const sceneData = {
    project_id: projectId,
    title: input.title,
    summary: input.summary,
    location_id: input.location_id || null,
    word_count: input.word_count,
    pov_character_id: input.pov_character_id ?? null,
  }

  let sceneId = input.id

  if (sceneId) {
    const { error } = await client
      .from('scenes')
      .update(sceneData)
      .eq('id', sceneId)
    if (error) throw error
  } else {
    const { data: scenes } = await client
      .from('scenes')
      .select('sort_order')
      .eq('project_id', projectId)
    const nextOrder = sortOrder ?? (scenes?.length ?? 0)
    const { data, error } = await client
      .from('scenes')
      .insert({ ...sceneData, sort_order: nextOrder })
      .select('id')
      .single()
    if (error) throw error
    sceneId = data.id
  }

  if (!sceneId) throw new Error('Failed to resolve scene id')

  await client.from('scene_characters').delete().eq('scene_id', sceneId)
  if (input.character_ids.length > 0) {
    const { error } = await client.from('scene_characters').insert(
      input.character_ids.map((character_id) => ({
        scene_id: sceneId,
        character_id,
      })),
    )
    if (error) throw error
  }

  await client.from('scene_arc_events').delete().eq('scene_id', sceneId)
  const events = (input.arc_events ?? [])
    .filter((e) => input.character_ids.includes(e.character_id))
    .filter((e) => e.beat_id || e.note.trim())
    .map((e, index) => ({
      scene_id: sceneId,
      character_id: e.character_id,
      beat_id: e.beat_id,
      note: e.note.trim(),
      sort_order: e.sort_order ?? index,
    }))
  if (events.length > 0) {
    const { error: eventsError } = await client.from('scene_arc_events').insert(events)
    if (eventsError) throw eventsError
  }

  await touchProject(projectId)
}

export async function deleteScene(projectId: string, sceneId: string): Promise<void> {
  const client = await getClient()
  const { error } = await client.from('scenes').delete().eq('id', sceneId)
  if (error) throw error
  await touchProject(projectId)
}

export async function reorderScenes(projectId: string, orderedIds: string[]): Promise<void> {
  const client = await getClient()
  await Promise.all(
    orderedIds.map((id, index) =>
      client.from('scenes').update({ sort_order: index }).eq('id', id),
    ),
  )
  await touchProject(projectId)
}

export async function upsertCharacter(
  projectId: string,
  input: CharacterInput & { id?: string },
): Promise<void> {
  const client = await getClient()
  const row = {
    project_id: projectId,
    name: input.name,
    role: input.role,
    color: input.color,
    summary: input.summary,
    age: input.age,
    pronouns: input.pronouns,
    relationships: input.relationships,
    traits: input.traits,
  }

  let characterId = input.id

  if (characterId) {
    const { error } = await client.from('characters').update(row).eq('id', characterId)
    if (error) throw error
  } else {
    const { data, error } = await client.from('characters').insert(row).select('id').single()
    if (error) throw error
    characterId = data.id
  }

  if (characterId) {
    await syncCharacterArc(characterId, input.arc)
  }

  await touchProject(projectId)
}

export async function deleteCharacter(
  projectId: string,
  characterId: string,
): Promise<void> {
  const client = await getClient()
  const { error } = await client.from('characters').delete().eq('id', characterId)
  if (error) throw error
  await touchProject(projectId)
}

export async function upsertLocation(
  projectId: string,
  input: LocationInput & { id?: string },
): Promise<void> {
  const client = await getClient()
  const row = {
    project_id: projectId,
    name: input.name,
    color: input.color,
    summary: input.summary,
  }

  if (input.id) {
    const { error } = await client.from('locations').update(row).eq('id', input.id)
    if (error) throw error
  } else {
    const { error } = await client.from('locations').insert(row)
    if (error) throw error
  }
  await touchProject(projectId)
}

export async function deleteLocation(
  projectId: string,
  locationId: string,
): Promise<void> {
  const client = await getClient()
  const { error } = await client.from('locations').delete().eq('id', locationId)
  if (error) throw error
  await touchProject(projectId)
}
