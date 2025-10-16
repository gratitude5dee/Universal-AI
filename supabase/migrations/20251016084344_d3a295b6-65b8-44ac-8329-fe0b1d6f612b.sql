-- Create storage bucket for brand kit assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for brand-assets bucket
CREATE POLICY "Users can view brand assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Users can upload their own brand assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'brand-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own brand assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'brand-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own brand assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'brand-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );