-- Create storage bucket for podcast audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('podcast-audio', 'podcast-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Create podcasts table to store generated podcast metadata
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  script TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  voice_id TEXT,
  style TEXT,
  duration_seconds INTEGER,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure helpful index for querying by user
CREATE INDEX IF NOT EXISTS podcasts_user_id_idx ON public.podcasts (user_id, created_at DESC);

-- Enable row level security
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- RLS policies for podcasts table
CREATE POLICY "Users can view their own podcasts"
ON public.podcasts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own podcasts"
ON public.podcasts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own podcasts"
ON public.podcasts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own podcasts"
ON public.podcasts
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update the updated_at column
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for podcast-audio bucket
CREATE POLICY "Users can view their own podcast audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'podcast-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own podcast audio"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'podcast-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own podcast audio"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'podcast-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own podcast audio"
ON storage.objects
FOR DELETE
USING (bucket_id = 'podcast-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
