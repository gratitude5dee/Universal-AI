-- Add linking columns between boards and projects
ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS content JSONB;

ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS source_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Backfill board content from existing canvas_data
UPDATE public.boards
SET content = canvas_data
WHERE content IS NULL;

-- Ensure board content always has a default structure
ALTER TABLE public.boards
  ALTER COLUMN content SET DEFAULT '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}'::jsonb;

ALTER TABLE public.boards
  ALTER COLUMN content SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_boards_source_project_id ON public.boards(source_project_id);

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS source_board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_source_board_id ON public.projects(source_board_id);

-- Update RLS policies to cover linked boards/projects
DROP POLICY IF EXISTS "Users can view boards they own or collaborate on" ON public.boards;

CREATE POLICY "Boards accessible to owners, collaborators, or linked project owners"
ON public.boards FOR SELECT
USING (
  auth.uid() = user_id
  OR is_public = true
  OR EXISTS (
    SELECT 1
    FROM public.board_collaborators bc
    WHERE bc.board_id = id
      AND bc.user_id = auth.uid()
      AND bc.status = 'accepted'
  )
  OR (
    source_project_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.projects p
      WHERE p.id = source_project_id
        AND p.user_id = auth.uid()
    )
  )
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects accessible via linked boards"
ON public.projects FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.boards b
    WHERE b.source_project_id = public.projects.id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.board_collaborators bc
          WHERE bc.board_id = b.id
            AND bc.user_id = auth.uid()
            AND bc.status = 'accepted'
        )
      )
  )
);
