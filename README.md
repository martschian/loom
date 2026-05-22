# Loom

Creative writing project planner — manage fiction projects with scene timelines, characters, and locations.

## Stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Backend:** Supabase (Auth + Postgres with RLS)
- **Deploy:** Vercel (frontend) via Git integration
- **CI:** GitHub Actions

## Local development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional — app falls back to localStorage without it)
- Docker (required for local Supabase)

### Quick start (localStorage mode)

No Supabase needed — runs with in-browser demo data:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Full stack (Supabase)

```bash
# Start local Supabase (requires Docker)
supabase start

# Copy env vars
cp .env.example apps/web/.env.local
# Fill VITE_SUPABASE_ANON_KEY from: supabase status

npm install
npm run dev
```

Sign up at `/signup` to create an account. Migrations run automatically on `supabase start`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit + component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run test:ci` | Tests with coverage |

### Troubleshooting: `localStorage.clear is not a function`

On **Node.js 22+**, the official Windows/macOS installer may enable experimental web storage with an empty `--localstorage-file`. That defines a global `localStorage` without `clear()`, which overrides jsdom in Vitest and breaks tests.

Check your install:

```bash
node -e "console.log(typeof localStorage?.clear)"
```

If this prints `undefined` (not `function`), disable experimental web storage for your user account:

**Windows (PowerShell, persistent):**

```powershell
[System.Environment]::SetEnvironmentVariable('NODE_OPTIONS', '--no-experimental-webstorage', 'User')
```

Restart the terminal (and Cursor) afterward. Vitest also sets this flag for test workers in `apps/web/vitest.config.ts`; the setup polyfill in `apps/web/src/test/setup.ts` remains a fallback.

## Deployment

### Vercel

1. Connect the GitHub repo in the Vercel dashboard
2. Set root directory to `apps/web`
3. Add environment variables:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon key

### Supabase (production)

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Project structure

```
loom/
├── apps/web/          # Vite React frontend
├── supabase/          # Migrations, config, seed
└── .github/workflows/ # CI pipeline
```
