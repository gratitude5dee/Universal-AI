import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Music, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FinancialOverviewNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={400} minHeight={350} />
      <div className="glass-card p-6 w-full h-full border-2 border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4 flex-shrink-0">
          <TrendingUp className="text-[#9b87f5]" size={20} />
          Financial Overview
        </h2>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-[#9b87f5] mr-2" />
                <span className="text-2xl font-bold text-studio-charcoal">$12.4k</span>
              </div>
              <p className="text-sm text-studio-clay">Monthly Revenue</p>
            </div>
            <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-[#33C3F0] mr-2" />
                <span className="text-2xl font-bold text-studio-charcoal">45.2k</span>
              </div>
              <p className="text-sm text-studio-clay">Monthly Listeners</p>
            </div>
            <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Music className="h-5 w-5 text-[#F97316] mr-2" />
                <span className="text-2xl font-bold text-studio-charcoal">23</span>
              </div>
              <p className="text-sm text-studio-clay">Active Releases</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-studio-sand/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Activity size={14} className="text-[#9b87f5]" />
                Streaming Analytics
              </h3>
              <span className="text-xs text-green-500">↗ +12.3%</span>
            </div>
            <div className="p-4 glass-card border border-white/10 backdrop-blur-md rounded-lg">
              <div className="flex items-end h-16 gap-1">
                {[45, 52, 38, 61, 73, 67, 81].map((value, index) => (
                  <div key={index} className="flex-1 bg-gradient-to-t from-[#9b87f5]/60 to-[#9b87f5]/20 rounded-t" 
                       style={{ height: `${(value / 81) * 100}%` }}>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-studio-clay mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
});

FinancialOverviewNode.displayName = 'FinancialOverviewNode';

export default FinancialOverviewNode;