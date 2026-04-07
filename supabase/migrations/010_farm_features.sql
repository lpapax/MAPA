-- Migration 010: Add farm feature flags
-- bio, delivery, pick_your_own

ALTER TABLE farms
  ADD COLUMN IF NOT EXISTS bio        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS delivery   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pick_your_own BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_farms_bio      ON farms(bio)      WHERE bio = true;
CREATE INDEX IF NOT EXISTS idx_farms_delivery ON farms(delivery) WHERE delivery = true;
