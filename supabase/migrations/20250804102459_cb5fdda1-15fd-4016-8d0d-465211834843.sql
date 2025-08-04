-- Create boards table for infinite canvas projects
CREATE TABLE public.boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Canvas',
  description TEXT,
  slug TEXT UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  canvas_data JSONB NOT NULL DEFAULT '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create board collaborators table
CREATE TABLE public.board_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id UUID,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(board_id, user_id),
  UNIQUE(board_id, email)
);

-- Create board shares table for public sharing
CREATE TABLE public.board_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  share_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create board comments table
CREATE TABLE public.board_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  node_id TEXT,
  content TEXT NOT NULL,
  position_x DOUBLE PRECISION,
  position_y DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI runs table for tracking AI interactions
CREATE TABLE public.ai_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  model TEXT NOT NULL DEFAULT 'llama-3.1-8b',
  tokens_used INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'streaming', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  created_nodes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can view boards they own or collaborate on" 
ON public.boards FOR SELECT 
USING (
  auth.uid() = user_id OR 
  id IN (
    SELECT board_id FROM public.board_collaborators 
    WHERE user_id = auth.uid() AND status = 'accepted'
  ) OR
  is_public = true
);

CREATE POLICY "Users can create their own boards" 
ON public.boards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update boards they own or have editor access" 
ON public.boards FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  id IN (
    SELECT board_id FROM public.board_collaborators 
    WHERE user_id = auth.uid() AND role IN ('editor', 'owner') AND status = 'accepted'
  )
);

CREATE POLICY "Users can delete their own boards" 
ON public.boards FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for board_collaborators
CREATE POLICY "Users can view collaborators for boards they have access to" 
ON public.board_collaborators FOR SELECT 
USING (
  board_id IN (
    SELECT id FROM public.boards 
    WHERE auth.uid() = user_id OR 
    id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  )
);

CREATE POLICY "Board owners can manage collaborators" 
ON public.board_collaborators FOR ALL 
USING (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own collaboration status" 
ON public.board_collaborators FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for board_shares
CREATE POLICY "Anyone can view shared boards" 
ON public.board_shares FOR SELECT 
USING (true);

CREATE POLICY "Board owners can create shares" 
ON public.board_shares FOR INSERT 
WITH CHECK (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
  ) AND 
  created_by = auth.uid()
);

-- RLS Policies for board_comments
CREATE POLICY "Users can view comments for boards they have access to" 
ON public.board_comments FOR SELECT 
USING (
  board_id IN (
    SELECT id FROM public.boards 
    WHERE auth.uid() = user_id OR 
    id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    ) OR
    is_public = true
  )
);

CREATE POLICY "Users can create comments on accessible boards" 
ON public.board_comments FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  board_id IN (
    SELECT id FROM public.boards 
    WHERE auth.uid() = user_id OR 
    id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND role IN ('editor', 'owner') AND status = 'accepted'
    )
  )
);

CREATE POLICY "Users can update their own comments" 
ON public.board_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.board_comments FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for ai_runs
CREATE POLICY "Users can view their own AI runs" 
ON public.ai_runs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI runs for boards they have access to" 
ON public.ai_runs FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  board_id IN (
    SELECT id FROM public.boards 
    WHERE auth.uid() = user_id OR 
    id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND role IN ('editor', 'owner') AND status = 'accepted'
    )
  )
);

CREATE POLICY "Users can update their own AI runs" 
ON public.ai_runs FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_boards_user_id ON public.boards(user_id);
CREATE INDEX idx_boards_slug ON public.boards(slug);
CREATE INDEX idx_boards_is_public ON public.boards(is_public);
CREATE INDEX idx_board_collaborators_board_id ON public.board_collaborators(board_id);
CREATE INDEX idx_board_collaborators_user_id ON public.board_collaborators(user_id);
CREATE INDEX idx_board_shares_share_id ON public.board_shares(share_id);
CREATE INDEX idx_board_comments_board_id ON public.board_comments(board_id);
CREATE INDEX idx_ai_runs_board_id ON public.ai_runs(board_id);
CREATE INDEX idx_ai_runs_user_id ON public.ai_runs(user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_board_collaborators_updated_at
  BEFORE UPDATE ON public.board_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_board_comments_updated_at
  BEFORE UPDATE ON public.board_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique board slugs
CREATE OR REPLACE FUNCTION public.generate_board_slug(board_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base slug from title
  base_slug := lower(regexp_replace(board_title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- If empty, use default
  IF base_slug = '' THEN
    base_slug := 'untitled-canvas';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and increment if needed
  WHILE EXISTS (SELECT 1 FROM public.boards WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;