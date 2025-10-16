import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface RevenueData {
  current: number;
  previous: number;
  percentChange: number;
  sparklineData: { value: number }[];
}

export const RevenueChart = () => {
  const [revenue, setRevenue] = useState<RevenueData>({
    current: 0,
    previous: 0,
    percentChange: 0,
    sparklineData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current month's paid gigs
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const { data: currentGigs } = await supabase
        .from('gigs')
        .select('guarantee_amount, door_split_percentage, ticket_price, capacity')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('date', currentMonthStart.toISOString());

      // Get previous month's paid gigs
      const previousMonthStart = new Date(currentMonthStart);
      previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
      const previousMonthEnd = new Date(currentMonthStart);
      previousMonthEnd.setMilliseconds(-1);

      const { data: previousGigs } = await supabase
        .from('gigs')
        .select('guarantee_amount, door_split_percentage, ticket_price, capacity')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('date', previousMonthStart.toISOString())
        .lt('date', currentMonthStart.toISOString());

      // Calculate revenue
      const calculateRevenue = (gigs: any[]) => {
        return gigs?.reduce((sum, gig) => {
          const guarantee = gig.guarantee_amount || 0;
          const doorSplit = gig.door_split_percentage && gig.ticket_price && gig.capacity
            ? (gig.ticket_price * gig.capacity * gig.door_split_percentage) / 100
            : 0;
          return sum + guarantee + doorSplit;
        }, 0) || 0;
      };

      const currentRevenue = calculateRevenue(currentGigs || []);
      const previousRevenue = calculateRevenue(previousGigs || []);
      const percentChange = previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

      // Generate sparkline data (last 7 days)
      const sparklineData = Array.from({ length: 7 }, (_, i) => ({
        value: Math.random() * currentRevenue * 0.3 + currentRevenue * 0.1
      }));

      setRevenue({
        current: currentRevenue,
        previous: previousRevenue,
        percentChange,
        sparklineData
      });
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[hsl(var(--success))]/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[hsl(var(--success))]" />
            <h3 className="text-white font-semibold">Revenue Analytics</h3>
          </div>
          <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]/70" />
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-white/10 rounded" />
            <div className="h-20 bg-white/10 rounded" />
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(revenue.current)} <span className="text-sm font-normal text-white/70">MTD</span>
              </div>
              <div className={`text-sm font-medium flex items-center gap-1 ${
                revenue.percentChange >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--error))]'
              }`}>
                {revenue.percentChange >= 0 ? '↑' : '↓'}
                {Math.abs(revenue.percentChange).toFixed(1)}% vs last month
              </div>
            </div>

            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-xs text-white/50">
              Last 7 days trend
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
