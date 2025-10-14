ALTER TABLE public.ai_runs
  ADD COLUMN provider TEXT DEFAULT 'cerebras';

ALTER TABLE public.ai_runs
  DROP CONSTRAINT IF EXISTS ai_runs_status_check;

ALTER TABLE public.ai_runs
  ADD CONSTRAINT ai_runs_status_check
  CHECK (status IN ('pending', 'running', 'streaming', 'completed', 'failed', 'cancelled'));
