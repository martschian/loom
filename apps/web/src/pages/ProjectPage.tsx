import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProjectSettingsModal } from '@/components/ProjectSettingsModal'
import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { CharactersTab } from '@/pages/CharactersTab'
import { LocationsTab } from '@/pages/LocationsTab'
import { TimelineTab } from '@/pages/TimelineTab'
import { NAV_TABS } from '@/lib/constants'
import { useProject } from '@/hooks/useProject'
import { sortScenes, wordProgress } from '@/lib/utils'
import type { ProjectSettingsInput } from '@/lib/types'

export function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    project,
    isLoading,
    updateSettings,
    saveScene,
    deleteScene,
    reorderScenes,
    saveCharacter,
    deleteCharacter,
    saveLocation,
    deleteLocation,
  } = useProject(id!)
  const [activeTab, setActiveTab] =
    useState<(typeof NAV_TABS)[number]['id']>('timeline')
  const [showSettings, setShowSettings] = useState(false)

  if (isLoading) return <LoadingScreen />
  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Project not found.</p>
        <Link to="/" className="text-ink underline">
          Back to projects
        </Link>
      </div>
    )
  }

  const scenes = sortScenes(project.scenes)
  const { pct, display } = wordProgress(
    project.scenes,
    project.target_word_count,
  )
  const target = project.target_word_count

  const handleSaveSettings = async (settings: ProjectSettingsInput) => {
    await updateSettings(settings)
    setShowSettings(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-ink px-8 text-white">
        <div className="mx-auto max-w-[800px] pb-0 pt-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-4 flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13px] text-gray-400"
          >
            ← Back to projects
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="mb-1 font-serif text-[26px] font-bold text-white">
                {project.title}
              </h1>
              {project.genre && (
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  {project.genre}
                </span>
              )}
              {project.synopsis && (
                <p className="mt-2.5 max-w-[500px] text-sm leading-relaxed text-gray-300">
                  {project.synopsis}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              className="shrink-0 border-gray-700 text-gray-400"
              onClick={() => setShowSettings(true)}
            >
              Settings
            </Button>
          </div>

          <div className="mt-5 flex gap-7 border-t border-gray-700 pt-4">
            {[
              { label: 'Scenes', value: scenes.length },
              { label: 'Characters', value: project.characters.length },
              { label: 'Locations', value: project.locations.length },
              {
                label: target ? 'Words / Target' : 'Total words',
                value: display,
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-lg font-bold text-white">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-gray-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {pct !== null && (
            <div className="mt-3.5 pb-0.5">
              <div className="h-1 overflow-hidden rounded-sm bg-gray-700">
                <div
                  className="h-full rounded-sm transition-all duration-400"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 100 ? '#10b981' : '#6366f1',
                  }}
                />
              </div>
              <span className="mt-1 block text-[11px] text-gray-500">
                {pct}% of target
              </span>
            </div>
          )}

          <div className="mt-4 flex">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="cursor-pointer border-none bg-transparent px-[18px] py-2 text-sm transition-all"
                style={{
                  borderBottom:
                    activeTab === tab.id
                      ? '2px solid #fff'
                      : '2px solid transparent',
                  color: activeTab === tab.id ? '#fff' : '#6b7280',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'timeline' && (
        <TimelineTab
          project={project}
          onSaveScene={saveScene}
          onDeleteScene={deleteScene}
          onReorderScenes={reorderScenes}
          onSaveCharacter={saveCharacter}
          onSaveLocation={saveLocation}
        />
      )}
      {activeTab === 'characters' && (
        <CharactersTab
          project={project}
          onSaveCharacter={saveCharacter}
          onDeleteCharacter={deleteCharacter}
        />
      )}
      {activeTab === 'locations' && (
        <LocationsTab
          project={project}
          onSaveLocation={saveLocation}
          onDeleteLocation={deleteLocation}
        />
      )}

      {showSettings && (
        <ProjectSettingsModal
          project={project}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
