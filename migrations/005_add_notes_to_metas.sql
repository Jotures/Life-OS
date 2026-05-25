-- Migration: Add notes column to metas table
-- Run this in Supabase SQL Editor

-- Add 'notas' column to track Markdown notes for each meta (Vital or Quest)
ALTER TABLE metas 
ADD COLUMN IF NOT EXISTS notas TEXT DEFAULT '';

-- Comment explaining the column
COMMENT ON COLUMN metas.notas IS 'Markdown notes and checklists for the meta (Vitals or Quests)';
