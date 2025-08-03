-- Create venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(100),
  capacity INTEGER,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  venue_type VARCHAR(100),
  genres TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gigs table
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  venue_id UUID REFERENCES public.venues(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  capacity INTEGER,
  ticket_price DECIMAL(10,2),
  guarantee_amount DECIMAL(10,2),
  door_split_percentage INTEGER,
  contract_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tour_contacts table
CREATE TABLE public.tour_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  tags TEXT[],
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) NOT NULL,
  invoice_number VARCHAR(50) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for venues (public read, authenticated users can add)
CREATE POLICY "Anyone can view venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert venues" ON public.venues FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update venues" ON public.venues FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Create policies for gigs
CREATE POLICY "Users can view their own gigs" ON public.gigs FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own gigs" ON public.gigs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gigs" ON public.gigs FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gigs" ON public.gigs FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for tour_contacts
CREATE POLICY "Users can view their own contacts" ON public.tour_contacts FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contacts" ON public.tour_contacts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts" ON public.tour_contacts FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts" ON public.tour_contacts FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for invoices (users can view invoices for their gigs)
CREATE POLICY "Users can view invoices for their gigs" ON public.invoices FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.gigs WHERE gigs.id = invoices.gig_id AND gigs.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert invoices for their gigs" ON public.invoices FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.gigs WHERE gigs.id = invoices.gig_id AND gigs.user_id = auth.uid()
  ));
CREATE POLICY "Users can update invoices for their gigs" ON public.invoices FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.gigs WHERE gigs.id = invoices.gig_id AND gigs.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete invoices for their gigs" ON public.invoices FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.gigs WHERE gigs.id = invoices.gig_id AND gigs.user_id = auth.uid()
  ));

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at
  BEFORE UPDATE ON public.gigs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tour_contacts_updated_at
  BEFORE UPDATE ON public.tour_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample venues
INSERT INTO public.venues (name, address, city, state, country, capacity, contact_name, contact_email, venue_type, genres) VALUES
('The Blue Note', '131 W 3rd St', 'New York', 'NY', 'USA', 300, 'Sarah Johnson', 'booking@bluenote.com', 'Jazz Club', '{"jazz", "blues", "soul"}'),
('Red Rocks Amphitheatre', '18300 W Alameda Pkwy', 'Morrison', 'CO', 'USA', 9525, 'Mike Davis', 'events@redrocks.com', 'Amphitheatre', '{"rock", "electronic", "indie"}'),
('The Troubadour', '9081 Santa Monica Blvd', 'West Hollywood', 'CA', 'USA', 500, 'Lisa Chen', 'booking@troubadour.com', 'Music Venue', '{"rock", "indie", "folk"}'),
('House of Blues', '329 N Dearborn St', 'Chicago', 'IL', 'USA', 1800, 'Tom Wilson', 'booking@hob.com', 'Music Hall', '{"blues", "rock", "hip-hop"}'),
('The Fillmore', '1805 Geary Blvd', 'San Francisco', 'CA', 'USA', 1150, 'Emma Rodriguez', 'booking@fillmore.com', 'Historic Venue', '{"rock", "indie", "electronic"}')