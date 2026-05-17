import { useState } from 'react'
import { SceneCard } from '@/components/SceneCard'
import { SceneModal } from '@/components/SceneModal'
import { Button } from '@/components/ui/Button'
import { sortScenes } from '@/lib/utils'
import type { ProjectWithRelations, Scene, SceneInput } from '@/lib/types'

interface TimelineTabProps {
  project: ProjectWithRelations
  onSaveScene: (input: SceneInput & { id?: string }) => Promise<void>
  onDeleteScene: (id: string) => Promise<void>
}

export function TimelineTab({
  project,
  onSaveScene,
  onDeleteScene,
}: TimelineTabProps) {
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const [showNewScene, setShowNewScene] = useState(false)
  const scenes = sortScenes(project.scenes)

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
      {scenes.map((scene, i) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          project={project}
          onClick={setEditingScene}
          index={i}
        />
      ))}
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
        />
      )}
    </div>
  )
}
