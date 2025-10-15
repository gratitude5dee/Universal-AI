-- Invoice enrichment and payment tracking
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.invoices
  ALTER COLUMN amount TYPE numeric(12,2);

ALTER TABLE public.venue_bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';

ALTER TABLE public.venue_bookings
  DROP CONSTRAINT IF EXISTS venue_bookings_payment_status_check;

ALTER TABLE public.venue_bookings
  ADD CONSTRAINT venue_bookings_payment_status_check
    CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'overdue'));

CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_stage
  ON public.venue_bookings (user_id, workflow_stage);

-- Content library privacy
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS file_path text;

UPDATE public.content_items
SET file_path = CASE
  WHEN file_path IS NOT NULL THEN file_path
  WHEN coalesce(file_url, '') = '' THEN concat('legacy/', id::text)
  ELSE regexp_replace(file_url, '^.+/content-library/', '')
END
WHERE file_path IS NULL;

ALTER TABLE public.content_items
  ALTER COLUMN file_path SET NOT NULL;

UPDATE storage.buckets
SET public = false
WHERE id = 'content-library';

-- Research session hardening
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
  USING (session_id IN (SELECT id FROM public.research_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM public.research_sessions WHERE user_id = auth.uid()));

-- Secrets table restricted to service role
DROP POLICY IF EXISTS "Users can view their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can insert their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can update their own secrets" ON public.user_secrets;
DROP POLICY IF EXISTS "Users can delete their own secrets" ON public.user_secrets;

CREATE POLICY "Service role manages user secrets"
  ON public.user_secrets
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Invoice payment RPC
CREATE OR REPLACE FUNCTION public.record_invoice_payment(
  p_invoice_id uuid,
  p_amount numeric,
  p_paid_at timestamptz DEFAULT timezone('utc', now())
)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice public.invoices;
  v_booking_user uuid;
BEGIN
  SELECT user_id INTO v_booking_user
  FROM public.venue_bookings
  WHERE invoice_id = p_invoice_id
  LIMIT 1;

  IF v_booking_user IS NULL THEN
    RAISE EXCEPTION 'Invoice does not belong to a booking';
  END IF;

  IF v_booking_user <> auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to modify this invoice';
  END IF;

  UPDATE public.invoices
  SET balance_due = GREATEST(balance_due - COALESCE(p_amount, 0), 0),
      paid_at = CASE WHEN GREATEST(balance_due - COALESCE(p_amount, 0), 0) = 0 THEN COALESCE(p_paid_at, timezone('utc', now())) ELSE paid_at END,
      status = CASE WHEN GREATEST(balance_due - COALESCE(p_amount, 0), 0) = 0 THEN 'paid' ELSE status END,
      updated_at = timezone('utc', now())
  WHERE id = p_invoice_id
  RETURNING * INTO v_invoice;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found';
  END IF;

  UPDATE public.venue_bookings
  SET payment_status = CASE WHEN v_invoice.balance_due = 0 THEN 'paid' ELSE 'partial' END,
      workflow_stage = CASE WHEN v_invoice.balance_due = 0 THEN 'payment' ELSE workflow_stage END,
      updated_at = timezone('utc', now())
  WHERE invoice_id = v_invoice.id;

  RETURN v_invoice;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_invoice_payment(uuid, numeric, timestamptz) TO authenticated;
