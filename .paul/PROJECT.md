# Mapa Farem

## What This Is

A Czech farm directory — web app (and future mobile app) where users browse, filter, and contact local farms on an interactive Mapbox map. The platform lists 4,009 real Czech farms with filtering by category, region, and search. Farmers can claim their listing, submit for inclusion, and (upcoming) pay for premium placement. Users can favorite farms, compare them, manage a basket, and read farm reviews.

## Core Value

Connect Czech people with local farmers so they can buy fresh, local produce directly from the source.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application (web + mobile) |
| Version | 0.1.0 |
| Status | MVP — deployed, production-ready web app |
| Last Updated | 2026-04-05 |

**Production URLs:**
- Web: https://mapafarem.cz (Vercel, project: `mapafarem` under `lpapaxs-projects`)
- Repo: github.com/lpapax/MAPA

## Requirements

### Core Features

- Browse/search/filter 4,009 Czech farms on interactive Mapbox map
- Farm detail pages with reviews, gallery, products, contact
- Farm submission and claiming workflow
- User auth (magic link), profile, favorites, compare, basket
- Admin panel (farms, claims, subscribers, reviews)

### Validated (Shipped)

- [x] Contact form API + farm submission API — v0.2.0
- [x] SEO sitemap + robots.txt — v0.2.0
- [x] Supabase: contact_messages + pending_farms tables — v0.2.0
- [x] Interactive map with all 4,009 farms — v0.1.0
- [x] Farm detail pages (5 tabs: about, products, gallery, reviews, contact) — v0.1.0
- [x] Filter by category, kraj, search — v0.1.0
- [x] Auth (magic link), profile, favorites, compare, basket — v0.1.0
- [x] Admin panel (farms, claims, subscribers, reviews) — v0.1.0
- [x] GTM, cookie consent, OG images, Vercel Analytics — v0.1.0
- [x] Blog, markets, leaderboard, seasonal calendar, regions pages — v0.1.0
- [x] SEO: sitemap, robots.txt — pending commit
- [x] Contact form API + farm submission API — pending commit

### Active (In Progress)

- [ ] Stripe subscription tiers for farmers

### Planned (Next)

- [ ] Paid farmer subscription tiers (Stripe)
- [ ] Premium farm listings (featured placement, farmer analytics)
- [ ] Email notifications (contact replies, submission confirmations)
- [ ] Real product listings per farm
- [ ] Blog CMS / editorial content system
- [ ] Growth tooling (structured data / JSON-LD, more farm data)

### Out of Scope

- Mobile app (React Native/Expo) — future milestone, not in current roadmap
- Real-time chat between users and farmers

## Constraints

### Technical Constraints

- Next.js 14 App Router — no Pages Router patterns
- Mapbox token inlined at build time — env change requires redeploy
- Supabase direct DB is IPv6-only — run migrations via SQL Editor
- `select('*')` banned on `getAllFarms()` — payload size constraint
- `getSupabaseRaw()` required for tables not yet in Database type

### Business Constraints

- Czech market — all UI in Czech language
- GDPR compliance required (cookie consent, data deletion)
- Vercel deployment — env vars must be set in `mapafarem` project, not `mapa`

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Next.js 14 App Router | SSR + ISR for SEO-heavy farm pages | 2025 | Active |
| Mapbox GL (native layer) | 4,009 farms can't be DOM markers — performance | 2025 | Active |
| Supabase | Auth + DB + RLS in one, free tier sufficient | 2025 | Active |
| Magic link auth only | No password management complexity | 2025 | Active |
| Stripe for paid tiers | Standard for SaaS monetization | - | Planned |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Farms in directory | 5,000+ | 4,009 | On track |
| Monthly active users | 10,000 | - | Not started |
| Paid farmer subscribers | 100 | 0 | Not started |
| Farm claim rate | 20% | 0% | Not started |
| Newsletter subscribers | 1,000 | 0 | Not started |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 14 (App Router) | TypeScript, Tailwind CSS |
| Map | Mapbox GL JS | Native circle layer, not DOM markers |
| Database | Supabase (PostgreSQL) | 7 tables, RLS |
| Auth | Supabase Auth | Magic link only |
| Hosting | Vercel | Project: `mapafarem` |
| Analytics | Vercel Analytics + GTM | Consent-gated |
| Payments | Stripe | Planned |
| State | Zustand | farmStore + compareStore |
| Animations | Framer Motion | Shared presets in motionVariants.ts |

## Links

| Resource | URL |
|----------|-----|
| Repository | github.com/lpapax/MAPA |
| Production | https://mapafarem.cz |
| Supabase | https://supabase.com/dashboard/project/eqrmwkyzllkpkuqhwswk |
| Vercel | https://vercel.com (project: mapafarem) |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-04-05*
