-- Phase 1: Critical Database Schema Enhancements for Event Toolkit

-- 1. Add missing columns to invoices table that the edge function expects
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due NUMERIC,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill balance_due and user_id
UPDATE public.invoices 
SET balance_due = amount
WHERE balance_due IS NULL;

UPDATE public.invoices 
SET user_id = (SELECT user_id FROM public.gigs WHERE gigs.id = invoices.gig_id)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after backfill
ALTER TABLE public.invoices 
  ALTER COLUMN user_id SET NOT NULL;

-- 2. Add Performance Indexes
CREATE INDEX IF NOT EXISTS idx_gigs_user_id ON public.gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON public.gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_date ON public.gigs(date);
CREATE INDEX IF NOT EXISTS idx_gigs_venue_id ON public.gigs(venue_id);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_gig_id ON public.invoices(gig_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_tour_contacts_user_id ON public.tour_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_contacts_email ON public.tour_contacts(email);

CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);

CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_id ON public.venue_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_gig_id ON public.venue_bookings(gig_id);

-- 3. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Create Contact-Venue Relationship Table
CREATE TABLE IF NOT EXISTS public.contact_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.tour_contacts(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  relationship_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, venue_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_venues_contact ON public.contact_venues(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_venues_venue ON public.contact_venues(venue_id);

ALTER TABLE public.contact_venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage contact-venue relationships" ON public.contact_venues;
CREATE POLICY "Users can manage contact-venue relationships"
  ON public.contact_venues FOR ALL
  USING (
    contact_id IN (SELECT id FROM public.tour_contacts WHERE user_id = auth.uid())
  );

-- 5. Add Business Logic Constraints
ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS check_positive_amount;
ALTER TABLE public.invoices
  ADD CONSTRAINT check_positive_amount CHECK (amount > 0);

ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS check_line_items_structure;
ALTER TABLE public.invoices
  ADD CONSTRAINT check_line_items_structure 
  CHECK (jsonb_typeof(line_items) = 'array');

ALTER TABLE public.gigs
  DROP CONSTRAINT IF EXISTS check_gig_date_valid;
ALTER TABLE public.gigs
  ADD CONSTRAINT check_gig_date_valid 
  CHECK (date > '2020-01-01'::timestamptz);

ALTER TABLE public.gigs
  DROP CONSTRAINT IF EXISTS check_door_split_percentage;
ALTER TABLE public.gigs
  ADD CONSTRAINT check_door_split_percentage 
  CHECK (door_split_percentage IS NULL OR (door_split_percentage >= 0 AND door_split_percentage <= 100));

-- 6. Database Functions

-- Calculate Gig Revenue
CREATE OR REPLACE FUNCTION public.calculate_gig_revenue(gig_id_param UUID)
RETURNS TABLE (
  total_potential NUMERIC,
  guaranteed NUMERIC,
  door_split_estimate NUMERIC,
  ticket_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  gig_record RECORD;
BEGIN
  SELECT * INTO gig_record FROM public.gigs WHERE id = gig_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gig not found';
  END IF;
  
  RETURN QUERY SELECT
    COALESCE(gig_record.guarantee_amount, 0) + 
      (COALESCE(gig_record.capacity, 0) * COALESCE(gig_record.ticket_price, 0) * 
       COALESCE(gig_record.door_split_percentage, 0) / 100.0) as total_potential,
    COALESCE(gig_record.guarantee_amount, 0) as guaranteed,
    (COALESCE(gig_record.capacity, 0) * COALESCE(gig_record.ticket_price, 0) * 
     COALESCE(gig_record.door_split_percentage, 0) / 100.0) as door_split_estimate,
    (COALESCE(gig_record.capacity, 0) * COALESCE(gig_record.ticket_price, 0)) as ticket_revenue;
END;
$$;

-- Get Dashboard Stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(user_id_param UUID)
RETURNS TABLE (
  total_gigs INTEGER,
  upcoming_gigs INTEGER,
  pending_gigs INTEGER,
  total_revenue NUMERIC,
  unpaid_invoices_count INTEGER,
  unpaid_invoices_amount NUMERIC,
  overdue_invoices_count INTEGER,
  avg_payment_days INTEGER,
  total_contacts INTEGER,
  total_venues INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.gigs WHERE user_id = user_id_param),
    (SELECT COUNT(*)::INTEGER FROM public.gigs 
     WHERE user_id = user_id_param AND date > NOW() AND status = 'confirmed'),
    (SELECT COUNT(*)::INTEGER FROM public.gigs 
     WHERE user_id = user_id_param AND status = 'pending'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.invoices 
     WHERE user_id = user_id_param AND status = 'paid'),
    (SELECT COUNT(*)::INTEGER FROM public.invoices 
     WHERE user_id = user_id_param AND status IN ('pending', 'sent')),
    (SELECT COALESCE(SUM(balance_due), 0) FROM public.invoices 
     WHERE user_id = user_id_param AND status IN ('pending', 'sent')),
    (SELECT COUNT(*)::INTEGER FROM public.invoices 
     WHERE user_id = user_id_param AND status IN ('pending', 'sent') 
     AND due_date < CURRENT_DATE),
    (SELECT COALESCE(AVG(EXTRACT(DAY FROM (paid_at - created_at))), 0)::INTEGER 
     FROM public.invoices 
     WHERE user_id = user_id_param AND status = 'paid' AND paid_at IS NOT NULL),
    (SELECT COUNT(*)::INTEGER FROM public.tour_contacts WHERE user_id = user_id_param),
    (SELECT COUNT(DISTINCT venue_id)::INTEGER FROM public.gigs 
     WHERE user_id = user_id_param AND venue_id IS NOT NULL);
END;
$$;

-- Auto-Generate Invoice Number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) INTO counter 
  FROM public.invoices 
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((counter + 1)::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;

-- Trigger for Invoice Number
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_invoice_number ON public.invoices;
CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

-- Activity Logging
CREATE OR REPLACE FUNCTION public.log_entity_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, entity_type, entity_id, action, new_values)
    VALUES (NEW.user_id, TG_TABLE_NAME, NEW.id, 'created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, entity_type, entity_id, action, old_values, new_values)
    VALUES (NEW.user_id, TG_TABLE_NAME, NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, entity_type, entity_id, action, old_values)
    VALUES (OLD.user_id, TG_TABLE_NAME, OLD.id, 'deleted', to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_gigs_activity ON public.gigs;
CREATE TRIGGER log_gigs_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.gigs
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_activity();

DROP TRIGGER IF EXISTS log_invoices_activity ON public.invoices;
CREATE TRIGGER log_invoices_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_activity();

DROP TRIGGER IF EXISTS log_contacts_activity ON public.tour_contacts;
CREATE TRIGGER log_contacts_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.tour_contacts
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_activity();

-- 7. Enhanced RLS Policies
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own invoices" ON public.invoices;
CREATE POLICY "Users can create their own invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
CREATE POLICY "Users can update their own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
CREATE POLICY "Users can delete their own invoices"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Create Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gig-contracts',
  'gig-contracts',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own contracts" ON storage.objects;
CREATE POLICY "Users can upload their own contracts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gig-contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view their own contracts" ON storage.objects;
CREATE POLICY "Users can view their own contracts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'gig-contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own contracts" ON storage.objects;
CREATE POLICY "Users can delete their own contracts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gig-contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 9. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
ALTER TABLE public.activity_logs REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;

-- 10. Backfill invoice numbers
UPDATE public.invoices
SET invoice_number = 'INV-LEGACY-' || SUBSTRING(id::text FROM 1 FOR 8)
WHERE invoice_number IS NULL;