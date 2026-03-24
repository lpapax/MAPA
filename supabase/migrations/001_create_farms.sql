-- ============================================================
-- Migration: 001_create_farms
-- Creates the farms table for MapaFarem
-- Run in: Supabase Dashboard → SQL Editor, or via Supabase CLI
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() (enabled by default on Supabase)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── farms table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.farms (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',

  -- Product categories (zelenina, maso, mléko, …)
  categories    TEXT[]      NOT NULL DEFAULT '{}',

  -- Location (flat columns — faster than JSONB for indexed geo queries)
  lat           FLOAT8      NOT NULL,
  lng           FLOAT8      NOT NULL,
  address       TEXT        NOT NULL DEFAULT '',
  city          TEXT        NOT NULL DEFAULT '',
  kraj          TEXT        NOT NULL DEFAULT '',
  zip           TEXT        NOT NULL DEFAULT '',

  -- Nested objects stored as JSONB
  contact       JSONB       NOT NULL DEFAULT '{}',
  opening_hours JSONB,

  -- Farm images (array of public URLs)
  images        TEXT[]      NOT NULL DEFAULT '{}',

  verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────

-- Fast slug lookups for SSG / detail pages
CREATE INDEX IF NOT EXISTS farms_slug_idx      ON public.farms (slug);

-- Filtering by kraj (county)
CREATE INDEX IF NOT EXISTS farms_kraj_idx      ON public.farms (kraj);

-- GIN index for efficient array containment queries on categories
-- e.g. WHERE categories @> ARRAY['zelenina']
CREATE INDEX IF NOT EXISTS farms_categories_gin ON public.farms USING GIN (categories);

-- ── Row Level Security ───────────────────────────────────────

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required to browse farms)
CREATE POLICY "farms_public_read"
  ON public.farms
  FOR SELECT
  USING (TRUE);

-- Only authenticated users with service role can insert/update/delete
-- (use Supabase service key from your backend or Edge Functions)
CREATE POLICY "farms_service_write"
  ON public.farms
  FOR ALL
  USING (auth.role() = 'service_role');

-- ── Seed data (3 placeholder farms from farms.json) ──────────

INSERT INTO public.farms
  (slug, name, description, categories, lat, lng, address, city, kraj, zip,
   contact, opening_hours, images, verified, created_at)
VALUES
  (
    'statky-novak-jizni-cechy',
    'Statek Novák',
    'Rodinný statek ve třetí generaci zaměřený na ekologické pěstování zeleniny a ovoce. Prodáváme přímo ze dvora — bez prostředníků, vždy čerstvé.',
    ARRAY['zelenina','ovoce','vejce'],
    49.0747, 14.4181,
    'Třeboňská 42', 'Veselí nad Lužnicí', 'Jihočeský', '391 81',
    '{"phone":"+420 605 123 456","email":"info@stateknovak.cz","web":"https://stateknovak.cz","instagram":"stateknovak"}'::jsonb,
    '{"út":{"open":"08:00","close":"12:00"},"čt":{"open":"08:00","close":"17:00"},"so":{"open":"07:00","close":"11:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE,
    '2024-03-15T10:00:00Z'
  ),
  (
    'farma-pod-lipami-morava',
    'Farma Pod Lipami',
    'Paseme krávy na přirozených pastvinách Vysočiny. Naše mléko a sýry jsou vyráběny tradičními metodami bez přidaných konzervantů.',
    ARRAY['mléko','sýry','maso'],
    49.5955, 15.7895,
    'Náměstí 7', 'Polná', 'Vysočina', '588 13',
    '{"phone":"+420 731 987 654","email":"farma@podlipami.cz","instagram":"farma_pod_lipami","facebook":"FarmaPodLipami"}'::jsonb,
    '{"po":{"open":"09:00","close":"16:00"},"út":{"open":"09:00","close":"16:00"},"st":{"open":"09:00","close":"16:00"},"čt":{"open":"09:00","close":"16:00"},"pá":{"open":"09:00","close":"14:00"},"so":{"open":"09:00","close":"12:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE,
    '2024-05-20T08:30:00Z'
  ),
  (
    'vcely-a-med-beskydy',
    'Včely & Med Beskydy',
    'Rodinné včelařství v srdci Beskyd s více než 80 úly. Nabízíme květový, lesní, lipový a pohankový med. Vše sklízeno ručně.',
    ARRAY['med','byliny'],
    49.5353, 18.2116,
    'Horní Bečva 214', 'Horní Bečva', 'Zlínský', '756 57',
    '{"phone":"+420 777 246 810","email":"med@beskydy-vcelstvi.cz","web":"https://beskydy-vcelstvi.cz","instagram":"vcelybeskydy"}'::jsonb,
    '{"pá":{"open":"15:00","close":"18:00"},"so":{"open":"09:00","close":"13:00"},"ne":{"open":"10:00","close":"12:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    FALSE,
    '2024-07-01T14:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;
