import { useEffect, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SceneCard } from '@/components/SceneCard'
import { SceneModal } from '@/components/SceneModal'
import { Button } from '@/components/ui/Button'
import { sortScenes } from '@/lib/utils'
import type { CharacterInput, LocationInput, ProjectWithRelations, Scene, SceneInput } from '@/lib/types'

interface TimelineTabProps {
  project: ProjectWithRelations
  onSaveScene: (input: SceneInput & { id?: string }) => Promise<void>
  onDeleteScene: (id: string) => Promise<void>
  onReorderScenes: (orderedIds: string[]) => Promise<void>
  onSaveCharacter: (input: CharacterInput & { id?: string }) => Promise<void>
  onSaveLocation: (input: LocationInput & { id?: string }) => Promise<void>
}

interface SortableSceneCardProps {
  scene: Scene
  project: ProjectWithRelations
  onClick: (scene: Scene) => void
  index: number
}

function SortableSceneCard({
  scene,
  project,
  onClick,
  index,
}: SortableSceneCardProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      <SceneCard
        scene={scene}
        project={project}
        onClick={onClick}
        index={index}
        isDragging={isDragging}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...listeners, ...attributes } as React.HTMLAttributes<HTMLDivElement>}
      />
    </div>
  )
}

export function TimelineTab({
  project,
  onSaveScene,
  onDeleteScene,
  onReorderScenes,
  onSaveCharacter,
  onSaveLocation,
}: TimelineTabProps) {
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const [showNewScene, setShowNewScene] = useState(false)
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    sortScenes(project.scenes).map((s) => s.id),
  )

  useEffect(() => {
    setOrderedIds(sortScenes(project.scenes).map((s) => s.id))
  }, [project.scenes])

  const scenes = orderedIds
    .map((id) => project.scenes.find((s) => s.id === id))
    .filter((s): s is Scene => s !== undefined)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = orderedIds.indexOf(active.id as string)
    const newIndex = orderedIds.indexOf(over.id as string)
    const newOrder = arrayMove(orderedIds, oldIndex, newIndex)
    setOrderedIds(newOrder)
    await onReorderScenes(newOrder)
  }

  return (
    <div className="mx-auto max-w-[800px] px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">
          Scene timeline
        </h2>
        <Button onClick={() => setShowNewScene(true)}>+ Add scene</Button>
      </div>
      {scenes.length === 0 && (
        <div className="px-6 py-16 text-center text-gray-400">
          <div className="mb-3 text-[32px]">📝</div>
          <p className="text-[15px]">No scenes yet. Click &quot;Add scene&quot; to begin.</p>
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
          {scenes.map((scene, i) => (
            <SortableSceneCard
              key={scene.id}
              scene={scene}
              project={project}
              onClick={setEditingScene}
              index={i}
            />
          ))}
        </SortableContext>
      </DndContext>
      {scenes.length > 0 && (
        <div className="pl-12">
          <Button
            variant="secondary"
            className="text-[13px] text-gray-400"
            onClick={() => setShowNewScene(true)}
          >
            + Add another scene
          </Button>
        </div>
      )}
      {(editingScene || showNewScene) && (
        <SceneModal
          scene={
            editingScene
              ? {
                  id: editingScene.id,
                  title: editingScene.title,
                  summary: editingScene.summary,
                  location_id: editingScene.location_id,
                  mood: editingScene.mood,
                  word_count: editingScene.word_count,
                  character_ids: editingScene.character_ids,
                  pov_character_id: editingScene.pov_character_id,
                }
              : {}
          }
          project={project}
          onSave={async (scene) => {
            await onSaveScene(scene)
            setEditingScene(null)
            setShowNewScene(false)
          }}
          onDelete={async (id) => {
            await onDeleteScene(id)
            setEditingScene(null)
          }}
          onClose={() => {
            setEditingScene(null)
            setShowNewScene(false)
          }}
          onSaveCharacter={onSaveCharacter}
          onSaveLocation={onSaveLocation}
        />
      )}
    </div>
  )
}
