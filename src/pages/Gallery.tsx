
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Plus, ChevronDown } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import VinylBookshelf from "@/components/ui/VinylBookshelf";
import AssetDetailModal from "@/components/ui/AssetDetailModal";
import AssetFormModal from "@/components/ui/AssetFormModal";
import { Asset } from "@/components/ui/VinylRecord";

const galleryAssets: Asset[] = [
  {
    id: "1",
    title: "Mountain Sunrise",
    type: "image",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "Ethereum",
    collection: "Natural Landscapes",
    description: "A breathtaking sunrise over mountain peaks, captured in golden hour light.",
    journey: [
      { date: "2023-08-15", event: "Created", chain: "Ethereum" },
      { date: "2023-08-16", event: "Minted", chain: "Ethereum" },
      { date: "2023-08-20", event: "First Sale", chain: "Ethereum" }
    ],
    milestone: { type: "First Sale", message: "Congratulations on your first sale!" },
    views: 1250,
    likes: 89,
    awards: 3,
    featured: true
  },
  {
    id: "2",
    title: "Urban Architecture",
    type: "image",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "Polygon",
    collection: "Urban Visions",
    description: "Modern architectural marvel showcasing geometric patterns and city life.",
    journey: [
      { date: "2023-09-02", event: "Created", chain: "Polygon" },
      { date: "2023-09-03", event: "Minted", chain: "Polygon" }
    ],
    views: 856,
    likes: 67,
    awards: 1,
    featured: false
  },
  {
    id: "3",
    title: "Ocean Waves",
    type: "image",
    preview: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2626&q=80",
    chain: "Solana",
    collection: "Ocean Dreams",
    description: "Powerful ocean waves crashing against the shore in eternal rhythm.",
    journey: [
      { date: "2023-07-24", event: "Created", chain: "Solana" },
      { date: "2023-07-25", event: "Minted", chain: "Solana" },
      { date: "2023-07-30", event: "Featured", chain: "Solana" }
    ],
    views: 2100,
    likes: 145,
    awards: 5,
    featured: true
  },
  {
    id: "4",
    title: "Forest Path",
    type: "image",
    preview: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "Ethereum",
    collection: "Woodland Trails",
    description: "A mysterious forest path leading into the unknown depths of nature.",
    journey: [
      { date: "2023-10-10", event: "Created", chain: "Ethereum" },
      { date: "2023-10-11", event: "Minted", chain: "Ethereum" }
    ],
    views: 934,
    likes: 78,
    awards: 2,
    featured: false
  },
  {
    id: "5",
    title: "City Lights",
    type: "video",
    preview: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2244&q=80",
    chain: "Polygon",
    collection: "Night Cityscapes",
    description: "Mesmerizing time-lapse of city lights painting the urban landscape.",
    journey: [
      { date: "2023-09-18", event: "Created", chain: "Polygon" },
      { date: "2023-09-19", event: "Minted", chain: "Polygon" },
      { date: "2023-09-25", event: "Award Won", chain: "Polygon" }
    ],
    milestone: { type: "Award Winner", message: "Your work has been recognized with an award!" },
    views: 1678,
    likes: 112,
    awards: 4,
    featured: true
  },
  {
    id: "6",
    title: "Autumn Colors",
    type: "image",
    preview: "https://images.unsplash.com/photo-1507783548227-544c3b8fc065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "Solana",
    collection: "Seasonal Beauty",
    description: "Vibrant autumn foliage displaying nature's spectacular color palette.",
    journey: [
      { date: "2023-10-25", event: "Created", chain: "Solana" },
      { date: "2023-10-26", event: "Minted", chain: "Solana" }
    ],
    views: 765,
    likes: 89,
    awards: 1,
    featured: false
  },
  {
    id: "7",
    title: "Storm Approaching",
    type: "video",
    preview: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80",
    chain: "Ethereum",
    collection: "Weather Phenomena",
    description: "Dramatic storm clouds gathering over the landscape in nature's theater.",
    journey: [
      { date: "2023-08-30", event: "Created", chain: "Ethereum" },
      { date: "2023-08-31", event: "Minted", chain: "Ethereum" }
    ],
    views: 1345,
    likes: 95,
    awards: 2,
    featured: false
  },
  {
    id: "8",
    title: "Desert Sunset",
    type: "image",
    preview: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2376&q=80",
    chain: "Polygon",
    collection: "Desert Wonders",
    description: "Golden desert sunset painting the dunes in warm, ethereal light.",
    journey: [
      { date: "2023-07-05", event: "Created", chain: "Polygon" },
      { date: "2023-07-06", event: "Minted", chain: "Polygon" },
      { date: "2023-07-15", event: "Featured", chain: "Polygon" }
    ],
    views: 1890,
    likes: 134,
    awards: 3,
    featured: true
  }
];

const Gallery = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(galleryAssets);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const handleAddAsset = () => {
    setFormMode('create');
    setEditingAsset(null);
    setIsFormModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setFormMode('edit');
    setEditingAsset(asset);
    setIsFormModalOpen(true);
  };

  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (formMode === 'create') {
      const newAsset: Asset = {
        ...assetData as Asset,
        id: `asset-${Date.now()}`,
        views: 0,
        likes: 0,
        awards: 0,
        featured: false,
        journey: [
          { date: new Date().toISOString().split('T')[0], event: 'Created', chain: assetData.chain || 'Ethereum' }
        ]
      };
      setAssets(prev => [...prev, newAsset]);
    } else if (editingAsset) {
      setAssets(prev => prev.map(asset => 
        asset.id === editingAsset.id 
          ? { ...asset, ...assetData }
          : asset
      ));
    }
    setIsFormModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-studio-charcoal via-studio-accent to-studio-charcoal bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-studio-muted mt-2 text-lg">Your creative collection displayed beautifully</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-studio-sand/50 text-studio-charcoal rounded-xl text-sm hover:bg-white hover:shadow-md transition-all duration-300">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filter</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>
            
            <button 
              onClick={handleAddAsset}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-studio-accent to-studio-accent/90 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-studio-accent/25 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Asset</span>
            </button>
          </div>
        </div>

        {/* Featured Assets Section */}
        <div className="space-y-6">
          <div className="relative overflow-hidden p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <VinylBookshelf 
              title="Featured Collection"
              assets={assets.filter(asset => asset.featured)} 
              onSelectAsset={handleSelectAsset}
              onAddAsset={handleAddAsset}
            />
          </div>
        </div>

        {/* All Assets Section */}
        <div className="space-y-6">
          <div className="relative overflow-hidden p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <VinylBookshelf 
              title="Complete Collection"
              assets={assets} 
              onSelectAsset={handleSelectAsset}
              onAddAsset={handleAddAsset}
            />
          </div>
        </div>
      </div>

      {selectedAsset && (
        <AssetDetailModal asset={selectedAsset} onClose={handleCloseModal} />
      )}

      <AssetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAsset}
        asset={editingAsset}
        mode={formMode}
      />
    </DashboardLayout>
  );
};

export default Gallery;
