# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (also type-checks and lints)
npm run lint     # ESLint check only
```

No test suite is configured. The build (`npm run build`) is the primary correctness check — it runs TypeScript type-checking and ESLint as part of Next.js compilation. Always run it after making changes.

### Data import scripts

```bash
npm run import-farms   # Fetch Czech farms from Google Places API → scripts/output/
npm run merge-farms    # Merge scripts/output/farms-imported.json into src/data/farms.json
npm run seed-supabase  # Batch-insert src/data/farms.json into Supabase (service role key required)
```

`import-farms` requires `GOOGLE_PLACES_API_KEY` in `.env.local`. It runs 30 region centers × 15 farm-type queries, saves progress after each query, and resumes from `scripts/output/farms-imported.json` on re-run. Output goes to `scripts/output/` (gitignored).

`seed-supabase` requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Inserts in batches of 100 using upsert on `slug`.

To force a Vercel redeploy without code changes:
```bash
git commit --allow-empty -m "chore: redeploy" && git push
```

## Architecture

**Mapa Farem** is a Next.js 14 (App Router) Czech farm directory with an interactive Mapbox map, written in TypeScript with Tailwind CSS.

### Data layer (`src/lib/farms.ts`)

All server-side farm data access goes through four functions: `getAllFarms()`, `getFarmBySlug()`, `getAllSlugs()`, `getFarmMapMarkers()`. Each tries Supabase first and silently falls back to `src/data/farms.json` when env vars are absent.

`getAllFarms()` paginates Supabase in chunks of 1000 rows to handle the full dataset (currently ~3,960 farms). Do not replace this with a single `.select('*')` call — Supabase defaults to a 1000-row limit.

`src/data/farms.json` contains ~3,960 real Czech farms imported from Google Places API (filtered to the Czech Republic bounding box: lat 48.55–51.06, lng 12.09–18.86). This is the fallback when Supabase is unavailable — it is not placeholder data.

`src/lib/supabase.ts` exports `getSupabaseClient()` (new client each call) and `getSupabaseClientSingleton()` (for client-side use). Both return `null` when env vars are missing.

`src/data/mockData.ts` holds static data for pages that don't have a Supabase table yet: featured farms (`MockFarm[]`), blog articles (`BlogArticle[]`), seasonal calendar, and kraj metadata. Both `MockFarm` and `BlogArticle` have a `coverImage` field (Unsplash URL) used by `next/image` components — keep this in sync when extending those interfaces.

`MockFarm` intentionally has **no** `rating`, `reviewCount`, `distance`, or `quote` fields — these were removed to avoid fake social proof. Do not add them back until there is real data to populate them.

### Supabase schema

Two tables:
- `farms` — all farm data. RLS: public read, service_role write. Indexed on `slug`, `kraj`, and `categories` (GIN).
- `subscribers` — newsletter emails. RLS: public insert, service_role read.

Migrations are in `supabase/migrations/`. Run them in the Supabase SQL Editor in order.

### Filter logic — keep in sync

Filter logic is **duplicated** in two places and must be kept in sync when adding new filter fields:
- `src/store/farmStore.ts` → `getFilteredFarms()` — used client-side in MapSearchPage (no `openNow` support)
- `src/lib/farms.ts` → `filterFarms()` — used server-side and in API routes (has `openNow` support)

### State management

Two Zustand stores (no persistence — in-memory only):
- `src/store/farmStore.ts` — `selectedFarmId`, `hoveredFarmId`, and `filters` (`FarmFilters`). The map and sidebar both read from this store to stay in sync.
- `src/store/compareStore.ts` — `compareIds[]` (max 3 farms). `CompareBar` reads it and links to `/porovnat?ids=...`.

Four localStorage hooks (SSR-safe: hydrate via `useEffect` after mount):
- `src/hooks/useFavoriteFarms.ts` — key `mf_favorites`
- `src/hooks/useBedynka.ts` — key `mf_bedynka`, item ids are `farmSlug__productId`; `totalItems` is exposed for the nav badge
- `src/hooks/useRecentFarms.ts` — key `mf_recent_farms`, max 6 entries, written on every farm detail page visit
- Reviews are stored directly (not via a hook) under key `mf_reviews_${farm.slug}` inside `FarmDetailClient`

### Map rendering

`MapView` (`src/components/map/MapView.tsx`) is always loaded via `dynamic(..., { ssr: false })` inside `MapViewWrapper` — never import it directly. It owns the Mapbox GL instance, renders cluster circles as native GL layers, and mounts individual `FarmMarker` components via `createRoot` into map DOM elements.

The Mapbox token (`NEXT_PUBLIC_MAPBOX_TOKEN`) is inlined at **build time** — changing it in Vercel requires a fresh build (clear cache + new commit).

### RSC boundary constraint

`AnimatedSection` (`src/components/ui/AnimatedSection.tsx`) is a `'use client'` component that renders a `<div>` wrapper (not `<section>` — was changed to avoid polluting accessibility landmarks). **Do not pass complex server-rendered JSX trees through it** — event handlers and client components cannot cross the RSC boundary via `children`. For content-heavy pages, render content inside a dedicated `'use client'` component or use plain `<section>` elements instead of `AnimatedSection`.

### Images

`next/image` with `fill` is used throughout for farm covers, blog covers, and the hero background. Any parent of a `fill` image must have `position: relative` (and usually `overflow-hidden`). Allowed remote patterns in `next.config.mjs`: `*.supabase.co`, `**.mapafarem.cz`, and `images.unsplash.com` (for placeholder/design photos).

### Route structure

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Homepage sections from mockData + Supabase |
| `/mapa` | Dynamic (ISR 5 min) | Split panel: `MapSearchPage` client component + Mapbox. Accepts `?kraj=` and `?q=` query params |
| `/farmy/[slug]` | Dynamic (on-demand) | `dynamicParams = true`, `generateStaticParams` returns `[]` — pages built on first visit and cached. Cannot be SSG with ~3,960 farms. |
| `/blog` | Static | Article grid from mockData |
| `/blog/[slug]` | SSG | Article content rendered client-side in `ArticleContent` |
| `/kraje` | Static | 14 region cards → `/mapa?kraj=...` |
| `/oblibene` | Static shell | Content from `useFavoriteFarms` localStorage hook |
| `/bedynka` | Static shell | Content from `useBedynka` localStorage hook. In `MobileBottomNav` with item-count badge from `totalItems`. |
| `/porovnat` | Dynamic | Accepts `?ids=` (comma-separated), fetches matching farms server-side |
| `/sezona` | Static | `SeasonalCalendarClient` with mockData calendar |
| `/o-projektu` | Static | Static content |
| `/pro-farmary` | Static | Farmer landing page with pricing. `PRICING` array has `soon: boolean` on plan and individual features — `soon: true` renders a "brzy" badge. Paid tier CTAs go to `/kontakt`, not `/pridat-farmu`. |
| `/pridat-farmu` | Static shell | 5-step `AddFarmForm` client component with localStorage draft save. Not in the mobile bottom nav (replaced by `/bedynka`). |
| `/kontakt` | Static | `ContactForm` saves to `localStorage` key `mf_contact_messages` (no backend yet) |
| `/pomoc` | Static | `HelpAccordion` with search input |
| `/podminky` | Static | Terms of service |
| `/soukromi` | Static | Privacy policy (GDPR) |
| `/cookies` | Static | Cookie policy |
| `/certifikace` | Static | Bio certification guide |
| `/api/search` | Dynamic | GET `?q=` — searches farm name/city/description, returns max 5 results |
| `/api/newsletter` | Dynamic | POST `{ email }` — inserts into Supabase `subscribers` table, falls back to no-op |

### Key environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL — inlined at build time |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role — only for seeding scripts, never exposed to browser |
| `GOOGLE_PLACES_API_KEY` | Google Places API (New) — only for `import-farms` script |

The first three are set in Vercel production. The last two are local-only (`.env.local`).

### Vercel deployment

Vercel project: **`mapafarem`** (under `lpapaxs-projects`), GitHub repo `lpapax/MAPA`. There is a separate project called `mapa` — env vars must be set in `mapafarem`, not `mapa`.

```bash
npx vercel link       # link local repo to correct project
npx vercel env ls     # list env vars
npx vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production
```

### Design system

Typography: `font-sans` = Raleway, `font-heading` = Lora (serif). Imported from Google Fonts in `globals.css`. Body background is warm cream `#F4F1EC`.

Custom Tailwind tokens in `tailwind.config.ts` — always prefer these over raw colors:

| Token | Value | Use for |
|---|---|---|
| `primary-*` | Emerald green scale | CTAs, active states, category badges |
| `earth-*` | Warm amber scale | Stars, secondary accents, highlight badges |
| `cta` / `cta-dark` | Cyan `#0891B2` | Info/CTA variant |
| `forest` | `#064E3B` | Main headings, dark backgrounds |
| `surface` | `#F4F1EC` | Section backgrounds (warm cream) |
| `cream` | `#FDFCF9` | Card backgrounds, lightest surface |
| `shadow-card` | subtle drop shadow | Default card |
| `shadow-card-hover` | green-tinted hover | Card on hover |
| `shadow-card-earth` | amber-tinted | Earth-accented cards |
| `bg-hero-map` | radial gradient | Hero fallback background |
| `bg-newsletter` | green-to-cyan gradient | Newsletter section |
| `bg-warm-section` | cream gradient | Section dividers |

The `cn()` utility from `src/lib/utils.ts` merges class names (clsx + tailwind-merge).

**Icons:** use Lucide React SVGs only — no emoji characters as decorative icons anywhere in JSX. The `emoji` field on `KrajData` in `KRAJ_LIST` exists in the data type but is intentionally **not rendered** — the kraje page uses a `MapPin` icon instead.

### Global UI components

`src/components/ui/Toast.tsx` — `ToastProvider` + `useToast()` hook. `ToastProvider` is wrapped around the body in `src/app/layout.tsx`. Call `useToast().show(message, type)` from any client component; `type` is `'success' | 'error' | 'info'`.

`src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx` — custom 404, error boundary, and skeleton loader.

### Farm detail tabs

`FarmDetailClient` (`src/components/farms/FarmDetailClient.tsx`) has five tabs: O farmě, Produkty, Galerie, Recenze, Kontakt.

- **Produkty** — shows one card per farm category with a "Do bedýnky" / "V bedýnce" toggle backed by `useBedynka`. No Supabase products table yet; prices/availability are intentionally omitted.
- **Recenze** — reads from localStorage key `mf_reviews_${farm.slug}` (array of `StoredReview`), writes back on submission. No Supabase reviews table yet. Do not seed fake reviews.
- **Galerie** — renders CSS-masonry gradient placeholders. Replace with real images when available.

`FarmDetailPage` (`src/app/farmy/[slug]/page.tsx`) renders a `<script type="application/ld+json">` LocalBusiness JSON-LD block and a `FavoriteButton` (heart toggle, `src/components/farms/FavoriteButton.tsx`) alongside `ShareFarmButton` in the header.
