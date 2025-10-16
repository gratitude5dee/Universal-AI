import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BrandKit {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  logo_primary_url?: string;
  logo_secondary_url?: string;
  logo_icon_url?: string;
  color_palette: Array<{
    name: string;
    color: string;
    usage: string;
  }>;
  typography: {
    heading?: string;
    body?: string;
    accent?: string;
  };
  guidelines_pdf_url?: string;
  logo_min_size?: number;
  logo_clear_space?: number;
  usage_rules?: string[];
  auto_apply_to_designs: boolean;
  created_at: string;
  updated_at: string;
}

export const useBrandKits = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: brandKits, isLoading } = useQuery({
    queryKey: ['brand-kits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_kits')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BrandKit[];
    },
  });

  const defaultBrandKit = brandKits?.find(kit => kit.is_default);

  const createBrandKit = useMutation({
    mutationFn: async (brandKit: Partial<BrandKit>) => {
      const { data, error } = await supabase
        .from('brand_kits')
        .insert([{
          name: brandKit.name || 'New Brand Kit',
          is_default: brandKit.is_default || false,
          logo_primary_url: brandKit.logo_primary_url,
          logo_secondary_url: brandKit.logo_secondary_url,
          logo_icon_url: brandKit.logo_icon_url,
          color_palette: brandKit.color_palette || [],
          typography: brandKit.typography || {},
          guidelines_pdf_url: brandKit.guidelines_pdf_url,
          logo_min_size: brandKit.logo_min_size,
          logo_clear_space: brandKit.logo_clear_space,
          usage_rules: brandKit.usage_rules || [],
          auto_apply_to_designs: brandKit.auto_apply_to_designs ?? true,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data as BrandKit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-kits'] });
      toast({
        title: 'Brand kit created',
        description: 'Your brand identity has been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create brand kit',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const updateBrandKit = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BrandKit> }) => {
      // If setting as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from('brand_kits')
          .update({ is_default: false })
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('brand_kits')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BrandKit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-kits'] });
      toast({
        title: 'Brand kit updated',
        description: 'Your changes have been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update brand kit',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const deleteBrandKit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('brand_kits')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-kits'] });
      toast({
        title: 'Brand kit deleted',
        description: 'The brand kit has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete brand kit',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    brandKits,
    defaultBrandKit,
    isLoading,
    createBrandKit,
    updateBrandKit,
    deleteBrandKit,
  };
};