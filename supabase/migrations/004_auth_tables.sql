-- 004_auth_tables.sql
-- Run in Supabase SQL Editor

-- 1. User profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"     ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"   ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"   ON user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. User favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_slug TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  kraj TEXT NOT NULL DEFAULT '',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, farm_slug)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own favorites"   ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- 3. Reviews (public read, authenticated write)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads reviews"              ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews"          ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_farm ON reviews(farm_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- 4. Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own searches"   ON saved_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own searches" ON saved_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own searches" ON saved_searches FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- 5. Farm claims
CREATE TABLE IF NOT EXISTS farm_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_slug TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, farm_slug)
);

ALTER TABLE farm_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own claims"   ON farm_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own claims" ON farm_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_farm_claims_user ON farm_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_claims_farm ON farm_claims(farm_slug);
