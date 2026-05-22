import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormField'
import type { ProjectWithRelations, SceneArcEventInput } from '@/lib/types'

const CUSTOM_BEAT = '__custom__'

interface SceneArcEventsEditorProps {
  events: SceneArcEventInput[]
  characterIds: string[]
  project: ProjectWithRelations
  onChange: (events: SceneArcEventInput[]) => void
}

export function SceneArcEventsEditor({
  events,
  characterIds,
  project,
  onChange,
}: SceneArcEventsEditorProps) {
  const cast = project.characters.filter((c) => characterIds.includes(c.id))

  const update = (index: number, patch: Partial<SceneArcEventInput>) => {
    onChange(events.map((e, i) => (i === index ? { ...e, ...patch } : e)))
  }

  const remove = (index: number) => {
    onChange(
      events
        .filter((_, i) => i !== index)
        .map((e, i) => ({ ...e, sort_order: i })),
    )
  }

  const add = () => {
    const defaultChar = cast[0]
    if (!defaultChar) return
    const firstBeat = defaultChar.arc?.beats[0]
    onChange([
      ...events,
      {
        character_id: defaultChar.id,
        beat_id: firstBeat?.id ?? null,
        note: '',
        sort_order: events.length,
      },
    ])
  }

  return (
    <div className="flex flex-col gap-2">
      {events.map((event, index) => {
        const char = project.characters.find((c) => c.id === event.character_id)
        const beats = char?.arc?.beats ?? []
        const selectValue = event.beat_id ?? CUSTOM_BEAT

        return (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
          >
            <div className="flex items-start gap-2">
              <Select
                value={event.character_id}
                onChange={(e) => {
                  const nextChar = project.characters.find((c) => c.id === e.target.value)
                  const firstBeat = nextChar?.arc?.beats[0]
                  update(index, {
                    character_id: e.target.value,
                    beat_id: firstBeat?.id ?? null,
                    note: '',
                  })
                }}
                className="w-[130px] shrink-0 text-xs"
              >
                {cast.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Select
                value={selectValue}
                onChange={(e) => {
                  const v = e.target.value
                  update(index, {
                    beat_id: v === CUSTOM_BEAT ? null : v,
                    note: v === CUSTOM_BEAT ? event.note : '',
                  })
                }}
                className="flex-1 text-xs"
              >
                {beats.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
                <option value={CUSTOM_BEAT}>Custom note</option>
              </Select>
              <button
                type="button"
                onClick={() => remove(index)}
                className="cursor-pointer px-1 text-lg leading-none text-gray-400 hover:text-red-500"
                aria-label="Remove arc event"
              >
                ×
              </button>
            </div>
            {selectValue === CUSTOM_BEAT && (
              <Input
                value={event.note}
                onChange={(e) => update(index, { note: e.target.value })}
                placeholder="Describe this arc event…"
                className="text-[13px]"
              />
            )}
          </div>
        )
      })}
      {cast.length === 0 ? (
        <p className="text-xs text-gray-400">
          Add characters to the scene before logging arc events.
        </p>
      ) : (
        <Button variant="secondary" type="button" onClick={add} className="self-start text-xs">
          + Arc event
        </Button>
      )}
    </div>
  )
}
