import { Link } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'

interface ConceptProps {
  title: string
  children: React.ReactNode
}

function Concept({ title, children }: ConceptProps) {
  return (
    <section className="rounded-2xl border-[1.5px] border-gray-200 bg-white p-6">
      <h2 className="mb-2 font-serif text-lg font-semibold text-ink">{title}</h2>
      <div className="text-sm leading-relaxed text-gray-600">{children}</div>
    </section>
  )
}

export function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="mx-auto max-w-[800px] px-8 py-9">
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-2xl font-bold text-ink">
            Getting started with Loom
          </h1>
          <p className="text-sm leading-relaxed text-gray-500">
            Loom is a creative writing planner for fiction. It helps you outline a
            story by connecting scenes, characters, and locations — so you can see
            how your plot fits together before or while you draft.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border-[1.5px] border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-ink">
            How the pieces fit together
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Everything lives inside a <strong className="font-medium text-ink">project</strong>{' '}
              — one novel, novella, or story you are planning.
            </p>
            <div className="rounded-xl bg-gray-50 px-4 py-3 font-mono text-xs leading-relaxed text-gray-600">
              <div>Project</div>
              <div className="pl-4">├── Scenes (ordered timeline)</div>
              <div className="pl-4">├── Characters (cast + arcs)</div>
              <div className="pl-4">└── Locations (places)</div>
              <div className="mt-2 pl-4">Scene links to → Location, Characters, Arc events</div>
            </div>
            <p>
              Scenes sit on a <strong className="font-medium text-ink">timeline</strong> in
              the order they appear in your story. Each scene can reference a{' '}
              <strong className="font-medium text-ink">location</strong>, the{' '}
              <strong className="font-medium text-ink">characters</strong> who appear in it,
              and optional <strong className="font-medium text-ink">arc events</strong> that
              mark character development at that moment.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Concept title="Projects">
            <p className="mb-3">
              A project is your story workspace. Give it a title, genre, and synopsis,
              and optionally set a target word count to track progress across all scenes.
            </p>
            <p>
              From the dashboard, open any project to work on its timeline, characters,
              and locations. Use the gear icon in the project header to edit settings
              later.
            </p>
          </Concept>

          <Concept title="Scenes">
            <p className="mb-3">
              Scenes are the building blocks of your plot. Each scene has a title, a
              short summary of what happens, and an optional word count for draft
              progress.
            </p>
            <p className="mb-3">
              On the <strong className="font-medium text-ink">Timeline</strong> tab, scenes
              appear in story order. Drag the numbered handles to reorder them. Click a
              scene card to edit it in the side panel.
            </p>
            <p>
              When editing a scene, you can pick a location, toggle which characters
              appear, and mark one character as the{' '}
              <strong className="font-medium text-ink">POV</strong> (point-of-view) —
              the perspective the scene is written from.
            </p>
          </Concept>

          <Concept title="Characters">
            <p className="mb-3">
              Characters are the people in your story. For each one you can record a
              role, traits, pronouns, relationships, and a summary of who they are.
            </p>
            <p className="mb-3">
              On the <strong className="font-medium text-ink">Characters</strong> tab, click
              a character to edit their profile. Expand a row to see which scenes they
              appear in.
            </p>
            <p>
              You can also create characters inline while editing a scene — useful when
              a new face appears mid-outline.
            </p>
          </Concept>

          <Concept title="Character arcs">
            <p className="mb-3">
              A character arc describes how someone changes over the course of the
              story. In a character&apos;s editor, add an arc title, summary, and a
              ordered list of <strong className="font-medium text-ink">beats</strong> —
              milestones like &ldquo;learns to trust others&rdquo; or &ldquo;faces their
              fear.&rdquo;
            </p>
            <p>
              Arcs are optional, but they become useful when you log{' '}
              <strong className="font-medium text-ink">arc events</strong> on scenes (see
              below).
            </p>
          </Concept>

          <Concept title="Locations">
            <p className="mb-3">
              Locations are the places where scenes happen — cities, rooms, ships, forests,
              and so on. Each has a name, color, and summary describing its atmosphere
              or significance.
            </p>
            <p>
              Assign a location when editing a scene. Like characters, you can create a
              new location on the fly from the scene editor if one comes up while you
              are outlining.
            </p>
          </Concept>

          <Concept title="Arc events">
            <p className="mb-3">
              Arc events connect a scene to a character&apos;s development. When editing
              a scene, open the arc events section to log what happens for a character
              at that point — either by picking one of their arc beats or writing a
              custom note.
            </p>
            <p>
              Arc events show up as tags on scene cards, making it easy to see where
              key turning points land on your timeline.
            </p>
          </Concept>

          <Concept title="A typical workflow">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Create a project with a working title and synopsis.</li>
              <li>Add your main characters and a few core locations.</li>
              <li>Outline scenes on the timeline — start rough, refine later.</li>
              <li>Link each scene to its location and cast; set POV where it matters.</li>
              <li>Add character arcs and log arc events as the emotional shape emerges.</li>
              <li>Track word counts per scene and toward your project target.</li>
            </ol>
          </Concept>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Ready to start?{' '}
          <Link to="/" className="text-ink underline hover:no-underline">
            Back to your projects
          </Link>
        </p>
      </div>
    </div>
  )
}
