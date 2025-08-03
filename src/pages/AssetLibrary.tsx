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
    title: "Nebula Wanderer",
    type: "image",
    preview: "https://images.unsplash.com/photo-1603344204980-4edb0ea63148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    chain: "ethereum",
    collection: "Digital Dreams",
    description: "A breathtaking exploration of cosmic beauty and digital artistry.",
    journey: [],
    views: 1872,
    likes: 254,
    awards: 2,
    featured: true
  },
  {
    id: "2",
    title: "Crystal Consciousness",
    type: "image",
    preview: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    chain: "polygon",
    collection: "Ethereal Forms",
    description: "An abstract representation of consciousness through crystalline structures.",
    journey: [],
    views: 1254,
    likes: 189,
    awards: 1,
    featured: true
  },
  {
    id: "3",
    title: "Astral Projection",
    type: "video",
    preview: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    chain: "solana",
    collection: "Cosmic Journeys",
    description: "A visual journey through the astral planes of consciousness.",
    journey: [],
    views: 2341,
    likes: 321,
    awards: 3,
    featured: true
  },
  {
    id: "4",
    title: "Dimensional Shift",
    type: "audio",
    preview: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    chain: "ethereum",
    collection: "Sound Dimensions",
    description: "Ambient soundscapes that transport listeners to otherworldly realms.",
    journey: [],
    views: 1987,
    likes: 276,
    awards: 1,
    featured: false
  },
  {
    id: "5",
    title: "Ethereal Dreams",
    type: "image",
    preview: "https://images.unsplash.com/photo-1659792223397-2a108debb69a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    chain: "polygon",
    collection: "Dream Sequences",
    description: "Surreal compositions that blur the line between dreams and reality.",
    journey: [],
    views: 3241,
    likes: 423,
    awards: 2,
    featured: true
  },
  {
    id: "6",
    title: "Quantum Reflections",
    type: "video",
    preview: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    chain: "solana",
    collection: "Quantum Series",
    description: "Visual exploration of quantum mechanics and particle physics.",
    journey: [],
    views: 2876,
    likes: 365,
    awards: 4,
    featured: true
  }
];

const AssetLibrary = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center text-white text-shadow-sm">
              Asset Library
            </h1>
            <p className="text-white/70 mt-1">Browse and explore your creative assets</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input 
                type="text" 
                placeholder="Search your library..." 
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

export default AssetLibrary;
