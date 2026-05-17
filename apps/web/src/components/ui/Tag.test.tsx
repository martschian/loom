import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tag } from '@/components/ui/Tag'

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag label="Fantasy" />)
    expect(screen.getByText('Fantasy')).toBeInTheDocument()
  })
})
