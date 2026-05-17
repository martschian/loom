import { useState } from 'react'
import { LocationModal } from '@/components/LocationModal'
import { Button } from '@/components/ui/Button'
import type { LocationInput, ProjectWithRelations } from '@/lib/types'

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
          const sceneCount = project.scenes.filter(
            (s) => s.location_id === l.id,
          ).length
          return (
            <LocationRow
              key={l.id}
              location={l}
              sceneCount={sceneCount}
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
  sceneCount,
  onClick,
}: {
  location: ProjectWithRelations['locations'][0]
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
        borderColor: hovered ? l.color : '#e5e7eb',
        boxShadow: hovered ? `0 4px 16px ${l.color}22` : 'none',
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: `${l.color}22`,
          border: `2px solid ${l.color}44`,
        }}
      >
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: l.color }}
        />
      </div>
      <div className="min-w-0 flex-1">
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
        <span className="text-[11px] text-gray-400">
          Used in {sceneCount} {sceneCount === 1 ? 'scene' : 'scenes'}
        </span>
      </div>
    </div>
  )
}
