# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (also type-checks and lints)
npm run lint     # ESLint check only
```

The build (`npm run build`) is the primary correctness check — it runs TypeScript type-checking and ESLint as part of Next.js compilation. Always run it after making changes.

### E2E tests (Playwright)

```bash
npx playwright test                          # Run all tests (Chromium, starts dev server automatically)
npx playwright test tests/mapafarem.spec.ts  # Run only the mapafarem tests
npx playwright test --ui                     # Interactive UI mode
npx playwright show-report                   # Open last HTML report
```

`playwright.config.ts` — Chromium only, screenshots always on, HTML + list reporters. `webServer` block starts `npm run dev` automatically when no server is already running on port 3000 (`reuseExistingServer: true`). Test screenshots land in `tests/screenshots/`.

### Data import scripts

```bash
npm run import-farms   # Fetch Czech farms from Google Places API → scripts/output/
npm run merge-farms    # Merge scripts/output/farms-imported.json into src/data/farms.json
npm run seed-supabase  # Batch-insert src/data/farms.json into Supabase (service role key required)
npm run enrich-photos  # Scrape og:image from farm websites → updates farms-imported.json
npm run update-photos  # Push enriched photos/descriptions from farms-imported.json to Supabase
npm run scrape-emails  # Scrape contact emails from farm websites → src/data/farms.json + scripts/output/
npm run send-outreach  # Send personalised outreach emails to farmers via Resend (requires RESEND_API_KEY + verified domain)
npm run send-outreach-dry  # Preview outreach emails without sending
npm run claw           # Start NanoClaw interactive Claude REPL (requires ANTHROPIC_API_KEY)
```

`import-farms` requires `GOOGLE_PLACES_API_KEY` in `.env.local`. It runs 30 region centers × 15 farm-type queries, saves progress after each query, and resumes from `scripts/output/farms-imported.json` on re-run. Output goes to `scripts/output/` (gitignored).

`seed-supabase` requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Inserts in batches of 100 using upsert on `slug`.

`enrich-photos` scrapes og:image and meta description from farm websites (20 concurrent, 6s timeout). Skips farms that already have real photos. Saves progress every 50 farms. Also outputs `scripts/output/enrich-photos.sql` for manual Supabase updates.

`update-photos` requires `SUPABASE_SERVICE_ROLE_KEY`. Updates `images` and `description` fields in batches of 50 for all farms in `farms-imported.json` that have real photos.

`scrape-emails` visits each farm's website (and `/kontakt`, `/contact`, `/o-nas` sub-pages) looking for `mailto:` links and plain-text email patterns. 15 concurrent, 7s timeout. Saves progress into `src/data/farms.json` and outputs `scripts/output/outreach-list.csv` (Mailchimp/Brevo-ready), `scripts/output/scrape-emails.sql` (Supabase UPDATE statements), and `scripts/output/farms-with-emails.json`. Skips farms that already have an email — safe to re-run.

`send-outreach` reads `scripts/output/outreach-list.csv` and sends personalised HTML emails via Resend. Requires `RESEND_API_KEY` in `.env.local` and `mapafarem.cz` verified in Resend → Domains. Progress (sent/failed per email address) is saved to `scripts/output/outreach-progress.json` — already-sent emails are never re-sent on resume. Use `--dry-run` to preview, `--limit N` to send only N emails.

To force a Vercel redeploy without code changes:
```bash
git commit --allow-empty -m "chore: redeploy" && git push
```

## Architecture

**Mapa Farem** is a Next.js 14 (App Router) Czech farm directory with an interactive Mapbox map, written in TypeScript with Tailwind CSS.

### Data layer (`src/lib/farms.ts`)

All server-side farm data access goes through these functions: `getAllFarms()`, `getFarmBySlug()`, `getAllSlugs()`, `getFarmMapMarkers()`, `getHomepageFarms(limit)`, `getSimilarFarms(slug, kraj, limit)`, `getFarmsByIds(ids)`, `getFarmCountByKraj()`. Each tries Supabase first and silently falls back to `src/data/farms.json` when env vars are absent.

`getAllFarms()` paginates Supabase in chunks of 1000 rows. It selects specific columns only — **not `select('*')`** — to reduce payload: `id,slug,name,description,categories,lat,lng,city,kraj,opening_hours,images,verified,view_count,bio,delivery,pick_your_own`. The `contact`, `address`, `zip`, and `created_at` columns are intentionally omitted. Do not add `select('*')` back — it doubles the RSC payload size.

`getFarmsByIds(ids)` fetches a small set of farms by ID array using `select('*')` (includes `contact`). Used by `/porovnat` instead of `getAllFarms()` — never load all 4,009 farms to display 2–3.

`getFarmCountByKraj()` returns `Record<string, number>` by fetching only the `kraj` column. Used by `/kraje` — never load full farm objects just to count.

`getFarmMapMarkers()` calls `getAllFarms()` internally. The `/mapa` page derives markers from farms directly (not by calling both) to avoid a duplicate Supabase fetch.

`src/data/farms.json` contains ~4,001 real Czech farms (8 fake hand-crafted demo farms were deleted; use `node scripts/clean-fake-farms.js` to re-run the cleanup if re-seeding). Auto-generated descriptions were nulled — farms with `description: null` have no copy yet. This is the fallback when Supabase is unavailable — it is not placeholder data. Farm photos (`images[]`) in this JSON may be stale — Supabase is the authoritative source for photos. `src/data/farms.backup.json` is the pre-cleanup snapshot — gitignore it if it exists.

`src/lib/supabase.ts` exports three functions, all returning `null` when env vars are missing:
- `getSupabaseClient()` — new typed client per call (server components)
- `getSupabaseClientSingleton()` — cached typed client (client components, auth)
- `getSupabaseRaw()` — same singleton but typed as `createClient<any>`. **Use this** when writing to tables not yet in the `Database` type (`user_profiles`, `user_favorites`, `reviews`, `saved_searches`, `farm_claims`). Requires `// eslint-disable-next-line @typescript-eslint/no-explicit-any` and `as any` casts on `.upsert()`/`.insert()` calls.

`src/data/mockData.ts` holds static data for pages that don't have a Supabase table yet: featured farms (`MockFarm[]`), blog articles (`BlogArticle[]`), seasonal calendar, and kraj metadata. `MockFarm` intentionally has **no** `rating`, `reviewCount`, `distance`, or `quote` fields — do not add them back until there is real data.

`KRAJ_LIST` entries have a `slug` field (e.g. `jihomoravsky`) used for `/kraje/[slug]` static params. If adding a new kraj, add both `code` (Czech diacritics, matches DB) and `slug` (URL-safe ASCII) fields.

### Supabase schema

Nine tables across ten migration files (`supabase/migrations/`):

| Table | RLS | Notes |
|---|---|---|
| `farms` | public read, service_role write | `slug`, `kraj`, `categories` (GIN) indexes. Has `view_count INTEGER DEFAULT 0`, `tier TEXT DEFAULT 'free'`, `bio BOOLEAN DEFAULT false`, `delivery BOOLEAN DEFAULT false`, `pick_your_own BOOLEAN DEFAULT false`. `images TEXT[]` stores og:image URLs scraped from farm websites. Partial indexes on `bio` and `delivery` WHERE = true (migration 010). |
| `subscribers` | public insert, service_role read | Newsletter emails |
| `user_profiles` | owner only | Created automatically on `auth.users` insert via trigger. `display_name TEXT`. |
| `user_favorites` | owner only | `(user_id, farm_slug)` unique. Stores `farm_name`, `categories[]`, `kraj`. |
| `reviews` | public read, auth write | `farm_slug`, `user_id UUID REFERENCES auth.users`, `rating SMALLINT (1–5)`, `display_name`, `city`, `text`. `user_id` used by `MyReviewsClient` to query reviews per user. |
| `saved_searches` | owner only | `filters JSONB` — cast via `as unknown as FarmFilters` when reading. |
| `farm_claims` | owner only | Status: `pending | approved | rejected`. |
| `subscriptions` | owner read, service_role write | Stripe subscription records. `tier TEXT`, `status TEXT`, `stripe_subscription_id` (unique), `current_period_end TIMESTAMPTZ`. Webhook handler in `/api/stripe/webhook` keeps this in sync with Stripe. |
| `articles` | public read (draft=false), service_role write | Blog CMS (migration 009). `slug` unique, `draft BOOLEAN`, `published_at TIMESTAMPTZ`. Admin UI at `/admin/blog`. |

**Running migrations:** The Supabase direct DB connection is IPv6-only and unreachable from most local machines. Run migrations manually via the **Supabase SQL Editor**: `https://supabase.com/dashboard/project/eqrmwkyzllkpkuqhwswk/sql`. Apply files in numeric order.

An RPC function `increment_farm_view(farm_slug TEXT)` exists (migration 005) — called by `POST /api/farms/[slug]/view` to atomically increment `view_count`.

### Filter logic — keep in sync

Filter logic is **duplicated** in two places and must be kept in sync when adding new filter fields:
- `src/store/farmStore.ts` → `getFilteredFarms()` — used client-side in MapSearchPage (no `openNow` support)
- `src/lib/farms.ts` → `filterFarms()` — used server-side and in API routes (has `openNow` support)

Current `FarmFilters` fields (all must be in both functions): `query`, `categories`, `kraj`, `openNow`, `verifiedOnly`, `hasPhotos`, `bioOnly`, `deliveryOnly`, `pickYourOwnOnly`.

### State management

Two Zustand stores (no persistence — in-memory only):
- `src/store/farmStore.ts` — `selectedFarmId`, `hoveredFarmId`, and `filters` (`FarmFilters`). The map and sidebar both read from this store to stay in sync.
- `src/store/compareStore.ts` — `compareIds[]` (max 3 farms). `CompareBar` reads it and links to `/porovnat?ids=...`.

localStorage hooks (SSR-safe: hydrate via `useEffect` after mount):
- `src/hooks/useUserPrefs.ts` — key `mf_prefs`. Stores `{ theme, radius, diet }`. `diet: DietPreference[]` where `DietPreference` is `'vegetarian' | 'vegan' | 'gluten-free' | 'lactose-free' | 'organic' | 'local' | 'carnivore' | 'pescatarian' | 'paleo' | 'keto'`. UI rendered in `ProfilClient.tsx` as toggle cards.
- `src/hooks/useFavoriteFarms.ts` — key `mf_favorites`
- `src/hooks/useBedynka.ts` — key `mf_bedynka`, item ids are `farmSlug__productId`; `totalItems` exposed for nav badge
- `src/hooks/useRecentFarms.ts` — key `mf_recent_farms`, max 6 entries. `RecentFarmEntry` includes `image?: string` (first real photo URL, validated same way as farm photos).
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
- Spring presets: `SPRING_GENTLE` (stiffness 200, damping 30), `SPRING_STIFF` (600/35) — `SPRING_BOUNCY` was deleted (underdamped, produced visible overshoot)
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

**TypeScript Set iteration:** Use `Array.from(new Set([...]))` instead of `[...new Set([...])]` — the spread syntax fails with the project's `downlevelIteration` setting.

**Event handlers on `<img>` require a client component.** Server components silently drop `onError`/`onLoad` — they are never called. If you need to hide a broken image or react to load events, extract a small `'use client'` wrapper (see `src/components/farms/HeroImage.tsx` for the pattern).

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
| `/kraje` | Static | Uses `getFarmCountByKraj()` — not `getAllFarms()`. Links to `/kraje/[slug]` pages. |
| `/kraje/[slug]` | SSG | 14 kraj landing pages. `generateStaticParams` returns all slug entries from `KRAJ_LIST` in mockData. Renders farm grid for that kraj, top categories, and CTA to `/mapa?kraj=...`. |
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
| `/auth/callback` | Dynamic | Server-side `route.ts` — exchanges PKCE `?code=` via `@supabase/ssr`, sets session cookie, redirects to `/profil`. No `page.tsx`. |
| `/profil` | Static shell | Requires auth |
| `/profil/recenze` | Static shell | Requires auth |
| `/profil/historie` | Static shell | `mf_recent_farms` localStorage |
| `/pro-farmary/narokovat` | Static shell | Requires auth; writes to `farm_claims` |
| `/profil/farma` | Static shell | Farm owner edit page. Requires auth + approved claim. Loads via `GET /api/farms/mine`. Editable fields: description, categories, bio, delivery, pick_your_own, contact, opening_hours, images. Saves via `PATCH /api/farms/[slug]/edit`. |
| `/api/og` | Edge | Branded OG image generation. Params: `?title=`, `?subtitle=` |
| `/api/search` | Dynamic | GET `?q=` — returns max 5 results |
| `/api/newsletter` | Dynamic | POST `{ email }` — inserts into `subscribers` |
| `/api/farms/[slug]/view` | Dynamic | POST — increments `view_count` via RPC |
| `/api/stripe/checkout` | Dynamic | POST `{ farm_slug, price_id }` with `Authorization: Bearer <token>` — creates Stripe Checkout Session. Returns `{ url }`. 503 when `STRIPE_SECRET_KEY` absent. |
| `/api/stripe/webhook` | Dynamic | POST — Stripe webhook handler. Verifies signature, handles `checkout.session.completed`, `customer.subscription.updated/deleted`. Updates `subscriptions` table and `farms.tier`. Always returns 200 except on invalid signature. |
| `/api/auth/delete-account` | Dynamic | DELETE with Bearer token |
| `/api/admin/check` | Dynamic | GET with Bearer token — returns `{ admin: true/false }`. Checks token against private `ADMIN_EMAIL` env var server-side. |
| `/api/admin/zadosti` | Dynamic | GET — lists pending farm claims. PATCH `[id]` — approve or reject a claim (updates `farm_claims.status`). |
| `/api/farms/mine` | Dynamic | GET with Bearer token — returns farms owned by the authenticated user (approved claims). |
| `/api/farms/[slug]/edit` | Dynamic | PATCH with Bearer token — updates allowed farm fields. Requires approved claim for that slug. Allowed: `description`, `categories`, `bio`, `delivery`, `pick_your_own`, `contact`, `opening_hours`, `images`. |
| `/admin` | Client shell | Dashboard — requires auth + admin email check via `/api/admin/check` |
| `/admin/farmy` | Client shell | Farm list with verify toggle, search, pagination (50/page) |
| `/admin/claimy` | Client shell | Farm claim requests — approve/reject |
| `/admin/zadosti` | Client shell | Pending farm submission requests (`farm_claims` status=pending). Approve/reject via `/api/admin/zadosti/[id]`. |
| `/admin/odbery` | Client shell | Newsletter subscribers + CSV export |
| `/admin/trhy` | Client shell | Farmers market management — CRUD for markets table via Supabase. |
| `/admin/recenze` | Client shell | All reviews — read and delete |
| `/admin/blog` | Client shell | Blog article management — create/edit/delete entries in `articles` table. |

### Security utilities

`src/lib/rateLimit.ts` — in-memory sliding-window rate limiter. Works per-serverless-instance (no Redis). Call `rateLimit(key, { limit, windowMs })` — returns `false` when the caller should be rejected. `getIp(req)` reads `x-forwarded-for` / `x-real-ip`. Applied to every public endpoint:

| Route | Key prefix | Limit |
|---|---|---|
| `/api/search` | `search:<ip>` | 30/min |
| `/api/newsletter` | `newsletter:<ip>` | 5/hr |
| `/api/farms/submit` | `farm-submit:<ip>` | 3/day |
| `/api/farms/[slug]/view` | `view:<ip>` | 30/hr |

`src/lib/adminAuth.ts` — shared helpers for admin routes: `verifyAdmin(req)` checks Bearer token against Supabase + `ADMIN_EMAIL`; `getSupabaseServiceClient()` returns a service-role client. Import from here — do not copy-paste into individual routes.

`src/app/api/admin/articleFields.ts` — `ARTICLE_ALLOWED_FIELDS` allowlist + `pickArticleFields(body)`. Import in all `/api/admin/blog` routes to prevent mass assignment.

`src/app/api/markets/marketFields.ts` — `MARKET_ALLOWED_FIELDS` allowlist + `pickMarketFields(body)`. Import in all `/api/markets` routes.

`safeJsonLd(obj)` in `src/lib/utils.ts` — serialises an object for `<script type="application/ld+json">`, escaping `</` to prevent script injection. Use instead of bare `JSON.stringify` in `dangerouslySetInnerHTML`.

**XSS in map popups:** `esc(s)` in `MapView.tsx` escapes `&`, `<`, `>`, `"` — defined at module scope and applied to every string interpolated into popup HTML.

**Auth callback** (`src/app/auth/callback/route.ts`) — server-side GET handler. Exchanges the Supabase PKCE `?code=` parameter using `@supabase/ssr` `createServerClient`, sets the session cookie, then redirects to `/profil`. There is no `page.tsx` at this path.

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
| `RESEND_API_KEY` | Resend email API — required for `send-outreach` script. Domain `mapafarem.cz` must also be verified in Resend → Domains. |
| `GOOGLE_PLACES_API_KEY` | Google Places API — only for `import-farms` script |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` / `sk_live_...`) — all `/api/stripe/*` routes return 503 when absent |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) — used by `/api/stripe/webhook` to verify event signatures |
| `STRIPE_PRICE_PROFESIONAL` | Stripe Price ID for 299 CZK/month plan — used to derive tier in webhook handler |
| `STRIPE_PRICE_PREMIUM` | Stripe Price ID for 799 CZK/month plan — used to derive tier in webhook handler |

### Vercel deployment

Vercel project: **`mapafarem`** (under `lpapaxs-projects`), GitHub repo `lpapax/MAPA`. There is a separate project called `mapa` — env vars must be set in `mapafarem`, not `mapa`.

```bash
npx vercel link       # link local repo to correct project
npx vercel env ls     # list env vars
npx vercel env add NEXT_PUBLIC_GTM_ID production
```

### Brand context

`.impeccable.md` (project root) — read this before making design decisions. Key points:
- **Target user:** Urban Czech families, 25–45, buying direct from farmers. Mobile Saturday morning or desktop evenings. Trust > speed.
- **Brand:** Fresh · Local · Genuine. Feels like a well-designed Czech food magazine, not a delivery app.
- **Anti-reference:** scuk.cz — avoid the restaurant-discovery, grid-of-cards-with-ratings, transactional feel.
- **Design principles:** Trust through warmth, seasonal and alive, discovery over transaction, local specificity, legibility first.

### Design system

Typography: `font-sans` = Karla, `font-heading` = Spectral. Both loaded via `next/font/google` in `layout.tsx` with `latin-ext` subset (required for Czech characters). Body background is warm parchment `#faf7f0`.

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

The `cn()` utility from `src/lib/utils.ts` merges class names (clsx + tailwind-merge). The same file exports `safeJsonLd(obj)` — use it for all JSON-LD script tags (see above).

**Background gradient utilities** — `tailwind.config.ts` defines `backgroundImage` tokens used as bg classes:

| Class | Use for |
|---|---|
| `bg-newsletter` | Newsletter section — diagonal dark green gradient |
| `bg-seasonal` | Seasonal banner — green→earth diagonal |
| `bg-hero-overlay` | Hero image overlay (usually applied inline) |
| `bg-hero-map` | `/mapa` empty-state hero background |
| `bg-warm-section` | White→surface vertical gradient for section transitions |
| `bg-earth-soft` | Warm earth tinted section background |

**Dark mode** — A partial dark mode exists via `ThemeProvider`. `globals.css` has `!important` overrides that remap `bg-white`, `bg-surface`, `bg-neutral-*`, `bg-primary-50/100`, and text colors for the `.dark` class. Do not add new background colors without adding a corresponding dark override. Light mode is the primary design — dark mode is secondary and not all sections are optimised.

**`grain` utility** — `globals.css` defines `.grain::after` which applies a subtle SVG noise texture via a pseudo-element (`position: absolute; inset: 0; z-index: 1; pointer-events: none`). Apply to `relative` containers only. Content inside a grain container that should render above the texture needs `position: relative` (no explicit z-index required — `z-index: auto` stacks below `z-index: 1` only when the parent creates a stacking context, so add `isolation: isolate` or an explicit z-index to the content wrapper if layering issues occur). Do not apply to scrolling containers — causes continuous GPU repaints.

**`scrollbar-none` / `scrollbar-thin`** — Custom utilities in `globals.css`. Use `scrollbar-none` on horizontal overflow strips (category filter, trust bar). Use `scrollbar-thin` on vertical scroll areas where a thin scrollbar is desirable.

**Transitions:** Never use `transition-all` — it recalculates every CSS property on every frame. Always specify the exact properties: `transition-[border-color,box-shadow]` for inputs, `transition-[transform,box-shadow]` for cards, `transition-[border-color,background-color,color]` for buttons/pills.

**CSS token alignment:** `--primary` and `--ring` in `globals.css` are manually kept in sync with `primary-500` (`#4a8c3f` = `hsl(111 38% 40%)`). When changing either, update both files. Comments in `globals.css` mark these sync points.

**Form accessibility pattern:** Validated inputs use `aria-invalid={!!errors.field}` + `aria-describedby={errors.field ? 'field-error-id' : undefined}`. Error `<p>` elements use `id="field-error-id" role="alert"`. See `AddFarmForm.tsx` for the complete pattern across all 5 steps.

`src/lib/geo.ts` — `haversineKm(lat1, lng1, lat2, lng2)` and `formatDistance(km)`.

`CATEGORY_META` in `src/lib/farms.ts` — maps every `FarmCategory` to `{ label, emoji, color }`. Used by map layer paint expressions, leaderboard badges, markets pills, and `SimilarFarms` sidebar.

**Icons:** Lucide React SVGs only — no emoji characters as decorative icons in JSX.

**Hero sections** — Always use `min-h-[100dvh]` (not `h-screen` or `min-h-screen`). iOS Safari's collapsing toolbar causes visible layout jumps with `vh` units. `dvh` accounts for the dynamic viewport.

**Homepage HeroSection layout** — Split-screen grid (`grid-cols-[58fr_42fr]`). Left panel is `bg-[#0b1e08]` with `grain` class applied; content uses `staggerContainer` + `fadeUp` variants from `motionVariants.ts`. Right panel is the farm photo (`next/image` with `fill`, `sizes="42vw"`). On mobile (`grid-cols-1`) the photo stacks first (`order-1`) above the content panel (`order-2`). The trust strip is `absolute bottom-0` inside the left panel — `hidden lg:flex` only.

**`CategoryIcon` sprite sheet** — `src/components/ui/CategoryIcon.tsx` renders category icons from `public/Gemini_Generated_Image_.png`, a 5-col × 3-row PNG sprite. Position formula: `x = col * 25%`, `y = row * 50%`, `background-size: 500% 300%`. The `SPRITE` map in that file records `[col, row]` for each category. For the active (white-on-green) state, pass `className="brightness-0 invert"` — works only if sprite cells have a dark icon on a transparent background. The `'all'` category uses Lucide `LayoutGrid` instead of the sprite.

**Section header numbered watermark system** — Homepage content sections (`HomeFeaturedFarms`, `HowItWorks`, `BlogPreview`) use a shared editorial pattern: a large muted number (`01`/`02`/`03`) as `absolute -left-1 -top-4` inside a `relative overflow-hidden` wrapper, with an ALL-CAPS eyebrow label (`text-[10px] tracking-[0.2em]`) and a fluid heading via `clamp(2rem, 4vw, 3rem)`. The `overflow-hidden` is essential — without it the large number bleeds outside the section boundary.

### Homepage layout conventions

Homepage sections follow editorial layout rules — **do not "fix" them to equal grids**:

- **No equal 3-column card grids.** This feels like a restaurant-listing app (the anti-reference). Use asymmetric `col-span` layouts instead.
- `HomeFeaturedFarms` — spotlight card (`lg:col-span-2`) + 4 smaller cards is intentional. Do not normalise to 3 equal columns.
- `BlogPreview` — feature article `lg:col-span-7` + two stacked horizontal cards `lg:col-span-5`. All three articles have the same visual weight in a 3-col grid — this breaks that.
- `RecentReviews` — one featured review on dark `forest` background (`lg:col-span-6`) + two stacked on white (`lg:col-span-5`). Only rendered when Supabase has reviews; returns `null` otherwise.
- `StatsBar` — single editorial prose sentence with inline `AnimatedCounter` on a `bg-forest` panel with a low-opacity farm photo at 18%. Not a metric grid.
- `Newsletter` — split layout: text/benefit list left, form card right (`grid-cols-1 lg:grid-cols-2`). Not a centred column.

**Mapbox popup CSS classes** — `globals.css` contains all styling for `.farm-popup`, `.farm-click-popup`, `.farm-click-popup-inner`, `.farm-click-popup-name`, etc. When changing popup HTML in `MapView.tsx`, update the matching CSS classes in `globals.css`. The popup content is built as a raw HTML string — escape every interpolated string with `esc()` (defined at module scope in `MapView.tsx`).

### Global UI components

`src/components/ui/Toast.tsx` — `ToastProvider` + `useToast()`. Call `useToast().show(message, type)` where `type` is `'success' | 'error' | 'info'`.

`src/components/ui/CookieConsent.tsx` — GDPR consent banner. Always rendered inside `layout.tsx`; uses `showBanner` from `useCookieConsent` to avoid SSR flash.

`src/components/ui/GTMScript.tsx` — conditionally loads GTM. Safe to leave in layout even without `NEXT_PUBLIC_GTM_ID` set.

`@vercel/analytics` — `<Analytics />` is mounted in `layout.tsx` just before `<ThemeProvider>`. Tracks page views automatically on Vercel. No configuration needed.

`@vercel/speed-insights` — `<SpeedInsights />` is mounted alongside `<Analytics />` in `layout.tsx`. Tracks Core Web Vitals on Vercel. No configuration needed.

`src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx` — custom 404, error boundary, and skeleton loader.

### Farm detail tabs

`FarmDetailClient` has five tabs: O farmě, Produkty, Galerie, Recenze, Kontakt.

- **Produkty** — one card per farm category with "Do bedýnky" / "V bedýnce" toggle backed by `useBedynka`. No products table yet.
- **Recenze** — localStorage key `mf_reviews_${farm.slug}`. When authenticated, `useReviews` merges with Supabase `reviews` table. Do not seed fake reviews.
- **Galerie** — real images from `farm.images[]`; shows an empty state with a Google Maps link when no real photos exist. The gallery tab label includes a count badge (`Galerie (3)`) when photos are available. Failed images are tracked in `failedImages: Set<string>` state and filtered out of both the grid and lightbox.
- **Photo strip** — a horizontal row of up to 6 thumbnails appears above the tabs whenever ≥2 real photos exist; clicking any opens the lightbox.

`FarmDetailClient` accepts `similarFarms?: Farm[]` — renders a "Similar farms" sidebar with up to 3 same-kraj farms.
