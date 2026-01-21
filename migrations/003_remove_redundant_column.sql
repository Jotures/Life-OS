-- Migration: Remove redundant ultima_recompensa_xp column
-- Run this in Supabase SQL Editor AFTER deploying the code changes
--
-- The original ultima_recompensa column is now used for all XP tracking.
-- This migration cleans up the redundant column added in 001_add_xp_tracking.sql

-- Step 1: Copy any existing data from _xp to the main column (if needed)
-- Uncomment only if you have data in ultima_recompensa_xp that you want to preserve:
-- UPDATE habitos 
-- SET ultima_recompensa = ultima_recompensa_xp 
-- WHERE ultima_recompensa IS NULL AND ultima_recompensa_xp IS NOT NULL;

-- Step 2: Drop the redundant column
ALTER TABLE habitos DROP COLUMN IF EXISTS ultima_recompensa_xp;

-- Step 3: Add comment explaining the unified column
COMMENT ON COLUMN habitos.ultima_recompensa IS 'Last date when passive XP was awarded for staying clean (dejar habits). Syncs with fecha_inicio on relapse.';
