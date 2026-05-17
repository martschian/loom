import { useState } from 'react'
import { totalWordCount } from '@/lib/utils'
import type { ProjectWithRelations } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectWithRelations
  onClick: (project: ProjectWithRelations) => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const sceneCount = project.scenes.length
  const wordCount = totalWordCount(project.scenes)
  const updated = new Date(project.updated_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
  const target = project.target_word_count
  const pct = target
    ? Math.min(100, Math.round((wordCount / target) * 100))
    : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer rounded-[14px] border-[1.5px] bg-white p-5 transition-all"
      style={{
        borderColor: hovered ? '#1a1a2e' : '#e5e7eb',
        boxShadow: hovered ? '0 4px 20px rgba(26,26,46,0.1)' : 'none',
      }}
    >
      {project.genre && (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {project.genre}
        </div>
      )}
      <h3 className="mb-2 font-serif text-[17px] font-bold leading-snug text-ink">
        {project.title}
      </h3>
      {project.synopsis && (
        <p className="mb-3.5 line-clamp-2 text-[12.5px] leading-relaxed text-gray-500">
          {project.synopsis}
        </p>
      )}
      {pct !== null && target && (
        <div className="mb-3">
          <div className="h-[3px] overflow-hidden rounded-sm bg-gray-100">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${pct}%`,
                background: pct >= 100 ? '#10b981' : '#6366f1',
              }}
            />
          </div>
          <span className="mt-0.5 block text-[11px] text-gray-400">
            {wordCount.toLocaleString()} / {Number(target).toLocaleString()}{' '}
            words ({pct}%)
          </span>
        </div>
      )}
      <div className="flex gap-3 text-xs text-gray-400">
        <span>
          {sceneCount} {sceneCount === 1 ? 'scene' : 'scenes'}
        </span>
        {!target && wordCount > 0 && (
          <>
            <span>·</span>
            <span>{wordCount.toLocaleString()} words</span>
          </>
        )}
        <span className="ml-auto">Updated {updated}</span>
      </div>
    </div>
  )
}
