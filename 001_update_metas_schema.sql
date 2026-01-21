-- 1. Add 'type' column. 
-- We default to 'vital' so that all EXISTING rows become 'vitals' automatically.
ALTER TABLE metas 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'vital';

-- 2. Add 'target_value' for Quests (default 100 or whatever makes sense, nullable is fine too)
ALTER TABLE metas 
ADD COLUMN IF NOT EXISTS target_value NUMERIC DEFAULT 100;

-- 3. Add 'current_value' for tracking progress
ALTER TABLE metas 
ADD COLUMN IF NOT EXISTS current_value NUMERIC DEFAULT 0;

-- 4. Add 'xp_reward' for completing Quests
ALTER TABLE metas 
ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 500;

-- 5. Force update existing rows to 'vital' just in case (redundant given DEFAULT but safe)
UPDATE metas SET type = 'vital' WHERE type IS NULL;
