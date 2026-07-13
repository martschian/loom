import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Drawer } from '@/components/ui/Drawer'

describe('Drawer', () => {
  it('renders title and children', () => {
    render(
      <Drawer title="Test drawer" onClose={() => {}}>
        <p>Content</p>
      </Drawer>,
    )
    expect(screen.getByText('Test drawer')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Drawer title="Test" onClose={onClose}>
        <p>Content</p>
      </Drawer>,
    )
    const backdrop = screen.getByText('Test').closest('.fixed')!
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Drawer title="Test" onClose={onClose}>
        <p>Content</p>
      </Drawer>,
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Drawer title="Test" onClose={onClose}>
        <p>Content</p>
      </Drawer>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
