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
| `npm run test:e2e:install` | Install Playwright Chromium + OS deps (first-time setup) |
| `npm run test:ci` | Tests with coverage |

### Troubleshooting: `localStorage.clear is not a function`

On **Node.js 22+**, the official Windows/macOS installer may enable experimental web storage with an empty `--localstorage-file`. That defines a global `localStorage` without `clear()`, which overrides jsdom in Vitest and breaks tests.

Check your install:

```bash
node -e "console.log(typeof localStorage?.clear)"
```

Vitest handles this automatically via the setup polyfill in `apps/web/src/test/setup.ts` (no `NODE_OPTIONS` workaround required).

### Troubleshooting: tests hang on `not allowed in NODE_OPTIONS`

If you previously set `NODE_OPTIONS=--no-experimental-webstorage` on Windows (see older docs), **remove it** — current Node builds reject that flag in `NODE_OPTIONS`, so Vitest workers never start and tests appear to hang.

**Windows (PowerShell):**

```powershell
[System.Environment]::SetEnvironmentVariable('NODE_OPTIONS', $null, 'User')
```

**WSL / Linux shell:**

```bash
unset NODE_OPTIONS
```

Restart the terminal (and Cursor) afterward. Until it is removed, **every** `node`/`npm` command fails immediately with that error — not only tests.

### Troubleshooting: E2E tests on WSL / Linux

Playwright needs **browser binaries** and **system libraries**. CI installs both; locally you must do the same once.

**Symptoms:**
- `Executable doesn't exist at .../chromium_headless_shell-...` → browsers not installed
- `libnspr4.so: cannot open shared object file` → OS deps missing (common on fresh WSL)

**Fix (from repo root):**

```bash
npm run test:e2e:install
```

This runs `playwright install chromium --with-deps` (same as CI). On WSL/Linux it uses `sudo` to install packages like `libnspr4` via apt — enter your password when prompted.

If browsers are already installed but deps are still missing:

```bash
cd apps/web
sudo npx playwright install-deps chromium
```

Then run:

```bash
npm run test:e2e
```

E2E tests start a dev server automatically and run in localStorage mode (no Supabase required). Your `apps/web/.env.local` is ignored for e2e — the Playwright config clears Supabase env vars, same as CI.

If tests still show the sign-in page, stop any dev server already running on port 5173 (Playwright reuses it when `CI` is unset).

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

### Supabase free tier keepalive

Free Supabase projects pause when they lack sufficient database activity over a rolling 7-day window. Supabase’s current guidance is that **a few database requests per day** is typically required — pings every few days can still trigger the warning email even when each run succeeds. A scheduled GitHub Actions workflow (`.github/workflows/supabase-keepalive.yml`) pings your project **every 6 hours** (4× daily) to prevent that.

Add these **repository secrets** under GitHub → Settings → Secrets and variables → Actions (same values as the Vercel env vars):

| Secret | Value |
|--------|-------|
| `SUPABASE_URL` | Your project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Your **publishable** key (`sb_publishable_...`) or legacy **anon** key (`eyJ...`) from Supabase → Settings → API Keys |

Use the low-privilege publishable/anon key only — not the secret/service_role key. The workflow sends it via the `apikey` header (publishable keys must not be sent as `Authorization: Bearer`, or PostgREST returns 401).

After adding secrets, run the workflow manually once (Actions → Supabase keepalive → Run workflow) to confirm it succeeds.

## Project structure

```
loom/
├── apps/web/          # Vite React frontend
├── supabase/          # Migrations, config, seed
└── .github/workflows/ # CI pipeline
```
