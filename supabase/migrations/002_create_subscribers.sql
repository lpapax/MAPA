-- ============================================================
-- Migration: 002_create_subscribers
-- Newsletter subscriber list for MapaFarem
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (anonymous insert)
CREATE POLICY "subscribers_public_insert"
  ON public.subscribers
  FOR INSERT
  WITH CHECK (TRUE);

-- Only service role can read subscriber list
CREATE POLICY "subscribers_service_read"
  ON public.subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');
