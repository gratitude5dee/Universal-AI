-- Add link columns between boards and projects and ensure board content storage
ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS source_project_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'boards_source_project_id_fkey'
  ) THEN
    ALTER TABLE public.boards
      ADD CONSTRAINT boards_source_project_id_fkey
      FOREIGN KEY (source_project_id)
      REFERENCES public.projects(id)
      ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS source_board_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_source_board_id_fkey'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_source_board_id_fkey
      FOREIGN KEY (source_board_id)
      REFERENCES public.boards(id)
      ON DELETE SET NULL;
  END IF;
END $$;
