import { useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { getSceneAccentColor } from '@/lib/scene-utils'
import type { ProjectWithRelations, Scene } from '@/lib/types'

interface SceneCardProps {
  scene: Scene
  project: ProjectWithRelations
  onClick: (scene: Scene) => void
  index: number
  isDragging?: boolean
  dragHandleRef?: (node: HTMLDivElement | null) => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function SceneCard({
  scene,
  project,
  onClick,
  index,
  isDragging,
  dragHandleRef,
  dragHandleProps,
}: SceneCardProps) {
  const [hovered, setHovered] = useState(false)
  const loc = project.locations.find((l) => l.id === scene.location_id)
  const chars = project.characters.filter((c) =>
    scene.character_ids.includes(c.id),
  )
  const accentColor = getSceneAccentColor(scene, project)
  const visibleMoments = scene.moments.slice(0, 2)
  const extraMoments = scene.moments.length - visibleMoments.length

  return (
    <div className="relative flex" style={{ opacity: isDragging ? 0.4 : 1 }}>
      <div className="flex w-10 shrink-0 flex-col items-center">
        <div
          ref={dragHandleRef}
          className={`z-[1] flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full text-[11px] font-bold text-white ${dragHandleRef ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{ background: accentColor }}
          title={dragHandleRef ? 'Drag to reorder' : undefined}
          {...dragHandleProps}
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
          borderColor: hovered ? accentColor : '#e5e7eb',
          boxShadow: hovered ? `0 4px 16px ${accentColor}22` : 'none',
        }}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">
            {scene.title}
          </h3>
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
          {visibleMoments.map((moment) => {
            const c = project.characters.find((ch) => ch.id === moment.character_id)
            if (!c) return null
            return (
              <Tag
                key={`${moment.character_id}-${moment.sort_order}-${moment.label}`}
                label={`${c.name}: ${moment.label}`}
                color={c.color}
              />
            )
          })}
          {extraMoments > 0 && (
            <span className="text-[11px] text-gray-400">+{extraMoments} more</span>
          )}
          {chars.map((c) => {
            const isPov = c.id === scene.pov_character_id
            const hasMoment = scene.moments.some((m) => m.character_id === c.id)
            if (hasMoment) return null
            return (
              <div
                key={c.id}
                className="flex items-center gap-1 rounded-full py-0.5 pl-1.5 pr-2.5"
                style={{
                  background: isPov ? `${c.color}28` : `${c.color}18`,
                  border: `${isPov ? '1.5px' : '1px'} solid ${isPov ? `${c.color}66` : `${c.color}33`}`,
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
                {isPov && (
                  <span
                    className="ml-0.5 text-[10px]"
                    title="POV character"
                    style={{ color: c.color }}
                  >
                    👁
                  </span>
                )}
              </div>
            )
          })}
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
