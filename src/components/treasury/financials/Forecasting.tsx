import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ForecastRunRow {
  id: string;
  run_type: string;
  period_start: string | null;
  period_end: string | null;
  status: string;
  summary: {
    forecastAmount?: number;
    totalRevenue?: number;
    monthlyAverage?: number;
  } | null;
  created_at: string;
}

const Forecasting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: forecastRuns = [] } = useQuery({
    queryKey: ['forecast-runs'],
    queryFn: async (): Promise<ForecastRunRow[]> => {
      const { data, error } = await supabase
        .from('forecast_runs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as ForecastRunRow[];
    },
  });

  const handleRefresh = async () => {
    try {
      const { error } = await supabase.functions.invoke('forecast-refresh', {
        body: {},
      });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['forecast-runs'] });
      toast({
        title: 'Forecast refreshed',
        description: 'A new forecast run has been completed.',
      });
    } catch (error) {
      toast({
        title: 'Forecast refresh failed',
        description: error instanceof Error ? error.message : 'Unknown forecast error.',
        variant: 'destructive',
      });
    }
  };

  const latestRun = forecastRuns[0];

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">AI Revenue Forecasting</CardTitle>
          <p className="text-sm text-white/70">Projected revenue based on recent income and treasury activity.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleRefresh}>
          Refresh Forecast
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {latestRun ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">Forecast Amount</p>
              <p className="mt-2 text-3xl font-bold text-white">${Number(latestRun.summary?.forecastAmount ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">Historical Revenue</p>
              <p className="mt-2 text-3xl font-bold text-white">${Number(latestRun.summary?.totalRevenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">Monthly Average</p>
              <p className="mt-2 text-3xl font-bold text-white">${Number(latestRun.summary?.monthlyAverage ?? 0).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-white/70">
              <TrendingUp size={48} className="mx-auto mb-4" />
              <p>No forecast runs yet.</p>
              <p>Generate one to model upcoming revenue.</p>
            </div>
          </div>
        )}

        {forecastRuns.length > 0 && (
          <div className="space-y-3">
            {forecastRuns.map((run) => (
              <div key={run.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{run.run_type} forecast</p>
                    <p className="text-sm text-white/60">
                      {run.period_start ?? 'N/A'} to {run.period_end ?? 'N/A'}
                    </p>
                  </div>
                  <p className="text-sm text-white/60">{run.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Forecasting;
