import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import SuggestedActions from '@/components/home/SuggestedActions';

const SuggestedActionsNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={420} minHeight={280} />
      <div className="glass-card p-8 w-full h-full overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-green-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10">
          <SuggestedActions />
        </div>
      </div>
    </>
  );
});

SuggestedActionsNode.displayName = 'SuggestedActionsNode';

export default SuggestedActionsNode;