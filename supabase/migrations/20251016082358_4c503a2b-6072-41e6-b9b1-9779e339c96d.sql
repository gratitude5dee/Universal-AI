-- Template Marketplace Tables

-- Design templates table
CREATE TABLE IF NOT EXISTS public.design_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('music-bands', 'streetwear', 'vintage-retro', 'minimalist', 'typography', 'abstract-art', 'nature-outdoors')),
  style TEXT NOT NULL,
  canvas_data JSONB NOT NULL,
  thumbnail_url TEXT,
  preview_images TEXT[] DEFAULT '{}',
  price NUMERIC(10,2) NOT NULL DEFAULT 0, -- 0 for free
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template reviews table
CREATE TABLE IF NOT EXISTS public.template_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.design_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

-- Template downloads/purchases table
CREATE TABLE IF NOT EXISTS public.template_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.design_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  price_paid NUMERIC(10,2) NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Kit System Tables

-- Brand kits table
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  logo_primary_url TEXT,
  logo_secondary_url TEXT,
  logo_icon_url TEXT,
  color_palette JSONB DEFAULT '[]', -- [{name: 'Primary', color: '#1E40AF', usage: 'Headlines'}]
  typography JSONB DEFAULT '{}', -- {heading: 'Montserrat Bold', body: 'Open Sans', accent: 'Bebas Neue'}
  guidelines_pdf_url TEXT,
  logo_min_size NUMERIC,
  logo_clear_space NUMERIC,
  usage_rules TEXT[],
  auto_apply_to_designs BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.design_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for design_templates
CREATE POLICY "Anyone can view active templates"
  ON public.design_templates FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Creators can create templates"
  ON public.design_templates FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own templates"
  ON public.design_templates FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own templates"
  ON public.design_templates FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies for template_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.template_reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create reviews"
  ON public.template_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.template_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.template_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for template_downloads
CREATE POLICY "Users can view their own downloads"
  ON public.template_downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create downloads"
  ON public.template_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for brand_kits
CREATE POLICY "Users can view their own brand kits"
  ON public.brand_kits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand kits"
  ON public.brand_kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand kits"
  ON public.brand_kits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand kits"
  ON public.brand_kits FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_design_templates_category ON public.design_templates(category);
CREATE INDEX idx_design_templates_creator ON public.design_templates(creator_id);
CREATE INDEX idx_design_templates_featured ON public.design_templates(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_design_templates_price ON public.design_templates(price);
CREATE INDEX idx_template_reviews_template ON public.template_reviews(template_id);
CREATE INDEX idx_template_downloads_user ON public.template_downloads(user_id);
CREATE INDEX idx_brand_kits_user ON public.brand_kits(user_id);
CREATE INDEX idx_brand_kits_default ON public.brand_kits(user_id, is_default) WHERE is_default = TRUE;

-- Seed some example templates
INSERT INTO public.design_templates (name, description, category, style, canvas_data, thumbnail_url, price, tags, is_featured) VALUES
('Vintage Jazz Poster', 'Classic art deco jazz festival poster design', 'music-bands', 'art_deco', '{"version":"5.3.0","objects":[]}'::jsonb, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', 12.00, ARRAY['jazz', 'vintage', 'poster', 'music'], TRUE),
('Streetwear Logo Template', 'Bold urban streetwear logo design', 'streetwear', 'modern', '{"version":"5.3.0","objects":[]}'::jsonb, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 15.00, ARRAY['streetwear', 'logo', 'urban', 'bold'], TRUE),
('Minimalist Band Tee', 'Clean minimalist t-shirt design for bands', 'minimalist', 'minimalist', '{"version":"5.3.0","objects":[]}'::jsonb, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 0, ARRAY['minimalist', 'band', 'free', 'tshirt'], FALSE),
('Retro 80s Aesthetic', 'Nostalgic 80s-inspired design template', 'vintage-retro', 'retro', '{"version":"5.3.0","objects":[]}'::jsonb, 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400', 8.00, ARRAY['80s', 'retro', 'neon', 'vintage'], FALSE),
('Abstract Geometric Art', 'Modern abstract geometric pattern', 'abstract-art', 'geometric', '{"version":"5.3.0","objects":[]}'::jsonb, 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400', 10.00, ARRAY['abstract', 'geometric', 'modern'], TRUE);

-- Update trigger for design_templates
CREATE TRIGGER update_design_templates_updated_at
  BEFORE UPDATE ON public.design_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for brand_kits
CREATE TRIGGER update_brand_kits_updated_at
  BEFORE UPDATE ON public.brand_kits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();