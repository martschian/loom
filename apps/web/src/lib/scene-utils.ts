import type { ProjectWithRelations, Scene } from '@/lib/types'

const NEUTRAL_ACCENT = '#6b7280'

/** Timeline/card accent: POV color, else first arc event character, else first cast member. */
export function getSceneAccentColor(
  scene: Scene,
  project: ProjectWithRelations,
): string {
  if (scene.pov_character_id) {
    const pov = project.characters.find((c) => c.id === scene.pov_character_id)
    if (pov) return pov.color
  }
  const firstEventCharId = scene.arc_events[0]?.character_id
  if (firstEventCharId) {
    const c = project.characters.find((ch) => ch.id === firstEventCharId)
    if (c) return c.color
  }
  const firstCastId = scene.character_ids[0]
  if (firstCastId) {
    const c = project.characters.find((ch) => ch.id === firstCastId)
    if (c) return c.color
  }
  return NEUTRAL_ACCENT
}

export function formatArcEventLabel(
  event: Scene['arc_events'][0],
  project: ProjectWithRelations,
): string {
  const char = project.characters.find((c) => c.id === event.character_id)
  const beatLabel = event.beat_id
    ? project.characters
        .find((c) => c.id === event.character_id)
        ?.arc?.beats.find((b) => b.id === event.beat_id)?.label
    : null
  const detail = beatLabel || event.note.trim() || 'Arc event'
  return char ? `${char.name}: ${detail}` : detail
}
