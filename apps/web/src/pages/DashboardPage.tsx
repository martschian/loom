import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { NewProjectModal } from '@/components/NewProjectModal'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'

export function DashboardPage() {
  const { profile } = useAuth()
  const { projects, isLoading, createProject } = useProjects()
  const [showNewProject, setShowNewProject] = useState(false)
  const navigate = useNavigate()
  const displayName = profile?.display_name || 'Writer'

  if (isLoading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="mx-auto max-w-[900px] px-8 py-9">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              {displayName}&apos;s projects
            </h2>
            <p className="mt-1 text-[13px] text-gray-400">
              {projects.length}{' '}
              {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
          <Button onClick={() => setShowNewProject(true)}>+ New project</Button>
        </div>
        {projects.length === 0 && (
          <div className="px-6 py-20 text-center text-gray-400">
            <div className="mb-4 text-[40px]">✍️</div>
            <p className="mb-5 text-[15px]">
              No projects yet. Start your first story.
            </p>
            <Button onClick={() => setShowNewProject(true)}>
              Create a project
            </Button>
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={(proj) => navigate(`/projects/${proj.id}`)}
            />
          ))}
        </div>
      </div>
      {showNewProject && (
        <NewProjectModal
          onSave={async (input) => {
            const project = await createProject(input)
            setShowNewProject(false)
            navigate(`/projects/${project.id}`)
          }}
          onClose={() => setShowNewProject(false)}
        />
      )}
    </div>
  )
}
