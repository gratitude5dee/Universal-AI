import React from "react";
import { motion } from "framer-motion";
import { Sprout, Sun, Droplets, Clover } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

const GardenOverviewStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatsCard 
        title="Total Growth" 
        value="124.8K" 
        icon={Sprout}
        trend="up"
        trendValue="18%"
        delay={0}
      />
      <StatsCard 
        title="Sunshine Hours" 
        value="856" 
        icon={Sun}
        trend="up"
        trendValue="12%"
        delay={1}
      />
      <StatsCard 
        title="Water Supply" 
        value="643L" 
        icon={Droplets}
        trend="up"
        trendValue="8%"
        delay={2}
      />
      <StatsCard 
        title="Garden Health" 
        value="92%" 
        icon={Clover}
        trend="up"
        trendValue="4%"
        delay={3}
      />
    </div>
  );
};

export default GardenOverviewStats;