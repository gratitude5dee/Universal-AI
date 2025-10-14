import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import SystemMetricsOverview from '@/components/observability/SystemMetricsOverview';
import WorkflowAnalytics from '@/components/observability/WorkflowAnalytics';
import CommandCenter from '@/components/observability/CommandCenter';
import AgentHealthMonitor from '@/components/observability/AgentHealthMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart3, Terminal, Wifi } from 'lucide-react';

const EnhancedObservability = () => {
  // Mock system metrics
  const systemMetrics = {
    activeAgents: 12,
    newAgentsToday: 3,
    creativeAssets: 450,
    assetsThisWeek: 28,
    revenue: 1250,
    revenueChange: 18,
    systemHealth: 97,
    healthStatus: 'optimal' as const
  };

  // Mock task metrics
  const taskMetrics = {
    completed: 234,
    inProgress: 28,
    pending: 15
  };

  // Mock weekly activity
  const weeklyActivity = [
    { day: 'Mon', creative: 45, business: 32, technical: 28 },
    { day: 'Tue', creative: 52, business: 38, technical: 35 },
    { day: 'Wed', creative: 48, business: 42, technical: 30 },
    { day: 'Thu', creative: 61, business: 45, technical: 38 },
    { day: 'Fri', creative: 55, business: 48, technical: 42 },
    { day: 'Sat', creative: 38, business: 25, technical: 20 },
    { day: 'Sun', creative: 35, business: 22, technical: 18 }
  ];

  // Mock task distribution
  const taskDistribution = [
    { name: 'Creative', value: 35 },
    { name: 'Business', value: 28 },
    { name: 'Technical', value: 22 },
    { name: 'Communication', value: 15 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observatory</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your AI agents and workflows
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="command" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Command Center
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Agent Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SystemMetricsOverview metrics={systemMetrics} />
            <WorkflowAnalytics
              taskMetrics={taskMetrics}
              weeklyActivity={weeklyActivity}
              taskDistribution={taskDistribution}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <WorkflowAnalytics
              taskMetrics={taskMetrics}
              weeklyActivity={weeklyActivity}
              taskDistribution={taskDistribution}
            />
          </TabsContent>

          <TabsContent value="command">
            <CommandCenter />
          </TabsContent>

          <TabsContent value="health">
            <AgentHealthMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedObservability;
