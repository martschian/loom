import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import { MOODS } from '@/lib/constants'
import type { Mood, ProjectWithRelations, SceneInput } from '@/lib/types'

interface SceneModalProps {
  scene: Partial<SceneInput> & { id?: string }
  project: ProjectWithRelations
  onSave: (scene: SceneInput & { id?: string }) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function SceneModal({
  scene,
  project,
  onSave,
  onDelete,
  onClose,
}: SceneModalProps) {
  const isNew = !scene.id
  const [form, setForm] = useState<SceneInput>({
    title: scene.title || '',
    summary: scene.summary || '',
    location_id: scene.location_id ?? null,
    character_ids: scene.character_ids || [],
    mood: (scene.mood || '') as Mood | '',
    word_count: scene.word_count || 0,
  })

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleChar = (id: string) =>
    set(
      'character_ids',
      form.character_ids.includes(id)
        ? form.character_ids.filter((x) => x !== id)
        : [...form.character_ids, id],
    )

  return (
    <Modal title={isNew ? 'New scene' : 'Edit scene'} onClose={onClose} width={520}>
      <div className="flex flex-col gap-3.5">
        <div>
          <Label>SCENE TITLE</Label>
          <Input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. The Storm Breaks"
          />
        </div>
        <div>
          <Label>SUMMARY</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="A short description of what happens in this scene..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>LOCATION</Label>
            <Select
              value={form.location_id ?? ''}
              onChange={(e) =>
                set('location_id', e.target.value || null)
              }
            >
              <option value="">none</option>
              {project.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>MOOD</Label>
            <Select
              value={form.mood}
              onChange={(e) => set('mood', e.target.value as Mood | '')}
            >
              <option value="">none</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>CHARACTERS IN SCENE</Label>
          <div className="flex flex-wrap gap-1.5">
            {project.characters.map((c) => {
              const on = form.character_ids.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleChar(c.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pl-2 pr-3.5 transition-all"
                  style={{
                    background: on ? `${c.color}22` : 'transparent',
                    border: `1.5px solid ${on ? c.color : '#e5e7eb'}`,
                  }}
                >
                  <div
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: c.color }}
                  >
                    {c.name[0]}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color: on ? c.color : '#6b7280',
                      fontWeight: on ? 600 : 400,
                    }}
                  >
                    {c.name}
                  </span>
                </button>
              )
            })}
            {project.characters.length === 0 && (
              <span className="text-xs text-gray-400">No characters yet</span>
            )}
          </div>
        </div>
        <div>
          <Label>WORD COUNT</Label>
          <Input
            type="number"
            value={form.word_count || ''}
            onChange={(e) => set('word_count', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          {!isNew && scene.id && (
            <Button variant="danger" onClick={() => onDelete(scene.id!)}>
              Delete scene
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave({ ...scene, ...form })}
              disabled={!form.title.trim()}
            >
              {isNew ? 'Add scene' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
