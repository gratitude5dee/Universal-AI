-- Invoice & booking payment structure
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.venue_bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';

ALTER TABLE public.venue_bookings
  DROP CONSTRAINT IF EXISTS venue_bookings_payment_status_check;

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_payment_status_check
  CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'overdue'));

ALTER TABLE public.venue_bookings
  DROP CONSTRAINT IF EXISTS venue_bookings_status_check;

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_status_check
  CHECK (status IS NULL OR status IN ('new','offer','negotiating','contracted','invoiced','paid'));

CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_stage
  ON public.venue_bookings (user_id, workflow_stage);

-- Podcast duration compatibility
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

-- Research privacy hardening
DELETE FROM public.research_messages
USING public.research_sessions
WHERE public.research_messages.session_id = public.research_sessions.id
  AND public.research_sessions.user_id IS NULL;

DELETE FROM public.research_sessions
WHERE user_id IS NULL;

ALTER TABLE public.research_sessions
  ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Allow read access to research sessions" ON public.research_sessions;
DROP POLICY IF EXISTS "Allow read access to research messages" ON public.research_messages;

CREATE POLICY "Users manage own research sessions"
  ON public.research_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own research messages"
  ON public.research_messages
  FOR ALL
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

CREATE INDEX IF NOT EXISTS research_sessions_user_updated_idx
  ON public.research_sessions (user_id, updated_at DESC);

-- Content library storage security
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS storage_path text;

UPDATE public.content_items
SET storage_path = COALESCE(storage_path, NULLIF(REGEXP_REPLACE(file_url, '^.*content-library/([^?]+).*$', '\1'), ''))
WHERE storage_path IS NULL AND file_url IS NOT NULL;

UPDATE storage.buckets
SET public = false
WHERE id = 'content-library';

DROP POLICY IF EXISTS "Content library public access" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own content library" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert into content library" ON storage.objects;
DROP POLICY IF EXISTS "Users can update content library" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete content library" ON storage.objects;

CREATE POLICY "Users read own content objects"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'content-library'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Users insert own content objects"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'content-library'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Users update own content objects"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'content-library'
    AND split_part(name, '/', 1) = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'content-library'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Users delete own content objects"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'content-library'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- Secrets encryption metadata
ALTER TABLE public.user_secrets
  ADD COLUMN IF NOT EXISTS encryption_iv text;
