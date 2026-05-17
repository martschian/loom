import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders title and children', () => {
    render(
      <Modal title="Test modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    )
    expect(screen.getByText('Test modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal title="Test" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    const backdrop = screen.getByText('Test').closest('.fixed')!
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal title="Test" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    await user.click(screen.getByRole('button', { name: '×' }))
    expect(onClose).toHaveBeenCalled()
  })
})
