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
