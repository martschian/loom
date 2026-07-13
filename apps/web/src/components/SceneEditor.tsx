import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Combobox } from '@/components/ui/Combobox'
import { Drawer } from '@/components/ui/Drawer'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import { InlineCreateField } from '@/components/ui/InlineCreateField'
import { SceneArcEventsEditor } from '@/components/SceneArcEventsEditor'
import { CHAR_COLORS, LOC_COLORS } from '@/lib/constants'
import type {
  CharacterInput,
  LocationInput,
  ProjectWithRelations,
  SceneArcEventInput,
  SceneInput,
} from '@/lib/types'

interface SceneEditorProps {
  scene: Partial<SceneInput> & { id?: string }
  project: ProjectWithRelations
  onSave: (scene: SceneInput & { id?: string }) => void
  onDelete: (id: string) => void
  onClose: () => void
  onSaveCharacter: (input: CharacterInput & { id?: string }) => Promise<void>
  onSaveLocation: (input: LocationInput & { id?: string }) => Promise<void>
}

export function SceneEditor({
  scene,
  project,
  onSave,
  onDelete,
  onClose,
  onSaveCharacter,
  onSaveLocation,
}: SceneEditorProps) {
  const isNew = !scene.id
  const [form, setForm] = useState<SceneInput>({
    title: scene.title || '',
    summary: scene.summary || '',
    location_id: scene.location_id ?? null,
    character_ids: scene.character_ids || [],
    word_count: scene.word_count || 0,
    pov_character_id: scene.pov_character_id ?? null,
    arc_events: (scene.arc_events ?? []).map((e, i) => ({
      character_id: e.character_id,
      beat_id: e.beat_id,
      note: e.note,
      sort_order: e.sort_order ?? i,
    })),
  })

  // Snapshots taken just before a quick-create, used to find the newly
  // created record once the project prop refreshes (saveCharacter/saveLocation
  // don't return the created id).
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
        arc_events: isOn
          ? f.arc_events.filter((e) => e.character_id !== id)
          : f.arc_events,
      }
    })

  const setArcEvents = (arc_events: SceneArcEventInput[]) =>
    setForm((f) => ({ ...f, arc_events }))

  const togglePov = (id: string) =>
    set('pov_character_id', form.pov_character_id === id ? null : id)

  const handleCreateCharacter = async (name: string) => {
    prevCharIds.current = project.characters.map((c) => c.id)
    setAwaitingNewChar(true)
    await onSaveCharacter({
      name,
      role: '',
      summary: '',
      color: CHAR_COLORS[project.characters.length % CHAR_COLORS.length],
      age: '',
      pronouns: '',
      relationships: '',
      traits: [],
      arc: null,
    })
  }

  const handleCreateLocation = async (name: string) => {
    prevLocIds.current = project.locations.map((l) => l.id)
    setAwaitingNewLoc(true)
    await onSaveLocation({
      name,
      summary: '',
      color: LOC_COLORS[project.locations.length % LOC_COLORS.length],
    })
  }

  return (
    <Drawer title={isNew ? 'New scene' : 'Edit scene'} onClose={onClose} width={520}>
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
        <div>
          <Label>LOCATION</Label>
          <Combobox
            options={project.locations.map((l) => ({ id: l.id, label: l.name, color: l.color }))}
            value={form.location_id}
            onChange={(id) => set('location_id', id)}
            onCreate={handleCreateLocation}
            placeholder="Search or create a location…"
            emptyLabel="No location"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-gray-500">CHARACTERS IN SCENE</span>
            <InlineCreateField onCreate={handleCreateCharacter} placeholder="Character name…" />
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
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-2xs font-bold text-white"
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
                      className="flex cursor-pointer items-center border-l pr-2 pl-1.5 py-1 text-xs transition-opacity"
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
                No characters yet — use &quot;+ New&quot; to add one
              </span>
            )}
          </div>
          {form.pov_character_id && (
            <p className="mt-1 text-2xs text-gray-400">
              👁 POV character — the scene is written from their perspective
            </p>
          )}
        </div>
        <div>
          <Label>ARC EVENTS</Label>
          <p className="mb-2 text-2xs text-gray-400">
            Tie scene beats to character arc milestones
          </p>
          <SceneArcEventsEditor
            events={form.arc_events}
            characterIds={form.character_ids}
            project={project}
            onChange={setArcEvents}
          />
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
    </Drawer>
  )
}
