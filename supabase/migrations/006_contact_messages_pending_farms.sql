-- Contact messages from the /kontakt form
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: admin reads via service role; public can insert
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_contact_messages"
  ON contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Pending farm registrations from the /pridat-farmu form
CREATE TABLE IF NOT EXISTS pending_farms (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  categories  TEXT[] NOT NULL DEFAULT '{}',
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  kraj        TEXT NOT NULL,
  zip         TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  web         TEXT,
  instagram   TEXT,
  facebook    TEXT,
  hours       JSONB,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: admin reads via service role; public can insert
ALTER TABLE pending_farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_pending_farms"
  ON pending_farms FOR INSERT
  TO public
  WITH CHECK (true);
