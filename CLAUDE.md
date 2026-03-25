# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (also type-checks and lints)
npm run lint     # ESLint check only
```

No test suite is configured. The build (`npm run build`) is the primary correctness check — it runs TypeScript type-checking and ESLint as part of Next.js compilation. Always run it after making changes.

To force a Vercel redeploy without code changes:
```bash
git commit --allow-empty -m "chore: redeploy" && git push
```

## Architecture

**Mapa Farem** is a Next.js 14 (App Router) Czech farm directory with an interactive Mapbox map, written in TypeScript with Tailwind CSS.

### Data layer (`src/lib/farms.ts`)

All server-side farm data access goes through four functions: `getAllFarms()`, `getFarmBySlug()`, `getAllSlugs()`, `getFarmMapMarkers()`. Each tries Supabase first and silently falls back to `src/data/farms.json` when env vars are absent. The JSON file is the seed/fallback — the app is fully functional without Supabase.

`src/lib/supabase.ts` exports `getSupabaseClient()` (new client each call) and `getSupabaseClientSingleton()` (for client-side use). Both return `null` when env vars are missing.

`src/data/mockData.ts` holds static data used by pages that don't have a Supabase table yet: featured farms for the homepage, blog articles, seasonal calendar data, and kraj metadata.

### Filter logic — keep in sync

Filter logic is **duplicated** in two places and must be kept in sync when adding new filter fields:
- `src/store/farmStore.ts` → `getFilteredFarms()` — used client-side in MapSearchPage (no `openNow` support)
- `src/lib/farms.ts` → `filterFarms()` — used server-side and in API routes (has `openNow` support)

### State management

Two Zustand stores (no persistence — in-memory only):
- `src/store/farmStore.ts` — `selectedFarmId`, `hoveredFarmId`, and `filters` (`FarmFilters`). The map and sidebar both read from this store to stay in sync.
- `src/store/compareStore.ts` — `compareIds[]` (max 3 farms). `CompareBar` reads it and links to `/porovnat?ids=...`.

Three localStorage hooks (SSR-safe: hydrate via `useEffect` after mount):
- `src/hooks/useFavoriteFarms.ts` — key `mf_favorites`
- `src/hooks/useBedynka.ts` — key `mf_bedynka`, item ids are `farmSlug__productId`
- `src/hooks/useRecentFarms.ts` — key `mf_recent_farms`, max 6 entries, written on every farm detail page visit

### Map rendering

`MapView` (`src/components/map/MapView.tsx`) is always loaded via `dynamic(..., { ssr: false })` inside `MapViewWrapper` — never import it directly. It owns the Mapbox GL instance, renders cluster circles as native GL layers, and mounts individual `FarmMarker` components via `createRoot` into map DOM elements.

The Mapbox token (`NEXT_PUBLIC_MAPBOX_TOKEN`) is inlined at **build time** — changing it in Vercel requires a fresh build (clear cache + new commit).

### RSC boundary constraint

`AnimatedSection` (`src/components/ui/AnimatedSection.tsx`) is a `'use client'` component. **Do not pass complex server-rendered JSX trees through it** — event handlers and client components cannot cross the RSC boundary via `children`. For content-heavy pages, render content inside a dedicated `'use client'` component or use plain `<section>` elements instead of `AnimatedSection`.

### Route structure

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Homepage sections from mockData + Supabase |
| `/mapa` | Dynamic (ISR 5 min) | Split panel: `MapSearchPage` client component + Mapbox. Accepts `?kraj=` and `?q=` query params |
| `/farmy/[slug]` | SSG | Generated from all slugs at build time |
| `/blog` | Static | Article grid from mockData |
| `/blog/[slug]` | SSG | Article content rendered client-side in `ArticleContent` |
| `/kraje` | Static | 14 region cards → `/mapa?kraj=...` |
| `/oblibene` | Static shell | Content from `useFavoriteFarms` localStorage hook |
| `/bedynka` | Static shell | Content from `useBedynka` localStorage hook |
| `/porovnat` | Dynamic | Accepts `?ids=` (comma-separated), fetches matching farms server-side |
| `/sezona` | Static | `SeasonalCalendarClient` with mockData calendar |
| `/o-projektu` | Static | Static content |
| `/pridat-farmu` | Static shell | 5-step `AddFarmForm` client component with localStorage draft save |
| `/api/search` | Dynamic | GET `?q=` — searches farm name/city/description, returns max 5 results |
| `/api/newsletter` | Dynamic | POST `{ email }` — inserts into Supabase `subscribers` table, falls back to no-op |

### Key environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL — inlined at build time |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

All three are optional — the app falls back gracefully when missing.

### Vercel deployment

Vercel project: **`mapafarem`** (under `lpapaxs-projects`), GitHub repo `lpapax/MAPA`. There is a separate project called `mapa` — env vars must be set in `mapafarem`, not `mapa`.

```bash
npx vercel link       # link local repo to correct project
npx vercel env ls     # list env vars
npx vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production
```

### Design system

Tailwind with custom tokens defined in `tailwind.config.ts`: `primary-*` (green scale), `forest` (dark green), `surface`, `border`, `muted-foreground`, `shadow-card`, `shadow-glow`, `glass`, `bg-newsletter`. Use these tokens rather than raw Tailwind colors for consistency. The `cn()` utility from `src/lib/utils.ts` merges class names (clsx + tailwind-merge).
