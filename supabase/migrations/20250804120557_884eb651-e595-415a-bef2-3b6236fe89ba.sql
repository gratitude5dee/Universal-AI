-- SECURITY FIX 1: Create secure user_secrets table for API keys
CREATE TABLE public.user_secrets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_type text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, secret_type)
);

-- Enable RLS on user_secrets
ALTER TABLE public.user_secrets ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_secrets
CREATE POLICY "Users can view their own secrets" 
ON public.user_secrets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own secrets" 
ON public.user_secrets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own secrets" 
ON public.user_secrets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own secrets" 
ON public.user_secrets 
FOR DELETE 
USING (auth.uid() = user_id);

-- SECURITY FIX 2: Add missing RLS policies for profiles table
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- SECURITY FIX 3: Remove API key columns from profiles table (will be moved to user_secrets)
-- First, let's backup any existing API keys to the new table
INSERT INTO public.user_secrets (user_id, secret_type, encrypted_value)
SELECT id, 'luma_api_key', luma_api_key 
FROM public.profiles 
WHERE luma_api_key IS NOT NULL AND luma_api_key != '';

INSERT INTO public.user_secrets (user_id, secret_type, encrypted_value)
SELECT id, 'claude_api_key', claude_api_key 
FROM public.profiles 
WHERE claude_api_key IS NOT NULL AND claude_api_key != '';

-- Remove API key columns from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS luma_api_key;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS claude_api_key;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_auth_token;

-- Drop the old API key policy since those columns no longer exist
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.profiles;

-- Add trigger for timestamps on user_secrets
CREATE TRIGGER update_user_secrets_updated_at
BEFORE UPDATE ON public.user_secrets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();