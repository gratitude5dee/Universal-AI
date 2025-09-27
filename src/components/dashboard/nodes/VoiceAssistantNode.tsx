import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Mic2, Headphones } from 'lucide-react';
import Siri from '@/components/vapi/Siri';

const VoiceAssistantNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={370} minHeight={420} />
      <div className="glass-card p-6 w-full h-full overflow-hidden flex flex-col relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6 text-white">
            <div className="p-2 glass-card-tertiary rounded-2xl">
              <Mic2 className="text-blue-400" size={20} />
            </div>
            Voice Assistant
          </h2>
          <div className="flex-1 min-h-0 glass-card-secondary p-4 mb-6">
            <Siri theme="ios9" />
          </div>
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-white">
              <div className="p-1.5 glass-card-tertiary rounded-xl">
                <Headphones size={14} className="text-cyan-400" />
              </div>
              Active Integrations
            </h3>
            <div className="space-y-3">
              <motion.div 
                className="glass-card-secondary p-4 flex items-center justify-between group/item"
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white font-medium">✓ Google Calendar</span>
                <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 group-hover/item:scale-125 transition-transform"></div>
              </motion.div>
              <motion.div 
                className="glass-card-secondary p-4 flex items-center justify-between group/item"
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white font-medium">✓ Travel Apps</span>
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 group-hover/item:scale-125 transition-transform"></div>
              </motion.div>
              <motion.div 
                className="glass-card-secondary p-4 flex items-center justify-between group/item"
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white font-medium">✓ Social Media</span>
                <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 group-hover/item:scale-125 transition-transform"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

VoiceAssistantNode.displayName = 'VoiceAssistantNode';

export default VoiceAssistantNode;