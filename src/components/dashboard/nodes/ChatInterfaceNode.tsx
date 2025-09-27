import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatInterfaceNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={450} minHeight={500} />
      <div className="glass-card p-4 w-full h-full border-2 border-white/20 backdrop-blur-xl rounded-3xl flex flex-col shadow-2xl">
        <h2 className="text-lg font-medium flex items-center gap-2 mb-3 flex-shrink-0">
          <MessageCircle className="text-[#9b87f5]" size={18} />
          Artist Assistant Chat
        </h2>
        <ScrollArea className="flex-1 min-h-0">
          <ChatInterface />
        </ScrollArea>
      </div>
    </>
  );
});

ChatInterfaceNode.displayName = 'ChatInterfaceNode';

export default ChatInterfaceNode;