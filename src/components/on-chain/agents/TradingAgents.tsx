import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bot, TrendingUp, Activity, Pause, Play, Settings, Trash2 } from 'lucide-react';
import { mockTradingAgents, getTotalManagedValue, getActiveAgentsCount, getTotalTrades24h, getAveragePerformance24h } from '@/data/on-chain/mockAgents';
import { getChainById } from '@/data/on-chain/chains';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ConfirmDialog } from '../shared/ConfirmDialog';

export const TradingAgents = () => {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; agentId: string; action: 'pause' | 'stop' } | null>(null);
  
  const totalValue = getTotalManagedValue();
  const activeAgents = getActiveAgentsCount();
  const totalTrades = getTotalTrades24h();
  const avgPerformance = getAveragePerformance24h();

  const handleAgentAction = (agentId: string, action: 'pause' | 'stop') => {
    setConfirmDialog({ open: true, agentId, action });
  };

  const confirmAgentAction = () => {
    if (!confirmDialog) return;
    
    const agent = mockTradingAgents.find(a => a.id === confirmDialog.agentId);
    if (confirmDialog.action === 'pause') {
      toast.success(`${agent?.name} has been paused`);
    } else {
      toast.warning(`${agent?.name} has been stopped`);
    }
    setConfirmDialog(null);
  };

  const stats = [
    { 
      label: 'Managed Value', 
      value: `$${totalValue.toLocaleString()}`, 
      color: 'text-blue-400',
      tooltip: 'Total value managed across all agents'
    },
    { 
      label: 'Active Agents', 
      value: activeAgents, 
      color: 'text-green-400',
      tooltip: 'Number of currently active trading agents'
    },
    { 
      label: 'Trades (24h)', 
      value: totalTrades, 
      color: 'text-yellow-400',
      tooltip: 'Total trades executed in the last 24 hours'
    },
    { 
      label: 'Avg Performance', 
      value: `+${avgPerformance.toFixed(1)}%`, 
      color: 'text-purple-400',
      tooltip: '24-hour average performance across active agents'
    },
  ];

  const getStrategyBadgeColor = (strategy: string) => {
    const colors: Record<string, string> = {
      'trend-following': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'dca': 'bg-green-500/20 text-green-400 border-green-500/30',
      'grid-trading': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'arbitrage': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[strategy] || 'bg-gray-500/20 text-gray-400';
  };

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="glass-card p-4 hover:bg-accent/10 transition-all duration-300 hover:scale-105 cursor-pointer border-t-4 border-t-transparent hover:border-t-primary">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</p>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stat.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Trading Agents ({mockTradingAgents.length})</h3>
          <Button className="hover-scale gap-2">
            <Bot className="h-4 w-4 mr-2" />
            Deploy New Agent
          </Button>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockTradingAgents.map((agent, idx) => {
            const chain = getChainById(agent.chain);
            const isActive = agent.status === 'active';

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card p-5 hover:bg-accent/10 transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-blue-500 animate-fade-in group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{agent.name}</h4>
                        <div className="flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${
                            isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                          }`} />
                          <span className="text-xs text-muted-foreground uppercase">
                            {agent.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStrategyBadgeColor(agent.strategy)}>
                          {agent.strategy.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {chain && (
                          <Badge variant="outline" className="text-xs">
                            {chain.icon} {chain.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => toast.info(`Configure ${agent.name}`)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Configure agent</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Assets */}
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm text-muted-foreground">Managing:</p>
                    <div className="flex gap-1">
                      {agent.managedAssets.map(asset => (
                        <Badge key={asset} variant="secondary" className="text-xs">{asset}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Portfolio Value</p>
                      <p className="font-semibold">${agent.portfolioValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">24h Performance</p>
                      <p className={`font-semibold ${agent.performance24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {agent.performance24h >= 0 ? '+' : ''}{agent.performance24h.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">All-Time ROI</p>
                      <p className="font-semibold text-green-400">+{agent.performanceAllTime.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        <Activity className="h-3 w-3 inline mr-1" />
                        {agent.trades24h} trades today
                      </span>
                      <span className="text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {agent.successRate.toFixed(1)}% win rate
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'pause')}
                        >
                          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isActive ? 'Pause agent' : 'Activate agent'}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'stop')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Stop agent</TooltipContent>
                    </Tooltip>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <ConfirmDialog
          open={confirmDialog?.open || false}
          onOpenChange={(open) => !open && setConfirmDialog(null)}
          title={confirmDialog?.action === 'pause' ? 'Pause Trading Agent?' : 'Stop Trading Agent?'}
          description={
            confirmDialog?.action === 'pause'
              ? 'The agent will stop executing trades but retain its current positions.'
              : 'The agent will close all positions and stop trading. This action cannot be undone.'
          }
          confirmText={confirmDialog?.action === 'pause' ? 'Pause' : 'Stop'}
          onConfirm={confirmAgentAction}
          variant={confirmDialog?.action === 'stop' ? 'destructive' : 'default'}
        />
      </motion.div>
    </TooltipProvider>
  );
};
