import { useEffect, useRef, useState } from 'react'
import { CharacterModal } from '@/components/CharacterModal'
import { LocationModal } from '@/components/LocationModal'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/FormField'
import { Modal } from '@/components/ui/Modal'
import { MOODS } from '@/lib/constants'
import type { CharacterInput, LocationInput, Mood, ProjectWithRelations, SceneInput } from '@/lib/types'

interface SceneModalProps {
  scene: Partial<SceneInput> & { id?: string }
  project: ProjectWithRelations
  onSave: (scene: SceneInput & { id?: string }) => void
  onDelete: (id: string) => void
  onClose: () => void
  onSaveCharacter: (input: CharacterInput & { id?: string }) => Promise<void>
  onSaveLocation: (input: LocationInput & { id?: string }) => Promise<void>
}

export function SceneModal({
  scene,
  project,
  onSave,
  onDelete,
  onClose,
  onSaveCharacter,
  onSaveLocation,
}: SceneModalProps) {
  const isNew = !scene.id
  const [form, setForm] = useState<SceneInput>({
    title: scene.title || '',
    summary: scene.summary || '',
    location_id: scene.location_id ?? null,
    character_ids: scene.character_ids || [],
    mood: (scene.mood || '') as Mood | '',
    word_count: scene.word_count || 0,
    pov_character_id: scene.pov_character_id ?? null,
  })

  const [showNewCharacter, setShowNewCharacter] = useState(false)
  const [showNewLocation, setShowNewLocation] = useState(false)

  // Snapshots taken just before a sub-modal save, used to detect the new item
  const prevCharIds = useRef<string[]>(project.characters.map((c) => c.id))
  const prevLocIds = useRef<string[]>(project.locations.map((l) => l.id))
  const [awaitingNewChar, setAwaitingNewChar] = useState(false)
  const [awaitingNewLoc, setAwaitingNewLoc] = useState(false)

  useEffect(() => {
    if (!awaitingNewChar) return
    const added = project.characters.filter(
      (c) => !prevCharIds.current.includes(c.id),
    )
    if (added.length > 0) {
      setForm((f) => ({
        ...f,
        character_ids: [...new Set([...f.character_ids, ...added.map((c) => c.id)])],
      }))
      prevCharIds.current = project.characters.map((c) => c.id)
      setAwaitingNewChar(false)
    }
  }, [project.characters, awaitingNewChar])

  useEffect(() => {
    if (!awaitingNewLoc) return
    const added = project.locations.filter(
      (l) => !prevLocIds.current.includes(l.id),
    )
    if (added.length > 0) {
      setForm((f) => ({ ...f, location_id: added[0].id }))
      prevLocIds.current = project.locations.map((l) => l.id)
      setAwaitingNewLoc(false)
    }
  }, [project.locations, awaitingNewLoc])

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggleChar = (id: string) =>
    setForm((f) => {
      const isOn = f.character_ids.includes(id)
      return {
        ...f,
        character_ids: isOn ? f.character_ids.filter((x) => x !== id) : [...f.character_ids, id],
        pov_character_id: isOn && f.pov_character_id === id ? null : f.pov_character_id,
      }
    })

  const togglePov = (id: string) =>
    set('pov_character_id', form.pov_character_id === id ? null : id)

  const handleSaveNewCharacter = async (input: CharacterInput & { id?: string }) => {
    prevCharIds.current = project.characters.map((c) => c.id)
    setAwaitingNewChar(true)
    setShowNewCharacter(false)
    await onSaveCharacter(input)
  }

  const handleSaveNewLocation = async (input: LocationInput & { id?: string }) => {
    prevLocIds.current = project.locations.map((l) => l.id)
    setAwaitingNewLoc(true)
    setShowNewLocation(false)
    await onSaveLocation(input)
  }

  return (
    <>
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
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-gray-500">LOCATION</span>
                <button
                  type="button"
                  onClick={() => setShowNewLocation(true)}
                  className="cursor-pointer text-[11px] font-medium text-gray-400 hover:text-ink"
                >
                  + New
                </button>
              </div>
              <Select
                value={form.location_id ?? ''}
                onChange={(e) => set('location_id', e.target.value || null)}
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
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-gray-500">CHARACTERS IN SCENE</span>
              <button
                type="button"
                onClick={() => setShowNewCharacter(true)}
                className="cursor-pointer text-[11px] font-medium text-gray-400 hover:text-ink"
              >
                + New
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.characters.map((c) => {
                const on = form.character_ids.includes(c.id)
                const isPov = form.pov_character_id === c.id
                return (
                  <div
                    key={c.id}
                    className="flex items-center overflow-hidden rounded-full transition-all"
                    style={{
                      background: on ? `${c.color}22` : 'transparent',
                      border: `1.5px solid ${isPov ? c.color : on ? `${c.color}88` : '#e5e7eb'}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleChar(c.id)}
                      className="flex cursor-pointer items-center gap-1.5 py-1 pl-2 pr-2.5"
                    >
                      <div
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
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
                    {on && (
                      <button
                        type="button"
                        onClick={() => togglePov(c.id)}
                        title={isPov ? 'Remove POV' : 'Set as POV character'}
                        className="flex cursor-pointer items-center border-l pr-2 pl-1.5 py-1 text-[12px] transition-opacity"
                        style={{
                          borderColor: `${c.color}44`,
                          color: isPov ? c.color : '#9ca3af',
                          opacity: isPov ? 1 : 0.7,
                        }}
                      >
                        👁
                      </button>
                    )}
                  </div>
                )
              })}
              {project.characters.length === 0 && (
                <span className="text-xs text-gray-400">
                  No characters yet — click &quot;+ New&quot; to add one
                </span>
              )}
            </div>
            {form.pov_character_id && (
              <p className="mt-1 text-[11px] text-gray-400">
                👁 POV character — the scene is written from their perspective
              </p>
            )}
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

      {showNewCharacter && (
        <CharacterModal
          character={{}}
          colorIndex={project.characters.length}
          onSave={handleSaveNewCharacter}
          onDelete={() => {}}
          onClose={() => setShowNewCharacter(false)}
        />
      )}

      {showNewLocation && (
        <LocationModal
          location={{}}
          colorIndex={project.locations.length}
          onSave={handleSaveNewLocation}
          onDelete={() => {}}
          onClose={() => setShowNewLocation(false)}
        />
      )}
    </>
  )
}
