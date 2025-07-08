-- Add onboarding-related columns to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personality_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS connected_accounts JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_preferences JSONB DEFAULT '{
  "llm": "gpt-4o",
  "chain": "ethereum", 
  "style": "balanced"
}'::jsonb;