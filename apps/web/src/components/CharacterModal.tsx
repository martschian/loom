import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import { CHAR_COLORS } from '@/lib/constants'
import type { CharacterInput } from '@/lib/types'

interface CharacterModalProps {
  character: Partial<CharacterInput> & { id?: string }
  colorIndex: number
  onSave: (character: CharacterInput & { id?: string }) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function CharacterModal({
  character,
  colorIndex,
  onSave,
  onDelete,
  onClose,
}: CharacterModalProps) {
  const isNew = !character.id
  const [form, setForm] = useState({
    name: character.name || '',
    role: character.role || '',
    summary: character.summary || '',
    color: character.color || CHAR_COLORS[colorIndex % CHAR_COLORS.length],
  })

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <Modal
      title={isNew ? 'New character' : 'Edit character'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3.5">
        <div className="mb-1 flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-xl font-bold text-white"
            style={{ background: form.color }}
          >
            {form.name ? form.name[0].toUpperCase() : '?'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CHAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('color', c)}
                className="h-[22px] w-[22px] cursor-pointer rounded-full p-0 outline-none"
                style={{
                  background: c,
                  border:
                    form.color === c
                      ? '2.5px solid #1a1a2e'
                      : '2px solid transparent',
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>NAME</Label>
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Character name"
            autoFocus
          />
        </div>
        <div>
          <Label>ROLE</Label>
          <Input
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            placeholder="e.g. Protagonist, Antagonist, Ally..."
          />
        </div>
        <div>
          <Label>SUMMARY</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="Who is this character? What drives them?"
            className="min-h-[90px]"
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          {!isNew && character.id && (
            <Button variant="danger" onClick={() => onDelete(character.id!)}>
              Delete
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave({ ...character, ...form })}
              disabled={!form.name.trim()}
            >
              {isNew ? 'Add character' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
