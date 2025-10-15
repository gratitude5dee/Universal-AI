-- Invoice enhancements
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

-- Align balance_due with existing amount values
UPDATE public.invoices
SET balance_due = COALESCE(balance_due, amount),
    tax_amount = COALESCE(tax_amount, 0)
WHERE balance_due IS NULL OR tax_amount IS NULL;

-- Booking payment tracking
ALTER TABLE public.venue_bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_payment_status_check
    CHECK (payment_status IN ('unpaid','partial','paid','overdue'));

-- Relax status constraint if present so workflow stages can evolve independently
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'venue_bookings'
      AND constraint_name = 'venue_bookings_status_check'
  ) THEN
    ALTER TABLE public.venue_bookings DROP CONSTRAINT venue_bookings_status_check;
  END IF;
END $$;

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_status_check
    CHECK (status IN ('new','offer','negotiating','contracted','invoiced','paid'));

UPDATE public.venue_bookings
SET payment_status = CASE WHEN COALESCE(status, '') = 'paid' THEN 'paid' ELSE 'unpaid' END
WHERE payment_status IS NULL OR payment_status = '';

CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_stage
  ON public.venue_bookings (user_id, workflow_stage);

-- Research data privacy hardening
DELETE FROM public.research_messages
WHERE session_id IN (
  SELECT id FROM public.research_sessions WHERE user_id IS NULL
);

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

CREATE INDEX IF NOT EXISTS idx_research_messages_session_created_at
  ON public.research_messages (session_id, created_at);

-- Content bucket privacy
UPDATE storage.buckets
SET public = false
WHERE id = 'content-library';

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS storage_path text;

UPDATE public.content_items
SET storage_path = COALESCE(storage_path, regexp_replace(file_url, '^.*content-library/', ''))
WHERE storage_path IS NULL AND file_url IS NOT NULL;

-- Secret management encryption metadata
ALTER TABLE public.user_secrets
  ADD COLUMN IF NOT EXISTS nonce text,
  ADD COLUMN IF NOT EXISTS encryption_version integer NOT NULL DEFAULT 1;

DROP POLICY IF EXISTS "Users can view their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can insert their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can update their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can delete their own secrets" ON public.user_secrets;

CREATE POLICY "Service role manages user secrets"
  ON public.user_secrets
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

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

CREATE OR REPLACE VIEW public.podcasts_client_v1 AS
SELECT
  p.id,
  p.user_id,
  p.title,
  p.description,
  p.script,
  p.outline,
  p.segments,
  p.show_notes,
  p.audio_format,
  p.file_size,
  p.duration_seconds,
  p.duration,
  p.audio_signed_url,
  p.created_at,
  p.updated_at
FROM public.podcasts p;
