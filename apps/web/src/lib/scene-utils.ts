import type { ProjectWithRelations, Scene } from '@/lib/types'

const NEUTRAL_ACCENT = '#6b7280'

/** Timeline/card accent: POV color, else first moment character, else first cast member. */
export function getSceneAccentColor(
  scene: Scene,
  project: ProjectWithRelations,
): string {
  if (scene.pov_character_id) {
    const pov = project.characters.find((c) => c.id === scene.pov_character_id)
    if (pov) return pov.color
  }
  const firstMomentCharId = scene.moments[0]?.character_id
  if (firstMomentCharId) {
    const c = project.characters.find((ch) => ch.id === firstMomentCharId)
    if (c) return c.color
  }
  const firstCastId = scene.character_ids[0]
  if (firstCastId) {
    const c = project.characters.find((ch) => ch.id === firstCastId)
    if (c) return c.color
  }
  return NEUTRAL_ACCENT
}
