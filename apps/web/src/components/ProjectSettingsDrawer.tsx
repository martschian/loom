import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Input, Label, Textarea } from '@/components/ui/FormField'
import type { ProjectSettingsInput, ProjectWithRelations } from '@/lib/types'

interface ProjectSettingsDrawerProps {
  project: ProjectWithRelations
  onSave: (settings: ProjectSettingsInput) => void
  onClose: () => void
}

export function ProjectSettingsDrawer({
  project,
  onSave,
  onClose,
}: ProjectSettingsDrawerProps) {
  const [title, setTitle] = useState(project.title)
  const [genre, setGenre] = useState(project.genre || '')
  const [synopsis, setSynopsis] = useState(project.synopsis || '')
  const [targetWordCount, setTargetWordCount] = useState(
    project.target_word_count?.toString() || '',
  )

  return (
    <Drawer title="Project settings" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <Label>PROJECT TITLE</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>GENRE</Label>
          <Input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Fantasy, Thriller, Romance..."
          />
        </div>
        <div>
          <Label>SYNOPSIS</Label>
          <Textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
        </div>
        <div>
          <Label>TARGET WORD COUNT</Label>
          <Input
            type="number"
            value={targetWordCount}
            onChange={(e) => setTargetWordCount(e.target.value)}
            placeholder="e.g. 80000"
          />
          <p className="mt-1 text-xs text-gray-400">
            Leave blank to hide the progress bar.
          </p>
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                title,
                genre,
                synopsis,
                target_word_count: parseInt(targetWordCount) || null,
              })
            }
          >
            Save settings
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
