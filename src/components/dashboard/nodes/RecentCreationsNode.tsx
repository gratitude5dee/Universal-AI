import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
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
      <NodeResizer minWidth={420} minHeight={320} />
      <div className="glass-card p-8 w-full h-full overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-[2.5rem]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6 text-white">
            <div className="p-2 glass-card-tertiary rounded-2xl">
              <Music className="text-pink-400" size={20} />
            </div>
            Recent Creations
          </h2>
          <VinylBookshelf onRecordSelect={handleRecordSelect} title="" />
          
          <LiquidGlassModal 
            isOpen={!!selectedAsset}
            asset={selectedAsset}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </>
  );
});

RecentCreationsNode.displayName = 'RecentCreationsNode';

export default RecentCreationsNode;