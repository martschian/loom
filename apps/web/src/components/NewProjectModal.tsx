import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import type { NewProjectInput } from '@/lib/types'

interface NewProjectModalProps {
  onSave: (input: NewProjectInput) => void
  onClose: () => void
}

export function NewProjectModal({ onSave, onClose }: NewProjectModalProps) {
  const [form, setForm] = useState({ title: '', genre: '', synopsis: '' })
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <Modal title="New project" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <Label>TITLE</Label>
          <Input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Your story's title"
            autoFocus
          />
        </div>
        <div>
          <Label>GENRE (optional)</Label>
          <Input
            value={form.genre}
            onChange={(e) => set('genre', e.target.value)}
            placeholder="Fantasy, Mystery, Sci-Fi..."
          />
        </div>
        <div>
          <Label>SYNOPSIS (optional)</Label>
          <Textarea
            value={form.synopsis}
            onChange={(e) => set('synopsis', e.target.value)}
            placeholder="What's this story about?"
          />
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={!form.title.trim()}
          >
            Create project
          </Button>
        </div>
      </div>
    </Modal>
  )
}
