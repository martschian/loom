import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import { LOC_COLORS } from '@/lib/constants'
import type { LocationInput } from '@/lib/types'

interface LocationModalProps {
  location: Partial<LocationInput> & { id?: string }
  colorIndex: number
  onSave: (location: LocationInput & { id?: string }) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function LocationModal({
  location,
  colorIndex,
  onSave,
  onDelete,
  onClose,
}: LocationModalProps) {
  const isNew = !location.id
  const [form, setForm] = useState({
    name: location.name || '',
    summary: location.summary || '',
    color: location.color || LOC_COLORS[colorIndex % LOC_COLORS.length],
  })

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <Modal title={isNew ? 'New location' : 'Edit location'} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div className="mb-1 flex flex-wrap gap-1.5">
          {LOC_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set('color', c)}
              className="h-[22px] w-[22px] cursor-pointer rounded p-0 outline-none"
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
        <div>
          <Label>NAME</Label>
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Location name"
            autoFocus
          />
        </div>
        <div>
          <Label>SUMMARY</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="Describe this place — its atmosphere, significance, geography..."
            className="min-h-[90px]"
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          {!isNew && location.id && (
            <Button variant="danger" onClick={() => onDelete(location.id!)}>
              Delete
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave({ ...location, ...form })}
              disabled={!form.name.trim()}
            >
              {isNew ? 'Add location' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
