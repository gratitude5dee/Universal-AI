-- Enhance podcasts table with metadata inspired by podgenv1 workflow
ALTER TABLE public.podcasts
  ADD COLUMN IF NOT EXISTS script TEXT,
  ADD COLUMN IF NOT EXISTS outline JSONB,
  ADD COLUMN IF NOT EXISTS segments JSONB,
  ADD COLUMN IF NOT EXISTS show_notes TEXT,
  ADD COLUMN IF NOT EXISTS audio_format TEXT,
  ADD COLUMN IF NOT EXISTS file_size BIGINT,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS audio_signed_url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Backfill duration_seconds from legacy duration column if present
UPDATE public.podcasts
SET duration_seconds = COALESCE(duration_seconds, duration)
WHERE duration IS NOT NULL;

-- Ensure duration column mirrors duration_seconds for clients that still read it
UPDATE public.podcasts
SET duration = duration_seconds
WHERE duration_seconds IS NOT NULL;

-- Maintain updated_at automatically
CREATE OR REPLACE FUNCTION public.set_podcasts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_podcasts_updated_at ON public.podcasts;
CREATE TRIGGER set_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.set_podcasts_updated_at();

COMMENT ON COLUMN public.podcasts.script IS 'Full script used for podcast synthesis';
COMMENT ON COLUMN public.podcasts.outline IS 'Structured outline (sections, talking points) used for generation';
COMMENT ON COLUMN public.podcasts.segments IS 'Per-segment scripts and metadata';
COMMENT ON COLUMN public.podcasts.show_notes IS 'Generated show notes or episode summary';
COMMENT ON COLUMN public.podcasts.audio_format IS 'Stored audio mime type';
COMMENT ON COLUMN public.podcasts.file_size IS 'Size of stored audio file in bytes';
COMMENT ON COLUMN public.podcasts.duration_seconds IS 'Duration of the podcast in seconds';
COMMENT ON COLUMN public.podcasts.audio_signed_url IS 'Cached signed URL for client playback';
