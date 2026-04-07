# Roadmap: Mapa Farem

## Overview

The web app MVP is live with 4,009 farms. The next two milestones focus on monetization (paid farmer tiers via Stripe) and content & growth (email notifications, real product listings, blog CMS, SEO structured data). A mobile app milestone will follow.

## Current Milestone

**v0.2 — Production Ready** (v0.2.0)
Status: In progress
Phases: 0 of 1 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Launch Commit | 1 | Complete ✓ | 2026-04-05 |
| 2 | Stripe Subscriptions | 2 | Planning | - |
| 3 | Premium Farm Features | TBD | Not started | - |
| 4 | Email Notifications | TBD | Not started | - |
| 5 | Product Listings | TBD | Not started | - |
| 6 | Content System | TBD | Not started | - |
| 7 | SEO & Growth | TBD | Not started | - |

## Phase Details

### Phase 1: Launch Commit

**Goal:** Commit and deploy all pending work from last session — contact API, farm submission API, sitemap, robots.txt, migration 006, updated forms.
**Depends on:** Nothing
**Research:** Unlikely

**Scope:**
- Commit: contact route, farm submit route, sitemap.ts, robots.ts, migration 006
- Commit: updated AddFarmForm.tsx, ContactForm.tsx, layout.tsx, package.json
- Run migration 006 in Supabase SQL Editor
- Verify build passes

**Plans:**
- [ ] 01-01: Commit pending work and deploy

---

## 📋 Planned Milestone: v0.3 — Monetization

**Goal:** Enable farmers to pay for subscription tiers with Stripe. Gate premium features behind paid plans.
**Prerequisite:** v0.2 complete

| Phase | Focus | Research |
|-------|-------|----------|
| 2 | Stripe subscriptions + farmer tier model | Likely (Stripe API) |
| 3 | Premium features: featured placement, farmer analytics | Unlikely |

---

## 📋 Planned Milestone: v0.4 — Content & Growth

**Goal:** Email notifications, real product listings, blog CMS, and SEO structured data to drive organic growth.
**Prerequisite:** v0.3 complete (or parallel)

| Phase | Focus | Research |
|-------|-------|----------|
| 4 | Email notifications (Resend/Postmark) | Likely (email provider API) |
| 5 | Real product listings per farm | Unlikely |
| 6 | Blog CMS or structured editorial content | Likely |
| 7 | JSON-LD structured data, more farm data import | Unlikely |

---
*Roadmap created: 2026-04-05*
*Last updated: 2026-04-05*
