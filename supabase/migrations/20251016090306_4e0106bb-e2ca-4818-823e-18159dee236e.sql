-- Create print_partner_connections table
CREATE TABLE IF NOT EXISTS public.print_partner_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('printful', 'printify', 'internal', 'custom')),
  api_key_hash TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  provider_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.print_partner_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own print partner connections"
  ON public.print_partner_connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own print partner connections"
  ON public.print_partner_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own print partner connections"
  ON public.print_partner_connections
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own print partner connections"
  ON public.print_partner_connections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_print_partner_connections_user_id ON public.print_partner_connections(user_id);
CREATE INDEX idx_print_partner_connections_provider ON public.print_partner_connections(provider, is_enabled);

-- Trigger for updated_at
CREATE TRIGGER update_print_partner_connections_updated_at
  BEFORE UPDATE ON public.print_partner_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();