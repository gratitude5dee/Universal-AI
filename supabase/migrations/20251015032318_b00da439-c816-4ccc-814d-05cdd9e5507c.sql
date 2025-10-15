-- Add missing columns and fix podcasts table schema
ALTER TABLE public.podcasts
ADD COLUMN IF NOT EXISTS script TEXT,
ADD COLUMN IF NOT EXISTS audio_format TEXT DEFAULT 'mp3',
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS show_notes TEXT,
ADD COLUMN IF NOT EXISTS outline JSONB,
ADD COLUMN IF NOT EXISTS segments JSONB,
ADD COLUMN IF NOT EXISTS audio_signed_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Rename duration to duration_seconds if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'podcasts' AND column_name = 'duration'
  ) THEN
    ALTER TABLE public.podcasts RENAME COLUMN duration TO duration_seconds;
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Users can create their own podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Users can update their own podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Users can delete their own podcasts" ON public.podcasts;

-- Create RLS policies for podcasts table
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

-- Create trigger for updated_at if not exists
DROP TRIGGER IF EXISTS update_podcasts_updated_at ON public.podcasts;
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();