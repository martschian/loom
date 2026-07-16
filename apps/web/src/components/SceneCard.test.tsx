import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SceneCard } from '@/components/SceneCard'
import type { ProjectWithRelations, Scene } from '@/lib/types'

const project: ProjectWithRelations = {
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
      name: 'Lyra',
      role: 'Protagonist',
      color: '#7c3aed',
      summary: '',
      age: '',
      pronouns: '',
      relationships: '',
      traits: [],
      arc: {
        id: 'a1',
        character_id: 'c1',
        title: 'Trust',
        summary: '',
        sort_order: 0,
        beats: [{ id: 'b1', arc_id: 'a1', label: 'Opens up', sort_order: 0 }],
      },
    },
  ],
  locations: [],
  scenes: [],
}

const scene: Scene = {
  id: 's1',
  project_id: 'p1',
  title: 'The meeting',
  summary: '',
  location_id: null,
  word_count: 0,
  sort_order: 0,
  character_ids: ['c1'],
  pov_character_id: 'c1',
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
}

describe('SceneCard', () => {
  it('shows POV inside character chip styled for arc events', () => {
    render(
      <SceneCard
        scene={scene}
        project={project}
        onClick={vi.fn()}
        index={0}
      />,
    )
    expect(screen.getByText('Lyra: Opens up')).toBeInTheDocument()
    const pov = screen.getByTitle('POV character')
    expect(pov.closest('.rounded-full')).toContainElement(screen.getByText('Lyra: Opens up'))
    expect(screen.queryByText('Lyra', { exact: true })).not.toBeInTheDocument()
  })

  it('shows POV indicator on character chip when POV character has no arc event', () => {
    const sceneWithoutEvent = { ...scene, arc_events: [] }
    render(
      <SceneCard
        scene={sceneWithoutEvent}
        project={project}
        onClick={vi.fn()}
        index={0}
      />,
    )
    const pov = screen.getByTitle('POV character')
    expect(pov.closest('.rounded-full')).toContainElement(screen.getByText('Lyra', { exact: true }))
  })
})
