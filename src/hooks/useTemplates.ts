import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DesignTemplate {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  category: 'music-bands' | 'streetwear' | 'vintage-retro' | 'minimalist' | 'typography' | 'abstract-art' | 'nature-outdoors';
  style: string;
  canvas_data: any;
  thumbnail_url?: string;
  preview_images?: string[];
  price: number;
  downloads: number;
  rating: number;
  review_count: number;
  tags?: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateFilters {
  category?: string;
  style?: string;
  priceRange?: 'free' | 'under10' | '10-25' | 'premium';
  sortBy?: 'popular' | 'newest' | 'price-low' | 'price-high';
  search?: string;
}

export const useTemplates = (filters?: TemplateFilters) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['design-templates', filters],
    queryFn: async () => {
      let query = supabase
        .from('design_templates')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.priceRange) {
        switch (filters.priceRange) {
          case 'free':
            query = query.eq('price', 0);
            break;
          case 'under10':
            query = query.gt('price', 0).lte('price', 10);
            break;
          case '10-25':
            query = query.gt('price', 10).lte('price', 25);
            break;
          case 'premium':
            query = query.gt('price', 25);
            break;
        }
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
        default:
          query = query.order('downloads', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DesignTemplate[];
    },
  });

  const useTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const template = templates?.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      // Record download/purchase
      const { error: downloadError } = await supabase
        .from('template_downloads')
        .insert({
          template_id: templateId,
          price_paid: template.price,
        } as any);

      if (downloadError) throw downloadError;

      // Increment download count
      const { error: updateError } = await supabase
        .from('design_templates')
        .update({ downloads: template.downloads + 1 })
        .eq('id', templateId);

      if (updateError) throw updateError;

      return template;
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ['design-templates'] });
      toast({
        title: 'Template added!',
        description: `"${template.name}" is ready to use in your designs.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to use template',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    templates,
    isLoading,
    useTemplate,
  };
};