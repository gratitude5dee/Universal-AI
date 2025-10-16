-- Merchandise Studio Database Schema

-- Designs table - Core design projects
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  design_type TEXT CHECK (design_type IN ('apparel', 'print', 'accessory')) DEFAULT 'apparel',
  canvas_data JSONB, -- Design canvas state
  ai_prompt TEXT, -- Natural language prompt
  ai_json_prompt JSONB, -- Structured AI prompt
  design_image_url TEXT, -- Generated/uploaded design image
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product templates - Base products available for customization
CREATE TABLE IF NOT EXISTS public.product_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('apparel', 'accessories', 'print')) NOT NULL,
  subcategory TEXT NOT NULL, -- 't-shirt', 'hoodie', 'poster', etc.
  base_cost NUMERIC(10,2) NOT NULL,
  print_areas JSONB, -- {front: {width: 12, height: 16}, back: {...}}
  specifications JSONB, -- Materials, sizes, colors
  mockup_settings JSONB,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mockups - Generated 3D/2D product visualizations
CREATE TABLE IF NOT EXISTS public.mockups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL,
  product_template_id UUID REFERENCES public.product_templates(id) ON DELETE CASCADE NOT NULL,
  render_settings JSONB,
  image_url TEXT NOT NULL,
  scene_type TEXT CHECK (scene_type IN ('studio', 'lifestyle', 'flat_lay', 'urban', 'hanger')) DEFAULT 'studio',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tech packs - Manufacturing documentation
CREATE TABLE IF NOT EXISTS public.tech_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL,
  product_template_id UUID REFERENCES public.product_templates(id) ON DELETE CASCADE NOT NULL,
  specifications JSONB,
  measurements JSONB,
  print_specs JSONB,
  materials JSONB,
  pdf_url TEXT,
  status TEXT CHECK (status IN ('draft', 'generated', 'sent')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design analytics - Performance tracking
CREATE TABLE IF NOT EXISTS public.design_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'purchase', 'share', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mockups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for designs
CREATE POLICY "Users can view their own designs"
  ON public.designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own designs"
  ON public.designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON public.designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
  ON public.designs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for product_templates (public read)
CREATE POLICY "Anyone can view product templates"
  ON public.product_templates FOR SELECT
  USING (TRUE);

-- RLS Policies for mockups
CREATE POLICY "Users can view mockups for their designs"
  ON public.mockups FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = mockups.design_id
    AND designs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create mockups for their designs"
  ON public.mockups FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = mockups.design_id
    AND designs.user_id = auth.uid()
  ));

-- RLS Policies for tech_packs
CREATE POLICY "Users can view tech packs for their designs"
  ON public.tech_packs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = tech_packs.design_id
    AND designs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create tech packs for their designs"
  ON public.tech_packs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = tech_packs.design_id
    AND designs.user_id = auth.uid()
  ));

-- RLS Policies for design_analytics
CREATE POLICY "Users can view analytics for their designs"
  ON public.design_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = design_analytics.design_id
    AND designs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert analytics for their designs"
  ON public.design_analytics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = design_analytics.design_id
    AND designs.user_id = auth.uid()
  ));

-- Seed product templates
INSERT INTO public.product_templates (name, category, subcategory, base_cost, print_areas, specifications, image_url) VALUES
('Classic T-Shirt', 'apparel', 't-shirt', 12.50, 
  '{"front": {"width": 12, "height": 16}, "back": {"width": 12, "height": 16}}'::jsonb,
  '{"material": "100% Cotton", "weight": "180 GSM", "sizes": ["XS", "S", "M", "L", "XL", "2XL"], "colors": ["Black", "White", "Navy", "Gray"]}'::jsonb,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
  
('Heavyweight Hoodie', 'apparel', 'hoodie', 28.50,
  '{"front": {"width": 12, "height": 16}, "back": {"width": 12, "height": 16}, "sleeve_left": {"width": 3, "height": 3}, "sleeve_right": {"width": 3, "height": 3}}'::jsonb,
  '{"material": "80% Cotton / 20% Polyester", "weight": "350 GSM", "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"], "colors": ["Black", "Navy", "Charcoal", "Forest Green"]}'::jsonb,
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
  
('Premium Poster', 'print', 'poster', 8.50,
  '{"full": {"width": 18, "height": 24}}'::jsonb,
  '{"material": "Premium Matte Paper", "weight": "200 GSM", "sizes": ["12x16", "18x24", "24x36"], "finish": ["Matte", "Glossy"]}'::jsonb,
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400'),
  
('Tote Bag', 'accessories', 'bag', 10.50,
  '{"front": {"width": 10, "height": 12}}'::jsonb,
  '{"material": "Canvas Cotton", "weight": "340 GSM", "sizes": ["One Size"], "colors": ["Natural", "Black"]}'::jsonb,
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tech_packs_updated_at
  BEFORE UPDATE ON public.tech_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();