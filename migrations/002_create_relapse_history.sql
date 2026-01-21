-- Migration: Create relapse history table for tracking and analysis
-- Run this in Supabase SQL Editor

-- Create table to store relapse events for analysis
CREATE TABLE IF NOT EXISTS historial_recaidas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habito_id UUID NOT NULL REFERENCES habitos(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    racha_perdida INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient queries by habit
CREATE INDEX IF NOT EXISTS idx_recaidas_habito ON historial_recaidas(habito_id);

-- Index for date-based queries (for charts)
CREATE INDEX IF NOT EXISTS idx_recaidas_fecha ON historial_recaidas(fecha);

-- Comment explaining the table
COMMENT ON TABLE historial_recaidas IS 'Stores relapse events for dejar habits to enable pattern analysis';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on the table
ALTER TABLE historial_recaidas ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to INSERT (for anonymous/authenticated users)
CREATE POLICY "Allow insert for all" ON historial_recaidas
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow anyone to SELECT (for reading chart data)
CREATE POLICY "Allow select for all" ON historial_recaidas
    FOR SELECT
    USING (true);

-- Policy: Allow anyone to DELETE (for cleanup if needed)
CREATE POLICY "Allow delete for all" ON historial_recaidas
    FOR DELETE
    USING (true);
