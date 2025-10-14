-- Create podcasts table for AI-generated podcast episodes
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  voice_id TEXT,
  style TEXT,
  duration INTEGER, -- duration in seconds
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for podcasts table
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

-- Create index for faster queries
CREATE INDEX idx_podcasts_user_id ON public.podcasts(user_id);
CREATE INDEX idx_podcasts_created_at ON public.podcasts(created_at DESC);

-- Create storage bucket for podcast audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'podcast-audio',
  'podcast-audio',
  false,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for podcast audio
CREATE POLICY "Users can upload their own podcast audio"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'podcast-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own podcast audio"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'podcast-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own podcast audio"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'podcast-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own podcast audio"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'podcast-audio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON TABLE public.podcasts IS 'Stores AI-generated podcast episodes';
COMMENT ON COLUMN public.podcasts.audio_url IS 'Storage path to the audio file';
COMMENT ON COLUMN public.podcasts.voice_id IS 'ElevenLabs voice ID used for generation';
COMMENT ON COLUMN public.podcasts.style IS 'Podcast style (conversational, narrative, etc.)';
COMMENT ON COLUMN public.podcasts.duration IS 'Duration of the podcast in seconds';