import { useState } from 'react'
import { LocationModal } from '@/components/LocationModal'
import { Button } from '@/components/ui/Button'
import { getSceneAccentColor } from '@/lib/scene-utils'
import { sortScenes } from '@/lib/utils'
import type { LocationInput, ProjectWithRelations, Scene } from '@/lib/types'

interface LocationsTabProps {
  project: ProjectWithRelations
  onSaveLocation: (input: LocationInput & { id?: string }) => Promise<void>
  onDeleteLocation: (id: string) => Promise<void>
}

export function LocationsTab({
  project,
  onSaveLocation,
  onDeleteLocation,
}: LocationsTabProps) {
  const [editing, setEditing] = useState<(typeof project.locations)[0] | null>(
    null,
  )
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="mx-auto max-w-[800px] px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">
          Locations
        </h2>
        <Button onClick={() => setShowNew(true)}>+ Add location</Button>
      </div>
      {project.locations.length === 0 && (
        <div className="px-6 py-16 text-center text-gray-400">
          <div className="mb-3 text-[32px]">🗺️</div>
          <p className="mb-5 text-[15px]">No locations yet. Add your first one.</p>
          <Button onClick={() => setShowNew(true)}>Add location</Button>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {project.locations.map((l) => {
          const scenes = sortScenes(
            project.scenes.filter((s) => s.location_id === l.id),
          )
          return (
            <LocationRow
              key={l.id}
              location={l}
              scenes={scenes}
              project={project}
              onClick={() => setEditing(l)}
            />
          )
        })}
      </div>
      {editing && (
        <LocationModal
          location={editing}
          colorIndex={project.locations.length}
          onSave={async (loc) => {
            await onSaveLocation(loc)
            setEditing(null)
          }}
          onDelete={async (id) => {
            await onDeleteLocation(id)
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {showNew && (
        <LocationModal
          location={{}}
          colorIndex={project.locations.length}
          onSave={async (loc) => {
            await onSaveLocation(loc)
            setShowNew(false)
          }}
          onDelete={() => {}}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  )
}

function LocationRow({
  location: l,
  scenes,
  project,
  onClick,
}: {
  location: ProjectWithRelations['locations'][0]
  scenes: Scene[]
  project: ProjectWithRelations
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-xl border-[1.5px] bg-white transition-all"
      style={{
        borderColor: hovered ? l.color : '#e5e7eb',
        boxShadow: hovered ? `0 4px 16px ${l.color}22` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main card row */}
      <div className="flex items-start gap-4 p-4">
        {/* Color swatch — click to edit */}
        <button
          type="button"
          onClick={onClick}
          className="mt-0.5 cursor-pointer rounded-lg border-none p-0 outline-none"
          aria-label={`Edit ${l.name}`}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: `${l.color}22`,
              border: `2px solid ${l.color}44`,
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
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
          <h3 className="mb-1 font-serif text-[15px] font-semibold text-ink">
            {l.name}
          </h3>
          {l.summary ? (
            <p className="mb-1.5 text-[13px] leading-relaxed text-gray-600">
              {l.summary}
            </p>
          ) : (
            <p className="mb-1.5 text-[13px] italic text-gray-400">
              No summary yet — click to add one.
            </p>
          )}
        </div>

        {/* Chevron — expands scene list */}
        {scenes.length > 0 ? (
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
        ) : (
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
              const chars = project.characters.filter((c) =>
                scene.character_ids.includes(c.id),
              )
              const globalOrder =
                project.scenes
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .findIndex((s) => s.id === scene.id) + 1

              return (
                <li
                  key={scene.id}
                  className="flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-[13px]"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: accentColor }}
                  >
                    {globalOrder}
                  </span>
                  <span className="font-medium text-ink">{scene.title}</span>
                  {chars.length > 0 && (
                    <span className="text-[11px] text-gray-400">
                      · {chars.map((c) => c.name).join(', ')}
                    </span>
                  )}
                  {scene.arc_events.length > 0 && (
                    <span className="ml-auto shrink-0 text-[11px] text-gray-400">
                      {scene.arc_events.length}{' '}
                      {scene.arc_events.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}
