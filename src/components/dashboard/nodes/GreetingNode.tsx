import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import Greeting from '@/components/ui/greeting';

const GreetingNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={350} minHeight={140} />
      <div className="glass-card p-8 w-full h-full overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/2 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10">
          <Greeting />
        </div>
      </div>
    </>
  );
});

GreetingNode.displayName = 'GreetingNode';

export default GreetingNode;