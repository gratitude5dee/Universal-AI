import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatInterfaceNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={450} minHeight={500} />
      <div className="glass-card p-4 w-full h-full border border-white/10 backdrop-blur-md rounded-lg overflow-hidden flex flex-col">
        <h2 className="text-lg font-medium flex items-center gap-2 mb-3 flex-shrink-0">
          <MessageCircle className="text-[#9b87f5]" size={18} />
          Artist Assistant Chat
        </h2>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </>
  );
});

ChatInterfaceNode.displayName = 'ChatInterfaceNode';

export default ChatInterfaceNode;