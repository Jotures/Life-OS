-- Migration: Add notes column to habitos table
-- Run this in Supabase SQL Editor

-- Add 'notas' column to track Markdown notes for each habit
ALTER TABLE habitos 
ADD COLUMN IF NOT EXISTS notas TEXT DEFAULT '';

-- Comment explaining the column
COMMENT ON COLUMN habitos.notas IS 'Markdown notes and checklists for the habit';
