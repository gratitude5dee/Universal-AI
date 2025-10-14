ALTER TABLE public.ai_runs
  ADD COLUMN IF NOT EXISTS provider text;
