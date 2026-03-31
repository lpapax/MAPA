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
npm run enrich-photos  # Scrape og:image from farm websites → updates farms-imported.json
npm run update-photos  # Push enriched photos/descriptions from farms-imported.json to Supabase
```

`import-farms` requires `GOOGLE_PLACES_API_KEY` in `.env.local`. It runs 30 region centers × 15 farm-type queries, saves progress after each query, and resumes from `scripts/output/farms-imported.json` on re-run. Output goes to `scripts/output/` (gitignored).

`seed-supabase` requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Inserts in batches of 100 using upsert on `slug`.

`enrich-photos` scrapes og:image and meta description from farm websites (20 concurrent, 6s timeout). Skips farms that already have real photos. Saves progress every 50 farms. Also outputs `scripts/output/enrich-photos.sql` for manual Supabase updates.

`update-photos` requires `SUPABASE_SERVICE_ROLE_KEY`. Updates `images` and `description` fields in batches of 50 for all farms in `farms-imported.json` that have real photos.

To force a Vercel redeploy without code changes:
```bash
git commit --allow-empty -m "chore: redeploy" && git push
```

## Architecture

**Mapa Farem** is a Next.js 14 (App Router) Czech farm directory with an interactive Mapbox map, written in TypeScript with Tailwind CSS.

### Data layer (`src/lib/farms.ts`)

All server-side farm data access goes through these functions: `getAllFarms()`, `getFarmBySlug()`, `getAllSlugs()`, `getFarmMapMarkers()`, `getHomepageFarms(limit)`, `getSimilarFarms(slug, kraj, limit)`, `getFarmsByIds(ids)`, `getFarmCountByKraj()`. Each tries Supabase first and silently falls back to `src/data/farms.json` when env vars are absent.

`getAllFarms()` paginates Supabase in chunks of 1000 rows. It selects specific columns only — **not `select('*')`** — to reduce payload: `id,slug,name,description,categories,lat,lng,city,kraj,opening_hours,images,verified,view_count`. The `contact`, `address`, `zip`, and `created_at` columns are intentionally omitted. Do not add `select('*')` back — it doubles the RSC payload size.

`getFarmsByIds(ids)` fetches a small set of farms by ID array using `select('*')` (includes `contact`). Used by `/porovnat` instead of `getAllFarms()` — never load all 4,009 farms to display 2–3.

`getFarmCountByKraj()` returns `Record<string, number>` by fetching only the `kraj` column. Used by `/kraje` — never load full farm objects just to count.

`getFarmMapMarkers()` calls `getAllFarms()` internally. The `/mapa` page derives markers from farms directly (not by calling both) to avoid a duplicate Supabase fetch.

`src/data/farms.json` contains ~4,009 real Czech farms. This is the fallback when Supabase is unavailable — it is not placeholder data. Farm photos (`images[]`) in this JSON may be stale — Supabase is the authoritative source for photos.

`src/lib/supabase.ts` exports three functions, all returning `null` when env vars are missing:
- `getSupabaseClient()` — new typed client per call (server components)
- `getSupabaseClientSingleton()` — cached typed client (client components, auth)
- `getSupabaseRaw()` — same singleton but typed as `createClient<any>`. **Use this** when writing to tables not yet in the `Database` type (`user_profiles`, `user_favorites`, `reviews`, `saved_searches`, `farm_claims`). Requires `// eslint-disable-next-line @typescript-eslint/no-explicit-any` and `as any` casts on `.upsert()`/`.insert()` calls.

`src/data/mockData.ts` holds static data for pages that don't have a Supabase table yet: featured farms (`MockFarm[]`), blog articles (`BlogArticle[]`), seasonal calendar, and kraj metadata. `MockFarm` intentionally has **no** `rating`, `reviewCount`, `distance`, or `quote` fields — do not add them back until there is real data.

### Supabase schema

Seven tables across five migration files (`supabase/migrations/`):

| Table | RLS | Notes |
|---|---|---|
| `farms` | public read, service_role write | `slug`, `kraj`, `categories` (GIN) indexes. Has `view_count INTEGER DEFAULT 0`. `images TEXT[]` stores og:image URLs scraped from farm websites. |
| `subscribers` | public insert, service_role read | Newsletter emails |
| `user_profiles` | owner only | Created automatically on `auth.users` insert via trigger. `display_name TEXT`. |
| `user_favorites` | owner only | `(user_id, farm_slug)` unique. Stores `farm_name`, `categories[]`, `kraj`. |
| `reviews` | public read, auth write | `farm_slug`, `rating SMALLINT (1–5)`, `display_name`, `city`, `text`. |
| `saved_searches` | owner only | `filters JSONB` — cast via `as unknown as FarmFilters` when reading. |
| `farm_claims` | owner only | Status: `pending | approved | rejected`. |

**Running migrations:** The Supabase direct DB connection is IPv6-only and unreachable from most local machines. Run migrations manually via the **Supabase SQL Editor**: `https://supabase.com/dashboard/project/eqrmwkyzllkpkuqhwswk/sql`. Apply files in numeric order.

An RPC function `increment_farm_view(farm_slug TEXT)` exists (migration 005) — called by `POST /api/farms/[slug]/view` to atomically increment `view_count`.

### Filter logic — keep in sync

Filter logic is **duplicated** in two places and must be kept in sync when adding new filter fields:
- `src/store/farmStore.ts` → `getFilteredFarms()` — used client-side in MapSearchPage (no `openNow` support)
- `src/lib/farms.ts` → `filterFarms()` — used server-side and in API routes (has `openNow` support)

### State management

Two Zustand stores (no persistence — in-memory only):
- `src/store/farmStore.ts` — `selectedFarmId`, `hoveredFarmId`, and `filters` (`FarmFilters`). The map and sidebar both read from this store to stay in sync.
- `src/store/compareStore.ts` — `compareIds[]` (max 3 farms). `CompareBar` reads it and links to `/porovnat?ids=...`.

localStorage hooks (SSR-safe: hydrate via `useEffect` after mount):
- `src/hooks/useFavoriteFarms.ts` — key `mf_favorites`
- `src/hooks/useBedynka.ts` — key `mf_bedynka`, item ids are `farmSlug__productId`; `totalItems` exposed for nav badge
- `src/hooks/useRecentFarms.ts` — key `mf_recent_farms`, max 6 entries
- `src/hooks/useRecentSearches.ts` — key `mf_recent_searches`, max 5 entries
- `src/hooks/useCookieConsent.ts` — key `mf_cookie_consent`, values `'accepted' | 'rejected'`. Returns `{ consent, accept, reject, showBanner }`. `showBanner` is only `true` after hydration when no stored decision exists — prevents SSR flash.

Browser API hook:
- `src/hooks/useGeolocation.ts` — uses `navigator.geolocation.watchPosition` (continuous tracking). Returns `{ lat, lng, error }`. SSR-safe; cleans up watcher on unmount.

Supabase-backed hooks (require auth):
- `src/hooks/useProfile.ts`, `useReviews.ts`, `useSavedSearches.ts`
- `src/lib/syncFavorites.ts` — merges `mf_favorites` localStorage into `user_favorites` table on login

### Auth

`src/contexts/AuthContext.tsx` — `AuthProvider` wraps the app (in `layout.tsx`). Exports `useAuth()` hook with `{ session, user, loading, signInWithMagicLink, signOut, deleteAccount }`.

Auth flow: magic link only (`signInWithOtp`). Callback lands at `/auth/callback` which exchanges the code and redirects to `/profil`. Delete account calls `DELETE /api/auth/delete-account` with `Authorization: Bearer <token>`.

### Cookie consent & GTM

`src/hooks/useCookieConsent.ts` — shared hook, reads/writes `mf_cookie_consent` in localStorage. Consent is `'pending' | 'accepted' | 'rejected'`.

`src/components/ui/CookieConsent.tsx` — GDPR banner, framer-motion slide-up from bottom-right. Shows only after hydration (`showBanner`). Has "Přijmout vše" and "Odmítnout volitelné" buttons. Mounted inside `ToastProvider` in `layout.tsx`.

`src/components/ui/GTMScript.tsx` — renders `next/script` with `strategy="afterInteractive"` **only when `consent === 'accepted'`**. GTM ID comes from `NEXT_PUBLIC_GTM_ID`. Returns `null` when env var is absent or consent not given — safe to have in layout even without GTM configured. GA4, Meta Pixel, and Google Ads conversion tags are configured inside the GTM dashboard, not in code.

### Map rendering

`MapView` (`src/components/map/MapView.tsx`) is always loaded via `dynamic(..., { ssr: false })` inside `MapViewWrapper` — never import it directly.

**All 4,009 farms are rendered as a single native Mapbox GL `circle` layer** — not as DOM markers. The architecture:
- GeoJSON source uses `promoteId: 'id'` so that `setFeatureState` works by farm ID string
- `selected` state → 13px radius, dark forest color, 3px stroke
- `hovered` state → 11px radius, primary green, 2px stroke
- Default fill: `match` expression keyed on primary category using `CATEGORY_META[cat].color`
- `selectedFarmId`/`hoveredFarmId` changes call `map.setFeatureState` — only the previous and new IDs are touched

**Two popups:**
- Hover popup (`farm-popup` class, `closeButton: false`) — shows farm name + emoji on mousemove, removed on mouseleave
- Click popup (`farm-click-popup` class, `closeButton: true`) — shown on farm pin click with name, category label, verified badge, and "Zobrazit detail farmy →" link. Closed by clicking the X or clicking empty map area. HTML content is XSS-escaped via an inline `esc()` function before insertion.

The Mapbox token (`NEXT_PUBLIC_MAPBOX_TOKEN`) is inlined at **build time** — changing it in Vercel requires a fresh build.

### Map sidebar pagination

`MapSearchPage` renders only the first `PAGE_SIZE = 50` filtered farms in the sidebar. Height is `h-[calc(100vh-64px)]` (navbar is `h-16 = 64px` — keep in sync if navbar height changes).

### RSC boundary constraint

`AnimatedSection` is a `'use client'` component. **Do not pass complex server-rendered JSX trees through it** — event handlers and client components cannot cross the RSC boundary via `children`. Use plain `<section>` elements for content-heavy server components instead.

`HomeFarmCards.tsx` was extracted from `HomeFeaturedFarms.tsx` for this exact reason.

### Animation

All framer-motion animations use shared presets from `src/lib/motionVariants.ts`:
- Spring presets: `SPRING_GENTLE` (200/30), `SPRING_BOUNCY` (400/20), `SPRING_STIFF` (600/35)
- Entry variants: `fadeUp`, `fadeIn`, `fadeLeft`, `fadeRight`, `scaleIn`
- Stagger containers: `staggerContainer` (0.1s children), `staggerContainerFast` (0.07s)
- Tab transitions: `tabSlide`

Import from here rather than redefining locally.

`AnimatedSection` uses `motion.div` + `whileInView` with `viewport={{ once: true, margin: '-80px 0px' }}`. The `direction` prop (`'up' | 'left' | 'right' | 'none'`) is fully functional. `delay` is in **milliseconds** and converted to seconds internally.

`AnimatedCounter` uses `useMotionValue` + framer-motion `animate()` with expo-out easing. The `duration` prop is in **seconds** (default 1.6).

`HeroSection` uses `staggerContainer` + `fadeUp` variants for staggered entrance of each text element. Trust bar animates separately with a 0.7s delay.

`CategoryFilter` uses `layoutId="category-pill"` on a `motion.span` — the green background pill slides smoothly between buttons on click.

`MapSearchPage.tsx` animates only the first 15 farm cards (`ANIMATE_THRESHOLD = 15`) to avoid performance issues with ~4,009 farms.

### OG image

`/api/og` (edge runtime) — generates a branded 1200×630 OG image using `next/og` (`ImageResponse`). Accepts optional `?title=` and `?subtitle=` query params. Used as default og:image in `layout.tsx` and as fallback on farm detail pages that have no real photo.

Farm detail pages (`/farmy/[slug]`) use the farm's first real photo as og:image when available; fall back to `/api/og?title=...&subtitle=...` with farm name and city/kraj.

### Images

`next/image` with `fill` is used for blog covers and the homepage hero. Any parent of a `fill` image must have `position: relative`. Allowed remote patterns in `next.config.mjs`: `*.supabase.co`, `**.mapafarem.cz`, `images.unsplash.com`.

**Farm photos** (`farm.images[]`) are displayed with plain `<img>` tags because domains are arbitrary and cannot all be whitelisted. Always use an intermediate variable when checking:

```typescript
// CORRECT
const img = farm.images?.[0] ?? ''
const photo = img.startsWith('http') && !img.includes('placeholder') ? img : null

// WRONG — second access is not guarded
farm.images?.[0]?.startsWith('http') && !farm.images[0].includes('placeholder')
```

### Route structure

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Homepage sections from mockData + Supabase |
| `/mapa` | Dynamic (ISR 5 min) | Split panel: `MapSearchPage` client component + Mapbox. Accepts `?kraj=` and `?q=` query params. Derives markers from farms in-page — does not call `getFarmMapMarkers()` separately. |
| `/farmy/[slug]` | Dynamic (on-demand) | `dynamicParams = true`, `generateStaticParams` returns `[]` — pages built on first visit and cached. |
| `/blog` | Static | Article grid from mockData |
| `/blog/[slug]` | SSG | Article content rendered client-side in `ArticleContent` |
| `/trhy` | Static | `MarketsClient` — 20 Czech farmers markets. Data is hardcoded (no Supabase table). `isDaily: true` flag shows "Otevřeno denně". |
| `/zebricek` | ISR (5 min) | `LeaderboardClient` — top-20 farms per tab. Sort: viewCount desc → verified first → `localeCompare('cs')`. |
| `/kraje` | Static | Uses `getFarmCountByKraj()` — not `getAllFarms()`. |
| `/oblibene` | Static shell | `useFavoriteFarms` localStorage hook |
| `/bedynka` | Static shell | `useBedynka` localStorage hook. In `MobileBottomNav` with item-count badge. |
| `/porovnat` | Dynamic | Uses `getFarmsByIds(ids)` — not `getAllFarms()`. |
| `/sezona` | Static | `SeasonalCalendarClient` with mockData calendar |
| `/o-projektu` | Static | Static content |
| `/pro-farmary` | Static | `PRICING` array has `soon: boolean` — renders "brzy" badge. Paid CTAs go to `/kontakt`. |
| `/pridat-farmu` | Static shell | 5-step `AddFarmForm` with localStorage draft save. |
| `/kontakt` | Static | `ContactForm` saves to `localStorage` key `mf_contact_messages` (no email backend yet) |
| `/pomoc` | Static | `HelpAccordion` with search input |
| `/podminky` | Static | Terms of service |
| `/soukromi` | Static | Privacy policy (GDPR) |
| `/cookies` | Static | Cookie policy |
| `/certifikace` | Static | Bio certification guide |
| `/prihlasit` | Static shell | Magic link login |
| `/auth/callback` | Dynamic | Exchanges Supabase auth code, redirects to `/profil` |
| `/profil` | Static shell | Requires auth |
| `/profil/recenze` | Static shell | Requires auth |
| `/profil/historie` | Static shell | `mf_recent_farms` localStorage |
| `/pro-farmary/narokovat` | Static shell | Requires auth; writes to `farm_claims` |
| `/api/og` | Edge | Branded OG image generation. Params: `?title=`, `?subtitle=` |
| `/api/search` | Dynamic | GET `?q=` — returns max 5 results |
| `/api/newsletter` | Dynamic | POST `{ email }` — inserts into `subscribers` |
| `/api/farms/[slug]/view` | Dynamic | POST — increments `view_count` via RPC |
| `/api/auth/delete-account` | Dynamic | DELETE with Bearer token |
| `/api/admin/check` | Dynamic | GET with Bearer token — returns `{ admin: true/false }`. Checks token against private `ADMIN_EMAIL` env var server-side. |
| `/admin` | Client shell | Dashboard — requires auth + admin email check via `/api/admin/check` |
| `/admin/farmy` | Client shell | Farm list with verify toggle, search, pagination (50/page) |
| `/admin/claimy` | Client shell | Farm claim requests — approve/reject |
| `/admin/odbery` | Client shell | Newsletter subscribers + CSV export |
| `/admin/recenze` | Client shell | All reviews — read and delete |

### Admin panel

`src/app/admin/layout.tsx` — client-side auth guard. On mount, calls `GET /api/admin/check` with the Supabase Bearer token. Redirects to `/prihlasit` if not logged in, to `/` if logged in but not admin. Shows spinner until check resolves.

`ADMIN_EMAIL` (private, no `NEXT_PUBLIC_` prefix) — only this email can access `/admin`. Checked server-side in `/api/admin/check` only — never exposed to the browser bundle. All admin data reads use `getSupabaseRaw()` with the anon key (RLS still applies for read operations).

### Key environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL — inlined at build time |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL — used in `metadataBase` and og:image fallback URLs |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (e.g. `GTM-XXXXXXX`). GTM is not loaded when this is absent or when user has not accepted cookies. |
| `ADMIN_EMAIL` | Private — email allowed to access `/admin`. Checked server-side only in `/api/admin/check`. No `NEXT_PUBLIC_` prefix. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role — server-side only |
| `GOOGLE_PLACES_API_KEY` | Google Places API — only for `import-farms` script |

### Vercel deployment

Vercel project: **`mapafarem`** (under `lpapaxs-projects`), GitHub repo `lpapax/MAPA`. There is a separate project called `mapa` — env vars must be set in `mapafarem`, not `mapa`.

```bash
npx vercel link       # link local repo to correct project
npx vercel env ls     # list env vars
npx vercel env add NEXT_PUBLIC_GTM_ID production
```

### Design system

Typography: `font-sans` = DM Sans, `font-heading` = Playfair Display. Both loaded via `next/font/google` in `layout.tsx` with `latin-ext` subset (required for Czech characters). Body background is warm parchment `#faf7f0`.

Custom Tailwind tokens in `tailwind.config.ts` — always prefer these over raw colors:

| Token | Value | Use for |
|---|---|---|
| `primary-*` | Muted green scale (`#4a8c3f` at 500) | CTAs, active states, category badges |
| `earth-*` | Warm amber scale | Stars, secondary accents |
| `cta` / `cta-dark` | Cyan `#0891B2` | Info/CTA variant |
| `forest` | `#1a4214` | Main headings, dark backgrounds |
| `surface` | `#faf7f0` | Section backgrounds (warm parchment) |
| `cream` | `#ffffff` | Card backgrounds |
| `neutral-*` | Warm neutral scale | Use instead of raw `gray-*` |
| `shadow-card` | subtle drop shadow | Default card |
| `shadow-card-hover` | green-tinted hover | Card on hover |

The `cn()` utility from `src/lib/utils.ts` merges class names (clsx + tailwind-merge).

`src/lib/geo.ts` — `haversineKm(lat1, lng1, lat2, lng2)` and `formatDistance(km)`.

`CATEGORY_META` in `src/lib/farms.ts` — maps every `FarmCategory` to `{ label, emoji, color }`. Used by map layer paint expressions, leaderboard badges, markets pills, and `SimilarFarms` sidebar.

**Icons:** Lucide React SVGs only — no emoji characters as decorative icons in JSX.

### Global UI components

`src/components/ui/Toast.tsx` — `ToastProvider` + `useToast()`. Call `useToast().show(message, type)` where `type` is `'success' | 'error' | 'info'`.

`src/components/ui/CookieConsent.tsx` — GDPR consent banner. Always rendered inside `layout.tsx`; uses `showBanner` from `useCookieConsent` to avoid SSR flash.

`src/components/ui/GTMScript.tsx` — conditionally loads GTM. Safe to leave in layout even without `NEXT_PUBLIC_GTM_ID` set.

`@vercel/analytics` — `<Analytics />` is mounted in `layout.tsx` just before `<ThemeProvider>`. Tracks page views automatically on Vercel. No configuration needed.

`src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx` — custom 404, error boundary, and skeleton loader.

### Farm detail tabs

`FarmDetailClient` has five tabs: O farmě, Produkty, Galerie, Recenze, Kontakt.

- **Produkty** — one card per farm category with "Do bedýnky" / "V bedýnce" toggle backed by `useBedynka`. No products table yet.
- **Recenze** — localStorage key `mf_reviews_${farm.slug}`. When authenticated, `useReviews` merges with Supabase `reviews` table. Do not seed fake reviews.
- **Galerie** — real images from `farm.images[]`; falls back to CSS gradient placeholders.

`FarmDetailClient` accepts `similarFarms?: Farm[]` — renders a "Similar farms" sidebar with up to 3 same-kraj farms.
