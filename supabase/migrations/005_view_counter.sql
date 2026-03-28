-- Add view counter to farms
ALTER TABLE farms ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- RPC function to increment safely (no auth required — public counter)
CREATE OR REPLACE FUNCTION increment_farm_view(farm_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE farms SET view_count = view_count + 1 WHERE slug = farm_slug;
$$;
