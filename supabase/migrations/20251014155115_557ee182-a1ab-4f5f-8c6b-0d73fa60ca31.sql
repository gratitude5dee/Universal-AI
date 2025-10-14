-- Insert test booking data for gratitude@5-dee.com
-- User ID: 067d017b-4ede-468e-9552-a665dea6cf4a

INSERT INTO public.venue_bookings (
  user_id,
  venue_name,
  venue_city,
  venue_state,
  venue_location,
  venue_capacity,
  venue_contact_email,
  event_date,
  event_time,
  offer_amount,
  status,
  workflow_stage,
  ai_match_score,
  ai_reasoning
) VALUES
-- 1. New booking at intro stage
(
  '067d017b-4ede-468e-9552-a665dea6cf4a',
  'The Blue Note',
  'New York',
  'NY',
  'New York, NY',
  250,
  'booking@bluenote.com',
  '2025-03-15',
  '20:00',
  3500.00,
  'new',
  'intro',
  92,
  'Perfect jazz venue with intimate setting. High engagement audience and excellent acoustics.'
),
-- 2. Negotiating booking at offer stage
(
  '067d017b-4ede-468e-9552-a665dea6cf4a',
  'The Fillmore',
  'San Francisco',
  'CA',
  'San Francisco, CA',
  1200,
  'events@fillmore.com',
  '2025-04-20',
  '19:30',
  8500.00,
  'negotiating',
  'offer',
  88,
  'Legendary venue with strong touring history. Great for building West Coast fanbase.'
),
-- 3. Accepted booking at contract stage
(
  '067d017b-4ede-468e-9552-a665dea6cf4a',
  'Brooklyn Steel',
  'Brooklyn',
  'NY',
  'Brooklyn, NY',
  1800,
  'booking@brooklynsteel.com',
  '2025-05-10',
  '21:00',
  6000.00,
  'accepted',
  'contract',
  95,
  'Top-tier Brooklyn venue. Perfect capacity and demographic match for your sound.'
),
-- 4. Contracted booking at invoice stage
(
  '067d017b-4ede-468e-9552-a665dea6cf4a',
  'Stubbs BBQ',
  'Austin',
  'TX',
  'Austin, TX',
  2200,
  'talent@stubbsaustin.com',
  '2025-06-05',
  '20:00',
  7500.00,
  'contracted',
  'invoice',
  90,
  'Iconic Austin venue during festival season. Great for exposure and networking.'
),
-- 5. Paid booking ready for assets
(
  '067d017b-4ede-468e-9552-a665dea6cf4a',
  'The Troubadour',
  'West Hollywood',
  'CA',
  'West Hollywood, CA',
  500,
  'info@troubadour.com',
  '2025-07-12',
  '20:30',
  4500.00,
  'paid',
  'payment',
  93,
  'Historic LA venue where legends have played. Intimate setting with industry presence.'
);