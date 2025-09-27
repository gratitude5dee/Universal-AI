import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Headphones, Disc, BarChart3 } from 'lucide-react';

const FinancialOverviewNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={420} minHeight={380} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="glass-card p-8 w-full h-full overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6 text-white">
            <div className="p-2 glass-card-tertiary rounded-2xl">
              <TrendingUp className="text-emerald-400" size={20} />
            </div>
            Financial Overview
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div 
              className="glass-card-secondary p-5 text-center group/card"
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-3 glass-card-tertiary rounded-2xl w-fit mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-200">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white mb-1">$12,450</p>
              <p className="text-sm text-white/70">Monthly Revenue</p>
            </motion.div>
            <motion.div 
              className="glass-card-secondary p-5 text-center group/card"
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-3 glass-card-tertiary rounded-2xl w-fit mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-200">
                <Headphones className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-white mb-1">89.2K</p>
              <p className="text-sm text-white/70">Monthly Listeners</p>
            </motion.div>
            <motion.div 
              className="glass-card-secondary p-5 text-center group/card"
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-3 glass-card-tertiary rounded-2xl w-fit mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-200">
                <Disc className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white mb-1">7</p>
              <p className="text-sm text-white/70">Active Releases</p>
            </motion.div>
          </div>
          
          <div className="glass-card-secondary p-6">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-3">
              <div className="p-2 glass-card-tertiary rounded-xl">
                <BarChart3 className="h-4 w-4 text-purple-400" />
              </div>
              Streaming Analytics
            </h3>
            <div className="flex items-end gap-3 h-24 mb-4">
              {[65, 45, 78, 89, 56, 92, 67].map((height, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-purple-500 to-blue-400 flex-1 rounded-t-xl"
                  style={{ height: `${height}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </div>
            <p className="text-sm text-white/80 font-medium">Daily Activity • <span className="text-emerald-400">+12.5%</span> this week</p>
          </div>
        </div>
      </div>
    </>
  );
});

FinancialOverviewNode.displayName = 'FinancialOverviewNode';

export default FinancialOverviewNode;