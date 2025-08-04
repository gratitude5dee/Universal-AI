import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatInterfaceNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={450} minHeight={500} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
          <MessageCircle className="text-[#9b87f5]" size={20} />
          Artist Assistant Chat
        </h2>
        <div className="h-[calc(100%-4rem)]">
          <ChatInterface />
        </div>
      </div>
    </>
  );
});

ChatInterfaceNode.displayName = 'ChatInterfaceNode';

export default ChatInterfaceNode;