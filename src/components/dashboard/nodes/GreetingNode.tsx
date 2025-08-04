import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import Greeting from '@/components/ui/greeting';

const GreetingNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={300} minHeight={120} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg">
        <Greeting />
      </div>
    </>
  );
});

GreetingNode.displayName = 'GreetingNode';

export default GreetingNode;