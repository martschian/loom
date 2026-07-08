import { useState } from 'react'
import { CharacterModal } from '@/components/CharacterModal'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { formatArcEventLabel, getSceneAccentColor } from '@/lib/scene-utils'
import { sortScenes } from '@/lib/utils'
import type { CharacterInput, ProjectWithRelations, Scene } from '@/lib/types'

interface CharactersTabProps {
  project: ProjectWithRelations
  onSaveCharacter: (input: CharacterInput & { id?: string }) => Promise<void>
  onDeleteCharacter: (id: string) => Promise<void>
}

export function CharactersTab({
  project,
  onSaveCharacter,
  onDeleteCharacter,
}: CharactersTabProps) {
  const [editing, setEditing] = useState<(typeof project.characters)[0] | null>(
    null,
  )
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="mx-auto max-w-[800px] px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">
          Characters
        </h2>
        <Button onClick={() => setShowNew(true)}>+ Add character</Button>
      </div>
      {project.characters.length === 0 && (
        <div className="px-6 py-16 text-center text-gray-400">
          <div className="mb-3 text-[32px]">👤</div>
          <p className="mb-5 text-[15px]">No characters yet. Add your first one.</p>
          <Button onClick={() => setShowNew(true)}>Add character</Button>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {project.characters.map((c) => {
          const scenes = sortScenes(
            project.scenes.filter((s) => s.character_ids.includes(c.id)),
          )
          return (
            <CharacterRow
              key={c.id}
              character={c}
              scenes={scenes}
              allScenes={project.scenes}
              project={project}
              onClick={() => setEditing(c)}
            />
          )
        })}
      </div>
      {editing && (
        <CharacterModal
          character={editing}
          colorIndex={project.characters.length}
          onSave={async (char) => {
            await onSaveCharacter(char)
            setEditing(null)
          }}
          onDelete={async (id) => {
            await onDeleteCharacter(id)
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {showNew && (
        <CharacterModal
          character={{}}
          colorIndex={project.characters.length}
          onSave={async (char) => {
            await onSaveCharacter(char)
            setShowNew(false)
          }}
          onDelete={() => {}}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  )
}

function CharacterRow({
  character: c,
  scenes,
  project,
  onClick,
}: {
  character: ProjectWithRelations['characters'][0]
  scenes: Scene[]
  allScenes: Scene[]
  project: ProjectWithRelations
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-xl border-[1.5px] bg-white transition-all"
      style={{
        borderColor: hovered ? c.color : '#e5e7eb',
        boxShadow: hovered ? `0 4px 16px ${c.color}22` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main card row */}
      <div className="flex items-start gap-4 p-4">
        {/* Avatar — click to edit */}
        <button
          type="button"
          onClick={onClick}
          className="mt-0.5 cursor-pointer rounded-full border-none p-0 outline-none"
          aria-label={`Edit ${c.name}`}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold text-white"
            style={{ background: c.color }}
          >
            {c.name[0]}
          </div>
        </button>

        {/* Main content — click to edit */}
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => e.key === 'Enter' && onClick()}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-serif text-[15px] font-semibold text-ink">
              {c.name}
            </h3>
            {c.pronouns && (
              <span className="text-[12px] text-gray-400">· {c.pronouns}</span>
            )}
            {c.role && <Tag label={c.role} color={c.color} />}
          </div>
          {c.summary ? (
            <p className="mb-1.5 text-[13px] leading-relaxed text-gray-600">
              {c.summary}
            </p>
          ) : (
            <p className="mb-1.5 text-[13px] italic text-gray-400">
              No summary yet — click to add one.
            </p>
          )}
          {(c.traits ?? []).length > 0 && (
            <div className="mb-1.5 flex flex-wrap items-center gap-1">
              {(c.traits ?? []).slice(0, 5).map((trait) => (
                <span
                  key={trait}
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={{
                    background: `${c.color}18`,
                    color: c.color,
                    border: `1px solid ${c.color}33`,
                  }}
                >
                  {trait}
                </span>
              ))}
              {(c.traits ?? []).length > 5 && (
                <span className="text-[11px] text-gray-400">
                  +{(c.traits ?? []).length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Chevron — expands scene list */}
        {scenes.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((v) => !v)
            }}
            className="flex shrink-0 cursor-pointer flex-col items-end gap-0.5 border-none bg-transparent p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={expanded ? 'Collapse scenes' : 'Expand scenes'}
            title={`${scenes.length} ${scenes.length === 1 ? 'scene' : 'scenes'}`}
          >
            <span className="text-[11px]">
              {scenes.length} {scenes.length === 1 ? 'scene' : 'scenes'}
            </span>
            <span
              className="text-[10px] transition-transform duration-200"
              style={{ display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▾
            </span>
          </button>
        )}
        {scenes.length === 0 && (
          <span className="shrink-0 pt-1 text-[11px] text-gray-400">
            0 scenes
          </span>
        )}
      </div>

      {/* Expanded scene list */}
      {expanded && scenes.length > 0 && (
        <div className="border-t border-gray-100 px-4 pb-3 pt-2">
          <ol className="flex flex-col gap-1.5">
            {scenes.map((scene) => {
              const accentColor = getSceneAccentColor(scene, project)
              const loc = project.locations.find(
                (l) => l.id === scene.location_id,
              )
              const charEvents = scene.arc_events.filter(
                (e) => e.character_id === c.id,
              )
              const globalOrder =
                project.scenes
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .findIndex((s) => s.id === scene.id) + 1

              return (
                <li
                  key={scene.id}
                  className="flex flex-col gap-0.5 rounded-lg px-2 py-1.5 text-[13px]"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: accentColor }}
                    >
                      {globalOrder}
                    </span>
                    <span className="font-medium text-ink">{scene.title}</span>
                    {loc && (
                      <span className="text-[11px] text-gray-400">
                        · {loc.name}
                      </span>
                    )}
                  </div>
                  {charEvents.map((e) => (
                    <span
                      key={e.id}
                      className="ml-7 text-[11px]"
                      style={{ color: c.color }}
                    >
                      {formatArcEventLabel(e, project)}
                    </span>
                  ))}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}
