-- Migration: Add XP tracking field for dejar habits
-- Run this in Supabase SQL Editor

-- Add field to track last XP reward date for dejar habits
ALTER TABLE habitos 
ADD COLUMN IF NOT EXISTS ultima_recompensa_xp TIMESTAMP WITH TIME ZONE;

-- Comment explaining the field
COMMENT ON COLUMN habitos.ultima_recompensa_xp IS 'Last date when passive XP was awarded for staying clean (dejar habits only)';
