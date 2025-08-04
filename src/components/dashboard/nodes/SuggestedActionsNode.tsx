import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import SuggestedActions from '@/components/home/SuggestedActions';

const SuggestedActionsNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={400} minHeight={250} />
      <div className="w-full h-full">
        <SuggestedActions />
      </div>
    </>
  );
});

SuggestedActionsNode.displayName = 'SuggestedActionsNode';

export default SuggestedActionsNode;