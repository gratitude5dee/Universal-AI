import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Loader2, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import VinylBookshelf from '@/components/library/VinylBookshelf';
import LiquidGlassModal from '@/components/library/LiquidGlassModal';
import universalAiLogo from '@/assets/universal-ai-logo.png';
import { useContentLibraryAssets } from '@/hooks/useContentLibraryAssets';
import { useAuth } from '@/context/AuthContext';

const demoAssets = [
  {
    id: 'guest-demo-1',
    creatorId: 'guest',
    title: 'Aurora Draft',
    artist: 'UniversalAI Demo',
    image: universalAiLogo,
    description: 'Demo content available while browsing in guest mode.',
    fileType: 'image',
    storagePath: null,
    signedUrl: null,
    tags: ['demo', 'concept'],
    publicationCount: 1,
    linkCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'guest-demo-2',
    creatorId: 'guest',
    title: 'Tour Visual Pack',
    artist: 'UniversalAI Demo',
    image: universalAiLogo,
    description: 'Sample touring collateral for the home dashboard.',
    fileType: 'image',
    storagePath: null,
    signedUrl: null,
    tags: ['touring', 'marketing'],
    publicationCount: 0,
    linkCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'guest-demo-3',
    creatorId: 'guest',
    title: 'Rights Packet',
    artist: 'UniversalAI Demo',
    image: universalAiLogo,
    description: 'Example IP and licensing packet for guest sessions.',
    fileType: 'document',
    storagePath: null,
    signedUrl: null,
    tags: ['rights', 'ip'],
    publicationCount: 2,
    linkCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const RecentCreationsNode = memo(() => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const { guestMode } = useAuth();
  const { data: assets = [], isLoading, isError } = useContentLibraryAssets({ enabled: !guestMode });

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const recentAssets = guestMode || isError ? demoAssets : assets.slice(0, 8);

  return (
    <>
      <NodeResizer minWidth={400} minHeight={300} />
      <div className="glass-card p-6 w-full h-full border border-white/10 backdrop-blur-md rounded-lg flex flex-col">
        <h2 className="text-xl font-medium flex items-center gap-2 mb-4 flex-shrink-0">
          <Music className="text-[#9b87f5]" size={20} />
          Recent Creations
        </h2>
        <ScrollArea className="flex-1">
          {isLoading && !guestMode ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white/70" />
            </div>
          ) : (
            <VinylBookshelf onRecordSelect={handleRecordSelect} title="" assets={recentAssets} />
          )}
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
