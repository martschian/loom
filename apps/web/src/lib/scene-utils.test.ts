import { describe, expect, it } from 'vitest'
import { getSceneAccentColor } from '@/lib/scene-utils'
import type { ProjectWithRelations, Scene } from '@/lib/types'

const baseProject: ProjectWithRelations = {
  id: 'p1',
  user_id: 'u1',
  title: 'Test',
  genre: '',
  synopsis: '',
  target_word_count: null,
  created_at: '',
  updated_at: '',
  characters: [
    {
      id: 'c1',
      project_id: 'p1',
      name: 'A',
      role: '',
      color: '#ff0000',
      summary: '',
      age: '',
      pronouns: '',
      relationships: '',
      traits: [],
      arc_summary: '',
    },
    {
      id: 'c2',
      project_id: 'p1',
      name: 'B',
      role: '',
      color: '#00ff00',
      summary: '',
      age: '',
      pronouns: '',
      relationships: '',
      traits: [],
      arc_summary: '',
    },
  ],
  locations: [],
  scenes: [],
}

const baseScene: Scene = {
  id: 's1',
  project_id: 'p1',
  title: 'Scene',
  summary: '',
  location_id: null,
  word_count: 0,
  sort_order: 0,
  character_ids: ['c1', 'c2'],
  pov_character_id: null,
  moments: [],
}

describe('getSceneAccentColor', () => {
  it('uses POV character color when set', () => {
    expect(
      getSceneAccentColor(
        { ...baseScene, pov_character_id: 'c2' },
        baseProject,
      ),
    ).toBe('#00ff00')
  })

  it('uses first moment character when no POV', () => {
    expect(
      getSceneAccentColor(
        {
          ...baseScene,
          moments: [
            {
              id: 'm1',
              character_id: 'c2',
              label: 'Beat',
              sort_order: 0,
            },
          ],
        },
        baseProject,
      ),
    ).toBe('#00ff00')
  })

  it('falls back to first cast member', () => {
    expect(getSceneAccentColor(baseScene, baseProject)).toBe('#ff0000')
  })

  it('uses neutral when scene has no characters', () => {
    expect(
      getSceneAccentColor(
        { ...baseScene, character_ids: [], moments: [] },
        baseProject,
      ),
    ).toBe('#6b7280')
  })
})
