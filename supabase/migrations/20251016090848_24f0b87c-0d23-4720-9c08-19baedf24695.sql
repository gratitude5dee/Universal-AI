-- Create design_versions table for version control
CREATE TABLE IF NOT EXISTS public.design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  design_image_url TEXT,
  canvas_data JSONB,
  changes_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(design_id, version_number)
);

-- Enable RLS
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view versions of their designs"
  ON public.design_versions
  FOR SELECT
  USING (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for their designs"
  ON public.design_versions
  FOR INSERT
  WITH CHECK (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update versions of their designs"
  ON public.design_versions
  FOR UPDATE
  USING (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete versions of their designs"
  ON public.design_versions
  FOR DELETE
  USING (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_design_versions_design_id ON public.design_versions(design_id);
CREATE INDEX idx_design_versions_created_at ON public.design_versions(created_at DESC);