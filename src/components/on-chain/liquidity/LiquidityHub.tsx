import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Droplet, TrendingUp, DollarSign, Gift } from 'lucide-react';
import { mockLiquidityPositions, getTotalLiquidityValue, getAverageAPY, getTotalDailyEarnings, getTotalUnclaimedRewards } from '@/data/on-chain/mockLiquidity';
import { getChainById } from '@/data/on-chain/chains';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ConfirmDialog } from '../shared/ConfirmDialog';

export const LiquidityHub = () => {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; positionId: string; action: 'claim' | 'remove' } | null>(null);
  
  const totalValue = getTotalLiquidityValue();
  const avgAPY = getAverageAPY();
  const dailyEarnings = getTotalDailyEarnings();
  const unclaimedRewards = getTotalUnclaimedRewards();

  const handleClaimAll = () => {
    toast.success(`Claimed $${unclaimedRewards.toFixed(2)} in rewards!`, {
      description: 'Rewards have been transferred to your wallet',
    });
  };

  const handlePositionAction = (positionId: string, action: 'claim' | 'remove') => {
    setConfirmDialog({ open: true, positionId, action });
  };

  const confirmPositionAction = () => {
    if (!confirmDialog) return;
    
    const position = mockLiquidityPositions.find(p => p.id === confirmDialog.positionId);
    if (confirmDialog.action === 'claim') {
      toast.success(`Claimed $${position?.unclaimedRewards.toFixed(2)}!`);
    } else {
      toast.info(`Removed liquidity from ${position?.pool}`);
    }
    setConfirmDialog(null);
  };

  const stats = [
    { label: 'Total Liquidity', value: `$${totalValue.toLocaleString()}`, icon: Droplet, color: 'text-blue-400' },
    { label: 'Average APY', value: `${avgAPY.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Daily Earnings', value: `$${dailyEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-yellow-400' },
    { label: 'Unclaimed Rewards', value: `$${unclaimedRewards.toFixed(2)}`, icon: Gift, color: 'text-purple-400' },
  ];

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-card p-4 hover:bg-accent/10 transition-all duration-300 hover:scale-105 cursor-pointer border-t-4 border-t-transparent hover:border-t-primary">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color} animate-pulse`} />
                <p className="text-sm">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card className="glass-card p-6 group hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Daily Earnings (30 Days)</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover-scale gap-2"
            onClick={handleClaimAll}
          >
            <Gift className="h-4 w-4" />
            Claim All Rewards
          </Button>
        </div>
        <div className="h-48 flex items-center justify-center bg-gradient-to-br from-green-500/5 to-emerald-500/10 rounded-lg border border-border/50 relative overflow-hidden group-hover:border-green-500/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse" />
          <p className="text-muted-foreground relative z-10">Chart: Daily earnings area chart</p>
        </div>
      </Card>

      {/* Active Positions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Positions ({mockLiquidityPositions.length})</h3>
          <Button className="hover-scale gap-2">
            <Droplet className="h-4 w-4" />
            + Add Liquidity
          </Button>
        </div>

        <div className="space-y-3">
          {mockLiquidityPositions.map((position) => {
            const chain = getChainById(position.chain);
            
            return (
              <Card key={position.id} className="glass-card p-5 hover:bg-accent/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Protocol & Pool */}
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{position.pool}</h4>
                      <Badge variant="secondary">{position.protocol}</Badge>
                      {chain && (
                        <Badge variant="outline" className="text-xs">
                          {chain.icon} {chain.name}
                        </Badge>
                      )}
                      {position.apy > 30 && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                          🔥 High APY
                        </Badge>
                      )}
                    </div>

                    {/* Token Composition */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {position.tokens.map((token, idx) => (
                        <span key={idx}>
                          {token.amount.toLocaleString()} {token.symbol}
                        </span>
                      ))}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-semibold">${position.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">APY</p>
                        <p className="font-semibold text-green-400">{position.apy.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pool Share</p>
                        <p className="font-semibold">{position.poolShare.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Earnings</p>
                        <p className="font-semibold">${position.dailyEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Unclaimed</p>
                        <p className="font-semibold text-yellow-400">${position.unclaimedRewards.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePositionAction(position.id, 'remove')}
                        >
                          Manage
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Manage position</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => handlePositionAction(position.id, 'claim')}
                        >
                          Claim
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Claim ${position.unclaimedRewards.toFixed(2)}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog?.open || false}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        title={confirmDialog?.action === 'claim' ? 'Claim Rewards?' : 'Remove Liquidity?'}
        description={
          confirmDialog?.action === 'claim'
            ? 'Rewards will be transferred to your wallet.'
            : 'Removing liquidity will withdraw your tokens from the pool. You can add them back later.'
        }
        confirmText={confirmDialog?.action === 'claim' ? 'Claim' : 'Remove'}
        onConfirm={confirmPositionAction}
        variant={confirmDialog?.action === 'remove' ? 'destructive' : 'default'}
      />
    </motion.div>
    </TooltipProvider>
  );
};
