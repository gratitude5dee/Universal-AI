import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MerchandiseOrder {
  id: string;
  user_id: string;
  design_id?: string;
  product_template_id?: string;
  order_type: 'sample' | 'bulk' | 'custom';
  status: 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
  unit_price: number;
  total_cost: number;
  shipping_cost: number;
  tax_amount: number;
  fulfillment_provider?: 'printful' | 'printify' | 'internal' | 'custom';
  external_order_id?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipping_address: any;
  product_details: any;
  mockup_urls?: string[];
  notes?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['merchandise-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merchandise_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MerchandiseOrder[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: Partial<MerchandiseOrder>) => {
      const { data, error } = await supabase
        .from('merchandise_orders')
        .insert([orderData as any])
        .select()
        .single();

      if (error) throw error;
      return data as MerchandiseOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchandise-orders'] });
      toast({
        title: 'Order created',
        description: 'Your order has been placed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create order',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: MerchandiseOrder['status'] }) => {
      const { data, error } = await supabase
        .from('merchandise_orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as MerchandiseOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchandise-orders'] });
      toast({
        title: 'Order updated',
        description: 'Order status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update order',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
  };
};