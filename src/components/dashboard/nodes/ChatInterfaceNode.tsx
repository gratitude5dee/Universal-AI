import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatInterfaceNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={470} minHeight={520} />
      <div className="glass-card p-6 w-full h-full overflow-hidden flex flex-col relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6 flex-shrink-0 text-white">
            <div className="p-2 glass-card-tertiary rounded-2xl">
              <MessageCircle className="text-indigo-400" size={18} />
            </div>
            Assistant Chat
          </h2>
          <div className="flex-1 min-h-0 overflow-hidden glass-card-secondary p-4">
            <ChatInterface />
          </div>
        </div>
      </div>
    </>
  );
});

ChatInterfaceNode.displayName = 'ChatInterfaceNode';

export default ChatInterfaceNode;