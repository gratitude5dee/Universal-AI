import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowUpRight, 
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PositionRow {
  id: string;
  chain: string;
  asset_symbol: string;
  balance: number;
  usd_value: number;
  change_24h: number | null;
  status: 'connected' | 'syncing' | 'error';
  provider_id: string;
  wallet_address: string | null;
  synced_at: string;
  attributed_revenue: number;
}

interface RevenueRow {
  id: string;
  source_type: string;
  amount: number;
  occurred_at: string;
}

const MultiChainDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: positions = [] } = useQuery({
    queryKey: ['multichain-positions'],
    queryFn: async (): Promise<PositionRow[]> => {
      const { data, error } = await supabase
        .from('multichain_dashboard_positions_v1')
        .select('*')
        .order('usd_value', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as PositionRow[];
    },
  });

  const { data: revenueSources = [] } = useQuery({
    queryKey: ['revenue-sources'],
    queryFn: async (): Promise<RevenueRow[]> => {
      const { data, error } = await supabase
        .from('revenue_sources')
        .select('id, source_type, amount, occurred_at')
        .order('occurred_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      return (data ?? []) as RevenueRow[];
    },
  });

  const totalUsdValue = positions.reduce((sum, position) => sum + Number(position.usd_value ?? 0), 0);
  const totalRevenue = revenueSources.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['multichain-positions'] }),
      queryClient.invalidateQueries({ queryKey: ['revenue-sources'] }),
    ]);

    toast({
      title: 'Portfolio refreshed',
      description: 'Multi-chain balances and revenue sources were reloaded.',
    });
  };

  const getStatusIcon = (status: PositionRow['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Multi-Chain Portfolio</h2>
            <p className="text-white/70">Positions and revenue aggregated from the shared finance ledger.</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-white/70 text-sm mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white">${totalUsdValue.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-1 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              {positions.length} tracked positions
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-2">Attributed Revenue</p>
            <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            <p className="text-white/70 text-sm mt-1">
              Based on the normalized `revenue_sources` ledger
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="balances" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Chain Balances
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Revenue Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position) => (
              <Card key={position.id} className="glass-card border-white/10 backdrop-blur-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{position.chain}</p>
                      <p className="text-sm text-white/60">{position.provider_id}</p>
                    </div>
                    {getStatusIcon(position.status)}
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {Number(position.balance ?? 0).toLocaleString()} {position.asset_symbol}
                  </p>
                  <p className="text-white/70 mt-1">${Number(position.usd_value ?? 0).toLocaleString()}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {position.wallet_address ? `${position.wallet_address.slice(0, 6)}...${position.wallet_address.slice(-4)}` : 'No wallet'}
                    </Badge>
                    <p className="text-xs text-white/50">
                      {new Date(position.synced_at).toLocaleTimeString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <div className="space-y-3">
            {revenueSources.map((row) => (
              <Card key={row.id} className="glass-card border-white/10 backdrop-blur-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{row.source_type}</p>
                    <p className="text-sm text-white/60">{new Date(row.occurred_at).toLocaleString()}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">${Number(row.amount ?? 0).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiChainDashboard;
