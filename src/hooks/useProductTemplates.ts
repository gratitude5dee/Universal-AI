import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductTemplate {
  id: string;
  name: string;
  category: 'apparel' | 'accessories' | 'print';
  subcategory: string;
  base_cost: number;
  print_areas: any;
  specifications: any;
  mockup_settings?: any;
  image_url?: string;
  available: boolean;
  created_at: string;
}

export const useProductTemplates = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['product-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data as ProductTemplate[];
    },
  });

  const getTemplatesByCategory = (category: 'apparel' | 'accessories' | 'print') => {
    return templates?.filter(t => t.category === category) || [];
  };

  return {
    templates,
    isLoading,
    getTemplatesByCategory,
  };
};