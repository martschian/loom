import { useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { MOOD_COLORS } from '@/lib/constants'
import type { Mood, ProjectWithRelations, Scene } from '@/lib/types'

interface SceneCardProps {
  scene: Scene
  project: ProjectWithRelations
  onClick: (scene: Scene) => void
  index: number
}

export function SceneCard({ scene, project, onClick, index }: SceneCardProps) {
  const [hovered, setHovered] = useState(false)
  const loc = project.locations.find((l) => l.id === scene.location_id)
  const chars = project.characters.filter((c) =>
    scene.character_ids.includes(c.id),
  )
  const moodColor =
    scene.mood && scene.mood in MOOD_COLORS
      ? MOOD_COLORS[scene.mood as Mood]
      : '#6b7280'

  return (
    <div className="relative flex">
      <div className="flex w-10 shrink-0 flex-col items-center">
        <div
          className="z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: moodColor }}
        >
          {index + 1}
        </div>
        <div className="min-h-5 w-0.5 flex-1 bg-gray-200" />
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(scene)}
        onKeyDown={(e) => e.key === 'Enter' && onClick(scene)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="mb-4 ml-2 flex-1 cursor-pointer rounded-xl border-[1.5px] bg-white p-3.5 transition-all"
        style={{
          borderColor: hovered ? moodColor : '#e5e7eb',
          boxShadow: hovered ? `0 4px 16px ${moodColor}22` : 'none',
        }}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">
            {scene.title}
          </h3>
          {scene.mood && <Tag label={scene.mood} color={moodColor} />}
        </div>
        {scene.summary && (
          <p className="mb-2.5 text-[13px] leading-relaxed text-gray-600">
            {scene.summary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2.5">
          {loc && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">📍</span>
              <Tag label={loc.name} color={loc.color} />
            </div>
          )}
          {chars.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-1 rounded-full py-0.5 pl-1.5 pr-2.5"
              style={{
                background: `${c.color}18`,
                border: `1px solid ${c.color}33`,
              }}
            >
              <div
                className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ background: c.color }}
              >
                {c.name[0]}
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: c.color }}
              >
                {c.name}
              </span>
            </div>
          ))}
          {scene.word_count > 0 && (
            <span className="ml-auto text-[11px] text-gray-400">
              {scene.word_count.toLocaleString()} words
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
