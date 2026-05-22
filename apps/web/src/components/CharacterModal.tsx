import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import { CharacterArcEditor } from '@/components/CharacterArcEditor'
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
    age: character.age || '',
    pronouns: character.pronouns || '',
    relationships: character.relationships || '',
    traits: character.traits ?? [],
    arc: character.arc
      ? {
          title: character.arc.title,
          summary: character.arc.summary,
          beats: character.arc.beats.map((b) => ({
            id: b.id,
            label: b.label,
            sort_order: b.sort_order,
          })),
        }
      : null,
  })
  const [traitInput, setTraitInput] = useState('')

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const addTrait = () => {
    const trimmed = traitInput.trim()
    if (trimmed && !form.traits.includes(trimmed)) {
      set('traits', [...form.traits, trimmed])
    }
    setTraitInput('')
  }

  const removeTrait = (trait: string) =>
    set('traits', form.traits.filter((t) => t !== trait))

  const handleTraitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTrait()
    } else if (e.key === 'Backspace' && traitInput === '' && form.traits.length > 0) {
      removeTrait(form.traits[form.traits.length - 1])
    }
  }

  return (
    <Modal
      title={isNew ? 'New character' : 'Edit character'}
      onClose={onClose}
      width={560}
    >
      <div className="flex flex-col gap-3.5">
        {/* Color + avatar */}
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

        {/* Name + Role */}
        <div className="grid grid-cols-2 gap-3">
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
              placeholder="Protagonist, Ally..."
            />
          </div>
        </div>

        {/* Age + Pronouns */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>AGE</Label>
            <Input
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              placeholder="e.g. mid-twenties, 34, ageless"
            />
          </div>
          <div>
            <Label>PRONOUNS</Label>
            <Input
              value={form.pronouns}
              onChange={(e) => set('pronouns', e.target.value)}
              placeholder="e.g. she/her, they/them"
            />
          </div>
        </div>

        {/* Traits */}
        <div>
          <Label>TRAITS</Label>
          <div
            className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-gray-50 px-2.5 py-2 focus-within:border-gray-400"
          >
            {form.traits.map((trait) => (
              <span
                key={trait}
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: `${form.color}22`,
                  color: form.color,
                  border: `1px solid ${form.color}44`,
                }}
              >
                {trait}
                <button
                  type="button"
                  onClick={() => removeTrait(trait)}
                  className="ml-0.5 cursor-pointer leading-none opacity-60 hover:opacity-100"
                  aria-label={`Remove ${trait}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              onKeyDown={handleTraitKeyDown}
              onBlur={addTrait}
              placeholder={form.traits.length === 0 ? 'Type a trait and press Enter…' : ''}
              className="min-w-[120px] flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            Press Enter or comma to add · Backspace to remove last
          </p>
        </div>

        {/* Character arc */}
        <div>
          <Label>CHARACTER ARC</Label>
          <CharacterArcEditor
            arc={form.arc}
            onChange={(arc) => setForm((f) => ({ ...f, arc }))}
          />
        </div>

        {/* Summary */}
        <div>
          <Label>SUMMARY</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="Who is this character? What drives them?"
            className="min-h-[80px]"
          />
        </div>

        {/* Relationships */}
        <div>
          <Label>RELATIONSHIPS</Label>
          <Textarea
            value={form.relationships}
            onChange={(e) => set('relationships', e.target.value)}
            placeholder="How does this character relate to others in the story?"
            className="min-h-[70px]"
          />
        </div>

        {/* Actions */}
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
