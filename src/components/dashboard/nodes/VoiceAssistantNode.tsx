import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Mic2, Headphones } from 'lucide-react';
import Siri from '@/components/vapi/Siri';

const VoiceAssistantNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={350} minHeight={400} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
          <Mic2 className="text-[#9b87f5]" size={20} />
          Artist Voice Assistant
        </h2>
        <div className="flex-1 min-h-0">
          <Siri theme="ios9" />
        </div>
        <div className="mt-2 pt-2 border-t border-studio-sand/30 flex-shrink-0">
          <h3 className="text-xs font-medium mb-2 flex items-center gap-1.5">
            <Headphones size={12} className="text-[#9b87f5]" />
            Active Integrations
          </h3>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            <motion.div 
              className="w-full text-left p-2 flex items-center justify-between rounded-lg glass-card border border-white/10 backdrop-blur-md text-xs"
              whileHover={{ x: 2 }}
            >
              <span>✓ Google Calendar</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </motion.div>
            <motion.div 
              className="w-full text-left p-3 flex items-center justify-between rounded-lg glass-card border border-white/10 backdrop-blur-md text-sm"
              whileHover={{ x: 3 }}
            >
              <span>✓ Travel Apps</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </motion.div>
            <motion.div 
              className="w-full text-left p-3 flex items-center justify-between rounded-lg glass-card border border-white/10 backdrop-blur-md text-sm"
              whileHover={{ x: 3 }}
            >
              <span>✓ Social Media</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
});

VoiceAssistantNode.displayName = 'VoiceAssistantNode';

export default VoiceAssistantNode;