-- Create voice_clones table for storing custom ElevenLabs voice clones
CREATE TABLE IF NOT EXISTS public.voice_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  voice_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, voice_id)
);

-- Enable RLS
ALTER TABLE public.voice_clones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own voice clones"
ON public.voice_clones
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice clones"
ON public.voice_clones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice clones"
ON public.voice_clones
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice clones"
ON public.voice_clones
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_voice_clones_updated_at
BEFORE UPDATE ON public.voice_clones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();