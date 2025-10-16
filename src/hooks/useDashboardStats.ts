import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  total_gigs: number;
  upcoming_gigs: number;
  pending_gigs: number;
  total_revenue: number;
  unpaid_invoices_count: number;
  unpaid_invoices_amount: number;
  overdue_invoices_count: number;
  avg_payment_days: number;
  total_contacts: number;
  total_venues: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-dashboard-stats');
      
      if (error) throw error;
      
      return data as DashboardStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
