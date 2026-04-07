-- Blog articles table
CREATE TABLE IF NOT EXISTS articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  cover_image   TEXT,
  cover_gradient TEXT DEFAULT 'from-primary-400 to-teal-500',
  category      TEXT NOT NULL DEFAULT 'Obecné',
  author        TEXT NOT NULL DEFAULT 'Redakce Mapa Farem',
  author_initials TEXT DEFAULT 'MF',
  read_time     TEXT DEFAULT '5 min čtení',
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  draft         BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles (published_at DESC) WHERE draft = false;

-- RLS: public can read published, service_role manages all
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_articles"
  ON articles FOR SELECT
  TO public
  USING (draft = false);
