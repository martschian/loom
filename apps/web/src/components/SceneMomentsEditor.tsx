import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormField'
import type { ProjectWithRelations, SceneMomentInput } from '@/lib/types'

interface SceneMomentsEditorProps {
  moments: SceneMomentInput[]
  characterIds: string[]
  project: ProjectWithRelations
  onChange: (moments: SceneMomentInput[]) => void
}

export function SceneMomentsEditor({
  moments,
  characterIds,
  project,
  onChange,
}: SceneMomentsEditorProps) {
  const cast = project.characters.filter((c) => characterIds.includes(c.id))

  const update = (index: number, patch: Partial<SceneMomentInput>) => {
    onChange(
      moments.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    )
  }

  const remove = (index: number) => {
    onChange(
      moments
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, sort_order: i })),
    )
  }

  const add = () => {
    const defaultChar = cast[0]?.id ?? ''
    if (!defaultChar) return
    onChange([
      ...moments,
      { character_id: defaultChar, label: '', sort_order: moments.length },
    ])
  }

  return (
    <div className="flex flex-col gap-2">
      {moments.map((moment, index) => {
        return (
          <div
            key={index}
            className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
          >
            <Select
              value={moment.character_id}
              onChange={(e) => update(index, { character_id: e.target.value })}
              className="w-[130px] shrink-0 text-xs"
            >
              {cast.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Input
              value={moment.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder="What happens for this character?"
              className="flex-1 text-[13px]"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="cursor-pointer px-1 text-lg leading-none text-gray-400 hover:text-red-500"
              aria-label="Remove arc moment"
            >
              ×
            </button>
          </div>
        )
      })}
      {cast.length === 0 ? (
        <p className="text-xs text-gray-400">
          Add characters to the scene before recording arc moments.
        </p>
      ) : (
        <Button variant="secondary" type="button" onClick={add} className="self-start text-xs">
          + Arc moment
        </Button>
      )}
    </div>
  )
}
