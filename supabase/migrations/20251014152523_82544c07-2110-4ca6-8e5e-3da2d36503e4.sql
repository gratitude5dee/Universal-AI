-- Create venue_searches table
CREATE TABLE IF NOT EXISTS public.venue_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  query TEXT NOT NULL,
  extracted_filters JSONB DEFAULT '{}',
  results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create venue_bookings table
CREATE TABLE IF NOT EXISTS public.venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs,
  user_id UUID REFERENCES auth.users NOT NULL,
  venue_name TEXT NOT NULL,
  venue_location TEXT,
  venue_capacity INTEGER,
  venue_contact_email TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'negotiating', 'accepted', 'contracted', 'paid')),
  workflow_stage TEXT DEFAULT 'intro' CHECK (workflow_stage IN ('intro', 'offer', 'contract', 'invoice', 'payment')),
  offer_amount DECIMAL(10,2),
  offer_sent_at TIMESTAMPTZ,
  contract_url TEXT,
  contract_signed_at TIMESTAMPTZ,
  invoice_id UUID REFERENCES public.invoices,
  payment_received_at TIMESTAMPTZ,
  ai_match_score INTEGER CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
  ai_reasoning TEXT,
  event_date DATE,
  event_time TIME,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create booking_communications table
CREATE TABLE IF NOT EXISTS public.booking_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.venue_bookings NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  communication_type TEXT DEFAULT 'email' CHECK (communication_type IN ('email', 'sms', 'call', 'note')),
  direction TEXT DEFAULT 'sent' CHECK (direction IN ('sent', 'received')),
  subject TEXT,
  body TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'delivered', 'bounced', 'opened'))
);

-- Create event_assets table
CREATE TABLE IF NOT EXISTS public.event_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.venue_bookings NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('poster', 'ticket', 'merch_design', 'promo_image')),
  file_url TEXT,
  generation_prompt TEXT,
  ai_model_used TEXT DEFAULT 'google/gemini-2.5-flash-image-preview',
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create ticket_sales table
CREATE TABLE IF NOT EXISTS public.ticket_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.venue_bookings NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  ticket_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity_total INTEGER NOT NULL DEFAULT 0,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  ticket_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create trigger for venue_bookings updated_at
CREATE TRIGGER update_venue_bookings_updated_at
  BEFORE UPDATE ON public.venue_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS on all tables
ALTER TABLE public.venue_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venue_searches
CREATE POLICY "Users can view their own searches"
  ON public.venue_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own searches"
  ON public.venue_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
  ON public.venue_searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
  ON public.venue_searches FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for venue_bookings
CREATE POLICY "Users can view their own bookings"
  ON public.venue_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.venue_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.venue_bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.venue_bookings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for booking_communications
CREATE POLICY "Users can view their own communications"
  ON public.booking_communications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own communications"
  ON public.booking_communications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own communications"
  ON public.booking_communications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own communications"
  ON public.booking_communications FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for event_assets
CREATE POLICY "Users can view their own event assets"
  ON public.event_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event assets"
  ON public.event_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event assets"
  ON public.event_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event assets"
  ON public.event_assets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ticket_sales
CREATE POLICY "Users can view their own ticket sales"
  ON public.ticket_sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ticket sales"
  ON public.ticket_sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ticket sales"
  ON public.ticket_sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ticket sales"
  ON public.ticket_sales FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for venue_bookings (for live status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_bookings;