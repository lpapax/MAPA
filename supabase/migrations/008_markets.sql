-- Migration 008: Markets table

CREATE TABLE IF NOT EXISTS markets (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  region      TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  schedule    TEXT NOT NULL DEFAULT '',
  time        TEXT NOT NULL DEFAULT '',
  vendors     INTEGER DEFAULT 0,
  tags        TEXT[] DEFAULT '{}',
  photo       TEXT DEFAULT '',           -- Unsplash photo ID or full URL
  is_daily    BOOLEAN DEFAULT FALSE,
  dow         INTEGER,                   -- 0=Sun … 6=Sat; NULL when is_daily=TRUE
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active markets"
  ON markets FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Service role full access"
  ON markets FOR ALL
  USING (auth.role() = 'service_role');

-- Seed: existing 20 markets
INSERT INTO markets (name, city, region, lat, lng, schedule, time, vendors, tags, photo, is_daily, dow) VALUES
  ('Manifesto Market Anděl',      'Praha',            'Hlavní město Praha',   50.0700, 14.4030, 'Každou sobotu (sezóna)',   '8:00–14:00',  45, ARRAY['BIO','Farmářský','Řemeslný'], '1488459716781-31db52582fe9', FALSE, 6),
  ('Farmářské trhy Jiřák',         'Praha',            'Hlavní město Praha',   50.0756, 14.4600, 'Sobota a neděle',          '8:00–14:00',  80, ARRAY['Farmářský','BIO'],            '1416879595882-3373a0480b5b', FALSE, 6),
  ('Zelný trh',                    'Brno',             'Jihomoravský kraj',    49.1935, 16.6096, 'Denně (pondělí–sobota)',   '6:00–18:00',  30, ARRAY['Farmářský','Tradiční'],       '1523741543316-beb7fc7023d8', TRUE,  NULL),
  ('Farmářský trh Olomouc',        'Olomouc',          'Olomoucký kraj',       49.5938, 17.2509, 'Každou sobotu',            '7:00–12:00',  25, ARRAY['BIO','Farmářský'],            '1625246333195-cbfcaabedf55', FALSE, 6),
  ('Farmářský trh Ostrava',        'Ostrava',          'Moravskoslezský kraj', 49.8209, 18.2625, 'Každou sobotu',            '8:00–13:00',  20, ARRAY['Farmářský'],                  '1464226184884-fa280b87c399', FALSE, 6),
  ('Plzeňský farmářský trh',       'Plzeň',            'Plzeňský kraj',        49.7384, 13.3736, 'Každou sobotu',            '7:00–12:00',  18, ARRAY['BIO','Farmářský'],            '1500595046743-cd271d694d30', FALSE, 6),
  ('Budějovický farmářský trh',    'České Budějovice', 'Jihočeský kraj',       48.9745, 14.4746, 'Každou sobotu',            '8:00–12:00',  22, ARRAY['Farmářský','BIO'],            '1558642452-9d2a7deb7f62',   FALSE, 6),
  ('Liberecký trh',                'Liberec',          'Liberecký kraj',       50.7663, 15.0543, 'Každou sobotu',            '8:00–13:00',  15, ARRAY['Farmářský'],                  '1444681961742-3aef9e307b37', FALSE, 6),
  ('Farmářský trh Hradec Králové', 'Hradec Králové',   'Královéhradecký kraj', 50.2092, 15.8328, 'Každou sobotu',            '7:30–12:00',  20, ARRAY['BIO','Farmářský'],            '1416879595882-3373a0480b5b', FALSE, 6),
  ('Pardubický farmářský trh',     'Pardubice',        'Pardubický kraj',      50.0343, 15.7812, 'Každou sobotu',            '8:00–12:00',  16, ARRAY['Farmářský'],                  '1488459716781-31db52582fe9', FALSE, 6),
  ('Jihlavský farmářský trh',      'Jihlava',          'Kraj Vysočina',        49.3961, 15.5910, 'Každou sobotu',            '8:00–12:00',  14, ARRAY['BIO','Řemeslný'],             '1625246333195-cbfcaabedf55', FALSE, 6),
  ('Farmářský trh Zlín',           'Zlín',             'Zlínský kraj',         49.2247, 17.6671, 'Každou sobotu',            '8:00–13:00',  18, ARRAY['Farmářský'],                  '1500595046743-cd271d694d30', FALSE, 6),
  ('Karlovarský farmářský trh',    'Karlovy Vary',     'Karlovarský kraj',     50.2314, 12.8715, 'Každou sobotu',            '8:00–12:00',  12, ARRAY['BIO'],                        '1523741543316-beb7fc7023d8', FALSE, 6),
  ('Ústecký farmářský trh',        'Ústí nad Labem',   'Ústecký kraj',         50.6607, 14.0323, 'Každou sobotu',            '8:00–13:00',  15, ARRAY['Farmářský'],                  '1464226184884-fa280b87c399', FALSE, 6),
  ('Bio trh Vinohrady',            'Praha',            'Hlavní město Praha',   50.0778, 14.4437, 'Každou neděli',            '9:00–14:00',  35, ARRAY['BIO','Farmářský'],            '1416879595882-3373a0480b5b', FALSE, 0),
  ('Farmářský trh Brno-Líšeň',    'Brno',             'Jihomoravský kraj',    49.2101, 16.6882, 'Každou sobotu',            '8:00–12:00',  20, ARRAY['Farmářský','BIO'],            '1558642452-9d2a7deb7f62',   FALSE, 6),
  ('Havlíčkobrodský trh',          'Havlíčkův Brod',  'Kraj Vysočina',        49.6063, 15.5798, 'Každou sobotu',            '7:00–12:00',  12, ARRAY['Farmářský'],                  '1625246333195-cbfcaabedf55', FALSE, 6),
  ('Opavský farmářský trh',        'Opava',            'Moravskoslezský kraj', 49.9381, 17.9027, 'Každou sobotu',            '8:00–13:00',  16, ARRAY['BIO','Farmářský'],            '1444681961742-3aef9e307b37', FALSE, 6),
  ('Brněnský Bio trh',             'Brno',             'Jihomoravský kraj',    49.1960, 16.6093, 'Každou neděli',            '9:00–13:00',  28, ARRAY['BIO','Řemeslný'],             '1416879595882-3373a0480b5b', FALSE, 0),
  ('Farmářský trh Kladno',         'Kladno',           'Středočeský kraj',     50.1435, 14.1015, 'Každou sobotu',            '8:00–12:00',  14, ARRAY['Farmářský'],                  '1488459716781-31db52582fe9', FALSE, 6);
