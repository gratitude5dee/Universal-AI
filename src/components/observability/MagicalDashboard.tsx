import React from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  Image, 
  DollarSign, 
  Activity, 
  Sparkles,
  UserCheck,
  FileImage,
  Globe,
  Wallet,
  ListChecks,
  Grid2X2,
  HeartPulse
} from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import { AgentStatusGrid } from "@/components/observability/AgentStatusGrid";
import { CreativeOutputs } from "@/components/observability/CreativeOutputs";
import { RevenueStreams } from "@/components/observability/RevenueStreams";
import { WorkflowMetrics } from "@/components/observability/WorkflowMetrics";
import { QuickAccessTiles } from "@/components/observability/QuickAccessTiles";

export const MagicalDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Active Agents" 
          value="12" 
          icon={Bot}
          trend="up"
          trendValue="3 new"
          delay={0}
        />
        <StatsCard 
          title="Creative Assets" 
          value="287" 
          icon={Image}
          trend="up"
          trendValue="24 today"
          delay={1}
        />
        <StatsCard 
          title="Revenue" 
          value="$5,243" 
          icon={DollarSign}
          trend="up"
          trendValue="12% ↑"
          delay={2}
        />
        <StatsCard 
          title="System Health" 
          value="98%" 
          icon={Activity}
          trend="up"
          trendValue="Optimal"
          delay={3}
        />
      </div>

      {/* Workflow Metrics and Quick Access in a grid - MOVED UP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-white text-shadow-sm">
            <ListChecks className="h-5 w-5 text-studio-accent" />
            Workflow Metrics
          </h2>
          <WorkflowMetrics />
        </motion.div>

        {/* Quick Access Tiles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-white text-shadow-sm">
            <Grid2X2 className="h-5 w-5 text-studio-accent" />
            Quick Access
          </h2>
          <QuickAccessTiles />
        </motion.div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status Section - 1/3 width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-white text-shadow-sm">
            <UserCheck className="h-5 w-5 text-studio-accent" />
            Agent Status
          </h2>
          <AgentStatusGrid />
        </motion.div>

        {/* Creative Outputs - 2/3 width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-white text-shadow-sm">
            <FileImage className="h-5 w-5 text-studio-accent" />
            Recent Creative Outputs
          </h2>
          <CreativeOutputs />
        </motion.div>
      </div>

      {/* Revenue Streams - Full width */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-white text-shadow-sm">
          <Wallet className="h-5 w-5 text-studio-accent" />
          Revenue Streams & Royalties
        </h2>
        <RevenueStreams />
      </motion.div>
    </div>
  );
};

export default MagicalDashboard;