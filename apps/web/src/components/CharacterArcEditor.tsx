import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import type { CharacterArcInput } from '@/lib/types'

interface CharacterArcEditorProps {
  arc: CharacterArcInput | null
  onChange: (arc: CharacterArcInput | null) => void
}

const emptyArc = (): CharacterArcInput => ({
  title: '',
  summary: '',
  beats: [],
})

export function CharacterArcEditor({ arc, onChange }: CharacterArcEditorProps) {
  const value = arc ?? emptyArc()
  const [beatInput, setBeatInput] = useState('')

  const set = <K extends keyof CharacterArcInput>(k: K, v: CharacterArcInput[K]) =>
    onChange({ ...value, [k]: v })

  const addBeat = () => {
    const trimmed = beatInput.trim()
    if (!trimmed) return
    set('beats', [
      ...value.beats,
      { label: trimmed, sort_order: value.beats.length },
    ])
    setBeatInput('')
  }

  const removeBeat = (index: number) => {
    set(
      'beats',
      value.beats
        .filter((_, i) => i !== index)
        .map((b, i) => ({ ...b, sort_order: i })),
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3">
      <div>
        <Label>ARC TITLE</Label>
        <Input
          value={value.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. From coward to leader"
        />
      </div>
      <div>
        <Label>ARC SUMMARY</Label>
        <Textarea
          value={value.summary}
          onChange={(e) => set('summary', e.target.value)}
          placeholder="The overall change this character undergoes"
          className="min-h-[60px]"
        />
      </div>
      <div>
        <Label>ARC BEATS</Label>
        <p className="mb-1.5 text-[11px] text-gray-400">
          Ordered milestones along this arc (used when logging scene events)
        </p>
        <div className="mb-2 flex flex-col gap-1">
          {value.beats.map((beat, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px]"
            >
              <span>
                <span className="mr-2 text-[11px] text-gray-400">{index + 1}.</span>
                {beat.label}
              </span>
              <button
                type="button"
                onClick={() => removeBeat(index)}
                className="cursor-pointer text-gray-400 hover:text-red-500"
                aria-label="Remove beat"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={beatInput}
            onChange={(e) => setBeatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBeat())}
            placeholder="Add a milestone…"
            className="flex-1 text-[13px]"
          />
          <Button type="button" variant="secondary" onClick={addBeat} className="text-xs">
            Add
          </Button>
        </div>
      </div>
      {value.title.trim() && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="cursor-pointer self-start text-[11px] text-gray-400 hover:text-red-500"
        >
          Remove arc
        </button>
      )}
    </div>
  )
}
