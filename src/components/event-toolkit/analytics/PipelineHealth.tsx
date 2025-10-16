import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PipelineStats {
  new: number;
  negotiating: number;
  accepted: number;
  contracted: number;
  paid: number;
  totalValue: number;
  conversionRate: number;
  needsAttention: number;
}

export const PipelineHealth = () => {
  const [stats, setStats] = useState<PipelineStats>({
    new: 0,
    negotiating: 0,
    accepted: 0,
    contracted: 0,
    paid: 0,
    totalValue: 0,
    conversionRate: 0,
    needsAttention: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipelineStats();
  }, []);

  const fetchPipelineStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: gigs } = await supabase
        .from('gigs')
        .select('status, guarantee_amount, updated_at')
        .eq('user_id', user.id);

      if (!gigs) return;

      const statusCounts = {
        new: 0,
        negotiating: 0,
        accepted: 0,
        contracted: 0,
        paid: 0
      };

      let totalValue = 0;
      let needsAttention = 0;

      gigs.forEach(gig => {
        const status = gig.status as keyof typeof statusCounts;
        if (status in statusCounts) {
          statusCounts[status]++;
        }

        if (gig.guarantee_amount) {
          totalValue += gig.guarantee_amount;
        }

        // Check if needs attention (no update in 7 days for negotiating/accepted)
        if ((status === 'negotiating' || status === 'accepted') && gig.updated_at) {
          const daysSinceUpdate = Math.floor(
            (Date.now() - new Date(gig.updated_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceUpdate > 7) {
            needsAttention++;
          }
        }
      });

      const total = gigs.length;
      const conversionRate = total > 0 ? (statusCounts.paid / total) * 100 : 0;

      setStats({
        ...statusCounts,
        totalValue,
        conversionRate,
        needsAttention
      });
    } catch (error) {
      console.error('Error fetching pipeline stats:', error);
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

  const stageColors = {
    new: 'hsl(258 90% 66%)',      // Purple
    negotiating: 'hsl(38 92% 50%)', // Yellow
    accepted: 'hsl(217 91% 60%)',   // Blue
    contracted: 'hsl(189 94% 43%)', // Cyan
    paid: 'hsl(158 64% 52%)'        // Green
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[hsl(var(--accent-blue))]/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[hsl(var(--accent-blue))]" />
            <h3 className="text-white font-semibold">Pipeline Health</h3>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.new + stats.negotiating + stats.accepted} active
                </div>
                <div className="text-sm text-white/70">
                  Est. value: {formatCurrency(stats.totalValue)}
                </div>
              </div>

              {/* Funnel Visualization */}
              <div className="space-y-2">
                {Object.entries(stats).filter(([key]) => 
                  ['new', 'negotiating', 'accepted', 'contracted', 'paid'].includes(key)
                ).map(([stage, count]) => {
                  const total = stats.new + stats.negotiating + stats.accepted + stats.contracted + stats.paid;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  const color = stageColors[stage as keyof typeof stageColors];
                  
                  return (
                    <div key={stage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/80 capitalize">{stage}</span>
                        <span className="text-white/60">{count}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Close rate</span>
                  <span className="text-[hsl(var(--success))] font-medium">
                    {stats.conversionRate.toFixed(0)}%
                  </span>
                </div>

                {stats.needsAttention > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--warning))]">
                    <AlertCircle className="h-4 w-4" />
                    <span>{stats.needsAttention} gigs need attention</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
