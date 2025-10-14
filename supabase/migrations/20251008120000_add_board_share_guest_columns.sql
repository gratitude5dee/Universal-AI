-- Add sharing controls and metadata columns to board_shares
ALTER TABLE public.board_shares
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_downloads BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Ensure updated_at is populated for existing rows
UPDATE public.board_shares
SET updated_at = COALESCE(updated_at, now());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'board_shares'
      AND policyname = 'Board owners can update shares'
  ) THEN
    CREATE POLICY "Board owners can update shares"
    ON public.board_shares
    FOR UPDATE
    USING (
      board_id IN (
        SELECT id FROM public.boards WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      board_id IN (
        SELECT id FROM public.boards WHERE user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Add guest metadata to comments and allow anonymous comments created via functions
ALTER TABLE public.board_comments
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add a structured content column alongside legacy canvas_data
ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}';

-- Backfill content from existing canvas_data
UPDATE public.boards
SET content = canvas_data
WHERE content IS NULL;
