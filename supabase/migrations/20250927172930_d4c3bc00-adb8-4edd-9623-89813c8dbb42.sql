-- Create stats table
CREATE TABLE public.stats (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create press_quotes table  
CREATE TABLE public.press_quotes (
    id BIGSERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    source TEXT NOT NULL,
    date DATE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create video_highlights table
CREATE TABLE public.video_highlights (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_highlights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stats
CREATE POLICY "Users can view their own stats" ON public.stats
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stats" ON public.stats
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.stats
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stats" ON public.stats
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for press_quotes
CREATE POLICY "Users can view their own press quotes" ON public.press_quotes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own press quotes" ON public.press_quotes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own press quotes" ON public.press_quotes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own press quotes" ON public.press_quotes
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for video_highlights
CREATE POLICY "Users can view their own video highlights" ON public.video_highlights
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video highlights" ON public.video_highlights
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video highlights" ON public.video_highlights
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video highlights" ON public.video_highlights
FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_stats_updated_at
    BEFORE UPDATE ON public.stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_press_quotes_updated_at
    BEFORE UPDATE ON public.press_quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_highlights_updated_at
    BEFORE UPDATE ON public.video_highlights
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();