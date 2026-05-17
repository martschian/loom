import { useState } from 'react'
import { CharacterModal } from '@/components/CharacterModal'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import type { CharacterInput, ProjectWithRelations } from '@/lib/types'

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
          const sceneCount = project.scenes.filter((s) =>
            s.character_ids.includes(c.id),
          ).length
          return (
            <CharacterRow
              key={c.id}
              character={c}
              sceneCount={sceneCount}
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
  sceneCount,
  onClick,
}: {
  character: ProjectWithRelations['characters'][0]
  sceneCount: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex cursor-pointer items-start gap-4 rounded-xl border-[1.5px] bg-white p-4 transition-all"
      style={{
        borderColor: hovered ? c.color : '#e5e7eb',
        boxShadow: hovered ? `0 4px 16px ${c.color}22` : 'none',
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold text-white"
        style={{ background: c.color }}
      >
        {c.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-serif text-[15px] font-semibold text-ink">
            {c.name}
          </h3>
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
        <span className="text-[11px] text-gray-400">
          Appears in {sceneCount} {sceneCount === 1 ? 'scene' : 'scenes'}
        </span>
      </div>
    </div>
  )
}
