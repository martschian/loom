import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SceneModal } from '@/components/SceneModal'
import type { ProjectWithRelations } from '@/lib/types'

const project: ProjectWithRelations = {
  id: 'p1',
  user_id: 'u1',
  title: 'Test',
  genre: '',
  synopsis: '',
  target_word_count: null,
  created_at: '',
  updated_at: '',
  characters: [],
  locations: [],
  scenes: [],
}

const noop = vi.fn().mockResolvedValue(undefined)

describe('SceneModal', () => {
  it('disables save when title is empty', () => {
    render(
      <SceneModal
        scene={{}}
        project={project}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
        onSaveCharacter={noop}
        onSaveLocation={noop}
      />,
    )
    expect(screen.getByRole('button', { name: 'Add scene' })).toBeDisabled()
  })

  it('enables save when title is provided', async () => {
    const user = userEvent.setup()
    render(
      <SceneModal
        scene={{}}
        project={project}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
        onSaveCharacter={noop}
        onSaveLocation={noop}
      />,
    )
    await user.type(screen.getByPlaceholderText('e.g. The Storm Breaks'), 'Opening')
    expect(screen.getByRole('button', { name: 'Add scene' })).toBeEnabled()
  })
})
