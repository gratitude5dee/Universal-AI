import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { AnimatePresence } from 'framer-motion';
import VinylBookshelf from "@/components/ui/VinylBookshelf";
import AssetDetailModal from "@/components/ui/AssetDetailModal";
import { Asset } from "@/components/ui/VinylRecord";

const assetData: Asset[] = [
  {
    id: "1",
    title: "The Tape",
    type: "image",
    preview: "https://i.imgur.com/3Z6a5bU.png",
    chain: "ethereum",
    collection: "Gratitud3.eth",
    description: "A retro-futuristic exploration of analog and digital.",
    journey: [],
    views: 1337,
    likes: 420,
    awards: 1,
    featured: true
  },
  {
    id: "2",
    title: "Monks & Magic",
    type: "audio",
    preview: "https://i.imgur.com/r3d2p8k.png",
    chain: "ethereum",
    collection: "Gratitud3.eth",
    description: "An epic saga told through soundscapes.",
    journey: [],
    views: 2025,
    likes: 777,
    awards: 3,
    featured: true,
  },
  {
    id: "3",
    title: "Yuh-Hape",
    type: "image",
    preview: "https://i.imgur.com/qL3gS3S.png",
    chain: "polygon",
    collection: "Character Studies",
    description: "A portrait of stoic power and hidden depths.",
    journey: [],
    views: 987,
    likes: 301,
    awards: 0,
    featured: false
  },
  {
    id: "4",
    title: "Ocean's Lullaby",
    type: "audio",
    preview: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=300&h=200&auto=format",
    chain: "solana",
    collection: "Aquatic Rhythms",
    description: "Soothing sounds of waves creating a tranquil audio experience.",
    journey: [],
    views: 3245,
    likes: 567,
    awards: 3,
    featured: true,
  },
];

const Collection = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center text-white text-shadow-sm">
              Content Library
            </h1>
            <p className="text-white/70 mt-1">Your personal collection of creative works.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input 
                type="text" 
                placeholder="Search your collection..." 
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm w-full md:w-auto focus:outline-none focus:border-cyan-500/50 transition-colors text-white"
              />
            </div>
            <button className="flex items-center gap-1 px-3 py-2 bg-studio-accent text-white rounded-xl text-sm hover:bg-studio-accent/90 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Vinyl Bookshelf */}
        <VinylBookshelf assets={assetData} onSelectAsset={setSelectedAsset} />
        
        {/* Asset Detail Modal */}
        <AnimatePresence>
            {selectedAsset && (
                <AssetDetailModal 
                    asset={selectedAsset} 
                    onClose={() => setSelectedAsset(null)} 
                />
            )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Collection;