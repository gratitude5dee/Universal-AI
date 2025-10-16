import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, FlaskConical, Target, TrendingUp, Terminal, Heart, ScrollText, Bell } from "lucide-react";
import { ObservabilityDashboard } from "@/components/observability/ObservabilityDashboard";
import { EvalsFramework } from "@/components/observability/EvalsFramework";
import { ClusterAnalysis } from "@/components/observability/ClusterAnalysis";
import { AdvancedAnalytics } from "@/components/observability/AdvancedAnalytics";
import { AlertsManagement } from "@/components/observability/AlertsManagement";
import { LogsViewer } from "@/components/observability/LogsViewer";
import CommandCenter from "@/components/observability/CommandCenter";
import AgentHealthMonitor from "@/components/observability/AgentHealthMonitor";

const Observability = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Hero Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-studio-accent via-creative-primary to-business-primary bg-clip-text text-transparent">
                Observability Command Center
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Test Everything. Monitor Everything. Improve Everything.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">SYSTEM STATUS: OPTIMAL</span>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Activity className="w-4 h-4" />
                Auto-refresh: ON
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full bg-card/50 backdrop-blur-md border border-border/50 p-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="evals" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Evals</span>
            </TabsTrigger>
            <TabsTrigger value="clusters" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Clusters</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="command" className="gap-2">
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Command</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <ScrollText className="w-4 h-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ObservabilityDashboard />
          </TabsContent>

          <TabsContent value="evals" className="space-y-6">
            <EvalsFramework />
          </TabsContent>

          <TabsContent value="clusters" className="space-y-6">
            <ClusterAnalysis />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="command" className="space-y-6">
            <CommandCenter />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <AgentHealthMonitor />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogsViewer />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Observability;