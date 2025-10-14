import React from 'react';
import MetricsCard from './MetricsCard';
import { Bot, Sparkles, DollarSign, Activity } from 'lucide-react';

interface SystemMetrics {
  activeAgents: number;
  newAgentsToday: number;
  creativeAssets: number;
  assetsThisWeek: number;
  revenue: number;
  revenueChange: number;
  systemHealth: number;
  healthStatus: 'optimal' | 'warning' | 'critical';
}

interface SystemMetricsOverviewProps {
  metrics: SystemMetrics;
}

const SystemMetricsOverview: React.FC<SystemMetricsOverviewProps> = ({ metrics }) => {
  const getHealthColor = () => {
    if (metrics.systemHealth >= 90) return 'text-green-500';
    if (metrics.systemHealth >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricsCard
        title="Active Agents"
        value={metrics.activeAgents}
        change={metrics.newAgentsToday}
        changeLabel="new today"
        icon={Bot}
        iconColor="text-blue-500"
        trend="up"
      />
      
      <MetricsCard
        title="Creative Assets"
        value={metrics.creativeAssets.toLocaleString()}
        change={metrics.assetsThisWeek}
        changeLabel="this week"
        icon={Sparkles}
        iconColor="text-purple-500"
        trend="up"
      />
      
      <MetricsCard
        title="Revenue"
        value={`$${metrics.revenue.toLocaleString()}`}
        change={metrics.revenueChange}
        changeLabel="vs last month"
        icon={DollarSign}
        iconColor="text-green-500"
        trend={metrics.revenueChange >= 0 ? 'up' : 'down'}
      />
      
      <MetricsCard
        title="System Health"
        value={`${metrics.systemHealth}%`}
        changeLabel={metrics.healthStatus}
        icon={Activity}
        iconColor={getHealthColor()}
        trend={metrics.systemHealth >= 90 ? 'up' : metrics.systemHealth >= 70 ? 'neutral' : 'down'}
      />
    </div>
  );
};

export default SystemMetricsOverview;
