import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import VinylBookshelf from '@/components/library/VinylBookshelf';
import LiquidGlassModal from '@/components/library/LiquidGlassModal';

const RecentCreationsNode = memo(() => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  return (
    <>
      <NodeResizer minWidth={400} minHeight={450} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg flex flex-col">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4 flex-shrink-0">
          <Music className="text-[#9b87f5]" size={20} />
          Recent Creations
        </h2>
        <ScrollArea className="flex-1">
          <VinylBookshelf onRecordSelect={handleRecordSelect} title="" />
        </ScrollArea>
        
        <LiquidGlassModal 
          isOpen={!!selectedAsset}
          asset={selectedAsset}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
});

RecentCreationsNode.displayName = 'RecentCreationsNode';

export default RecentCreationsNode;