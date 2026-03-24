# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured yet.

## Architecture

**Mapa Farem** is a Next.js 14 (App Router) directory of Czech farms with an interactive Mapbox map.

### Data layer (`src/lib/farms.ts`)

All data access goes through `getAllFarms()`, `getFarmBySlug()`, and `getFarmMapMarkers()`. These functions try Supabase first and fall back to `src/data/farms.json` when `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set. The JSON file is the seed/fallback data source.

### Map rendering

`MapView` (client component, loaded via `dynamic(..., { ssr: false })` in `MapViewWrapper`) owns the Mapbox GL instance. It renders cluster circles as native Mapbox layers and individual farm markers as DOM elements via `createRoot`. The Mapbox token (`NEXT_PUBLIC_MAPBOX_TOKEN`) is inlined at **build time** — changing it in Vercel requires a fresh build with cleared cache.

### State management

`src/store/farmStore.ts` — a single Zustand store holds `selectedFarmId`, `hoveredFarmId`, and `filters`. Filter logic is duplicated between `farmStore.ts` (client-side, synchronous) and `lib/farms.ts` (`filterFarms`, also used on server). Keep them in sync when adding new filter fields.

### Key environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL — inlined at build time |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

All three are optional — the app falls back to `src/data/farms.json` and hides the map gracefully when missing.

### Vercel deployment

The Vercel project is named **`mapafarem`** (under `lpapaxs-projects`), connected to GitHub repo `lpapax/MAPA`. There is also a separate project called `mapa` — env vars must be set in `mapafarem`, not `mapa`.

To manage env vars via CLI:
```bash
npx vercel link        # links local repo to the correct project
npx vercel env ls      # list env vars
npx vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production
```

`NEXT_PUBLIC_*` vars are inlined at build time. After adding/changing an env var in Vercel, a fresh build is required — push a new commit or use `git commit --allow-empty -m "chore: redeploy" && git push`.

### Route structure

- `/` — landing page with hero, featured farms, how-it-works sections
- `/mapa` — split-panel map + farm list (ISR, revalidates every 5 min)
- `/farmy/[slug]` — farm detail page
- `/blog`, `/pridat-farmu`, `/o-projektu` — placeholder pages
