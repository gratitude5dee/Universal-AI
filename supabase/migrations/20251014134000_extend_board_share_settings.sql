-- Extend board_shares with sharing settings and support anonymous comments/content snapshots
BEGIN;

-- Add sharing settings to board_shares
ALTER TABLE public.board_shares
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_downloads BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Ensure updated_at is refreshed on updates
CREATE OR REPLACE FUNCTION public.set_board_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_board_shares_updated_at ON public.board_shares;
CREATE TRIGGER set_board_shares_updated_at
BEFORE UPDATE ON public.board_shares
FOR EACH ROW
EXECUTE FUNCTION public.set_board_shares_updated_at();

-- Allow anonymous/guest comments
ALTER TABLE public.board_comments
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Store serialized board content for public sharing
ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Update policies to account for new capabilities
DROP POLICY IF EXISTS "Board owners can create shares" ON public.board_shares;
CREATE POLICY "Board owners can manage shares"
ON public.board_shares
FOR ALL
USING (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
  ) OR created_by = auth.uid()
)
WITH CHECK (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
  ) OR created_by = auth.uid()
);

COMMIT;
