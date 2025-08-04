-- Create content management tables and storage

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public) VALUES ('content-library', 'content-library', true);

-- Create content_items table for organizing user content
CREATE TABLE public.content_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  folder_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL, -- 'audio', 'video', 'image', 'document'
  file_size BIGINT,
  file_url TEXT,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  qr_code_data TEXT, -- For QR code sourced content
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_folders table for organization
CREATE TABLE public.content_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  parent_folder_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_folders ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_items
CREATE POLICY "Users can view their own content items" 
ON public.content_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content items" 
ON public.content_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content items" 
ON public.content_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content items" 
ON public.content_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for content_folders
CREATE POLICY "Users can view their own folders" 
ON public.content_folders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" 
ON public.content_folders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
ON public.content_folders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
ON public.content_folders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Storage policies for content-library bucket
CREATE POLICY "Users can view their own content files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-library' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own content files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-library' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own content files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'content-library' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own content files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-library' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_content_items_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_folders_updated_at
BEFORE UPDATE ON public.content_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.content_items 
ADD CONSTRAINT content_items_folder_id_fkey 
FOREIGN KEY (folder_id) REFERENCES public.content_folders(id) ON DELETE SET NULL;

ALTER TABLE public.content_folders 
ADD CONSTRAINT content_folders_parent_folder_id_fkey 
FOREIGN KEY (parent_folder_id) REFERENCES public.content_folders(id) ON DELETE CASCADE;