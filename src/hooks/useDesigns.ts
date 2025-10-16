import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Design {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  design_type: 'apparel' | 'print' | 'accessory';
  canvas_data?: any;
  ai_prompt?: string;
  ai_json_prompt?: any;
  design_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export const useDesigns = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Design[];
    },
  });

  const createDesign = useMutation({
    mutationFn: async (design: Partial<Design>) => {
      const { data, error } = await supabase
        .from('designs')
        .insert([{
          name: design.name || 'Untitled Design',
          description: design.description,
          design_type: design.design_type || 'apparel',
          canvas_data: design.canvas_data,
          ai_prompt: design.ai_prompt,
          ai_json_prompt: design.ai_json_prompt,
          design_image_url: design.design_image_url,
          status: design.status || 'draft',
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data as Design;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast({
        title: 'Design created',
        description: 'Your design has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create design',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const updateDesign = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Design> }) => {
      const { data, error } = await supabase
        .from('designs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Design;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast({
        title: 'Design updated',
        description: 'Your changes have been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update design',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const deleteDesign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast({
        title: 'Design deleted',
        description: 'The design has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete design',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    designs,
    isLoading,
    createDesign,
    updateDesign,
    deleteDesign,
  };
};