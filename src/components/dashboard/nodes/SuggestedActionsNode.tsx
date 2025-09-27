import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import SuggestedActions from '@/components/home/SuggestedActions';

const SuggestedActionsNode = memo(() => {
  return (
    <>
      <NodeResizer minWidth={400} minHeight={250} />
      <ScrollArea className="w-full h-full">
        <SuggestedActions />
      </ScrollArea>
    </>
  );
});

SuggestedActionsNode.displayName = 'SuggestedActionsNode';

export default SuggestedActionsNode;