import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import Greeting from '@/components/ui/greeting';

const GreetingNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={300} minHeight={200} />
      <div className="glass-card p-6 w-full h-full border-2 border-white/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        <Greeting />
      </div>
    </>
  );
});

GreetingNode.displayName = 'GreetingNode';

export default GreetingNode;