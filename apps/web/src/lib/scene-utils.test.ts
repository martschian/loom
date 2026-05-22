import { describe, expect, it } from 'vitest'
import { formatArcEventLabel, getSceneAccentColor } from '@/lib/scene-utils'
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
      arc: {
        id: 'arc1',
        character_id: 'c1',
        title: 'Arc',
        summary: '',
        sort_order: 0,
        beats: [{ id: 'b1', arc_id: 'arc1', label: 'Beat one', sort_order: 0 }],
      },
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
  character_ids: ['c1'],
  pov_character_id: null,
  arc_events: [],
}

describe('getSceneAccentColor', () => {
  it('uses POV character color when set', () => {
    expect(
      getSceneAccentColor({ ...baseScene, pov_character_id: 'c1' }, baseProject),
    ).toBe('#ff0000')
  })

  it('uses first arc event character when no POV', () => {
    expect(
      getSceneAccentColor(
        {
          ...baseScene,
          arc_events: [
            {
              id: 'e1',
              scene_id: 's1',
              character_id: 'c1',
              beat_id: 'b1',
              note: '',
              sort_order: 0,
            },
          ],
        },
        baseProject,
      ),
    ).toBe('#ff0000')
  })
})

describe('formatArcEventLabel', () => {
  it('uses beat label when beat_id is set', () => {
    expect(
      formatArcEventLabel(
        {
          id: 'e1',
          scene_id: 's1',
          character_id: 'c1',
          beat_id: 'b1',
          note: '',
          sort_order: 0,
        },
        baseProject,
      ),
    ).toBe('A: Beat one')
  })
})
