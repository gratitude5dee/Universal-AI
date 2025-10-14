-- Ensure profiles table has a display_name column for storing creator names
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;
