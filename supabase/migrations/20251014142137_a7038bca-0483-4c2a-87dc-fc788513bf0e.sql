-- Fix duplicate columns in boards table
-- This migration ensures the boards table has the correct schema without duplicates

-- First, check if columns exist and drop duplicates if needed
DO $$ 
BEGIN
  -- Ensure boards table has correct columns (non-duplicate)
  -- The boards table should have these columns with correct types
  
  -- Add content column if it doesn't exist (JSONB type)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'boards' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.boards ADD COLUMN content JSONB DEFAULT NULL;
  END IF;
  
  -- Add source_project_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'boards' AND column_name = 'source_project_id'
  ) THEN
    ALTER TABLE public.boards ADD COLUMN source_project_id TEXT DEFAULT NULL;
  END IF;

END $$;

-- Ensure the columns are nullable as they should be
ALTER TABLE public.boards 
  ALTER COLUMN content DROP NOT NULL,
  ALTER COLUMN source_project_id DROP NOT NULL;

COMMENT ON COLUMN public.boards.content IS 'Additional content metadata for the board';
COMMENT ON COLUMN public.boards.source_project_id IS 'Reference to source project if board was copied';