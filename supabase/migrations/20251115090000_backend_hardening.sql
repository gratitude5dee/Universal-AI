-- Invoice & booking status hardening
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.venue_bookings
  DROP CONSTRAINT IF EXISTS venue_bookings_status_check;

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_status_check
    CHECK (status IS NULL OR status IN ('new','offer','negotiating','contracted','invoiced','paid'));

ALTER TABLE public.venue_bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','partial','paid','overdue'));

CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_stage
  ON public.venue_bookings (user_id, workflow_stage);

-- Podcast job tracking & duration sync
CREATE TABLE IF NOT EXISTS public.podcast_generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','succeeded','failed')),
  request jsonb NOT NULL,
  result jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS podcast_generation_jobs_user_idx
  ON public.podcast_generation_jobs (user_id, created_at DESC);

CREATE TRIGGER podcast_generation_jobs_set_updated_at
  BEFORE UPDATE ON public.podcast_generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.podcast_generation_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Podcast jobs are world readable" ON public.podcast_generation_jobs;

CREATE POLICY "Users manage own podcast jobs"
  ON public.podcast_generation_jobs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.podcasts
  ADD COLUMN IF NOT EXISTS duration integer;

CREATE OR REPLACE FUNCTION public.sync_podcast_duration()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.duration IS NOT NULL AND NEW.duration_seconds IS NULL THEN
    NEW.duration_seconds := NEW.duration * 60;
  ELSIF NEW.duration_seconds IS NOT NULL AND NEW.duration IS NULL THEN
    NEW.duration := CEIL(NEW.duration_seconds / 60.0);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_podcast_duration ON public.podcasts;
CREATE TRIGGER sync_podcast_duration
  BEFORE INSERT OR UPDATE ON public.podcasts
  FOR EACH ROW EXECUTE FUNCTION public.sync_podcast_duration();

CREATE OR REPLACE VIEW public.podcasts_client_v1 AS
SELECT
  p.id,
  p.user_id,
  p.title,
  p.description,
  p.script,
  p.audio_url,
  p.audio_signed_url,
  p.audio_format,
  p.voice_id,
  p.style,
  p.duration_seconds,
  p.duration,
  p.file_size,
  p.show_notes,
  p.outline,
  p.segments,
  p.created_at,
  p.updated_at
FROM public.podcasts p;

-- Research privacy hardening
ALTER TABLE public.research_messages
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

UPDATE public.research_messages rm
SET created_by = rs.user_id
FROM public.research_sessions rs
WHERE rm.session_id = rs.id AND rm.created_by IS NULL;

DELETE FROM public.research_messages
WHERE session_id IN (
  SELECT id FROM public.research_sessions WHERE user_id IS NULL
);

DELETE FROM public.research_sessions
WHERE user_id IS NULL;

ALTER TABLE public.research_sessions
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.research_messages
  ALTER COLUMN created_by SET NOT NULL;

DROP POLICY IF EXISTS "Allow read access to research sessions" ON public.research_sessions;
DROP POLICY IF EXISTS "Allow read access to research messages" ON public.research_messages;

CREATE POLICY "Users manage own research sessions"
  ON public.research_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own research messages"
  ON public.research_messages FOR ALL
  USING (
    session_id IN (
      SELECT id FROM public.research_sessions WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.research_sessions WHERE user_id = auth.uid()
    )
  );

-- Content storage privacy
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS storage_path text;

UPDATE public.content_items
SET storage_path = COALESCE(
  storage_path,
  NULLIF(regexp_replace(file_url, '.*/content-library/', ''), '')
)
WHERE file_url IS NOT NULL;

ALTER TABLE public.content_items
  DROP COLUMN IF EXISTS file_url;

UPDATE storage.buckets
SET public = false
WHERE id = 'content-library';

-- Secret storage encryption columns
ALTER TABLE public.user_secrets
  ADD COLUMN IF NOT EXISTS ciphertext text,
  ADD COLUMN IF NOT EXISTS nonce text,
  ADD COLUMN IF NOT EXISTS key_version smallint NOT NULL DEFAULT 1;

ALTER TABLE public.user_secrets
  DROP COLUMN IF EXISTS encrypted_value;

-- Ensure metadata keeps track of updates
CREATE INDEX IF NOT EXISTS content_items_user_idx
  ON public.content_items (user_id, created_at DESC);

-- Support job requests JSON search
CREATE INDEX IF NOT EXISTS podcast_generation_jobs_status_idx
  ON public.podcast_generation_jobs (status);
