import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Gem, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Send, 
  History, 
  Heart, 
  Award, 
  Eye,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Sparkles
} from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { cn } from "@/lib/utils";

// Mock data for assets
const assetData = [
  {
    id: "1",
    title: "Ethereal Landscape",
    type: "image",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "ethereum",
    views: 2478,
    likes: 423,
    awards: 2,
    description: "A breathtaking vista capturing the essence of natural beauty.",
    journey: [
      { date: "2023-05-15", event: "Created", chain: "ethereum" },
      { date: "2023-06-20", event: "First Exhibition", chain: "ethereum" },
      { date: "2023-08-05", event: "Transferred", chain: "polygon" },
      { date: "2023-09-10", event: "Featured in Gallery", chain: "polygon" }
    ],
    featured: true,
    collection: "Nature's Whispers",
    milestone: { type: "exhibition", message: "Featured in Digital Art Monthly!" }
  },
  {
    id: "2",
    title: "Urban Symphony",
    type: "video",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "polygon",
    views: 1953,
    likes: 312,
    awards: 1,
    description: "A rhythmic exploration of city life and urban architecture.",
    journey: [
      { date: "2023-04-10", event: "Created", chain: "polygon" },
      { date: "2023-07-15", event: "First Sale", chain: "polygon" }
    ],
    featured: false,
    collection: "Concrete Dreams"
  },
  {
    id: "3",
    title: "Ocean's Lullaby",
    type: "audio",
    preview: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2626&q=80",
    chain: "solana",
    views: 3245,
    likes: 567,
    awards: 3,
    description: "Soothing sounds of waves creating a tranquil audio experience.",
    journey: [
      { date: "2023-03-20", event: "Created", chain: "solana" },
      { date: "2023-05-10", event: "Featured in Playlist", chain: "solana" },
      { date: "2023-08-15", event: "Transferred", chain: "ethereum" },
      { date: "2023-09-05", event: "1000+ Plays Milestone", chain: "ethereum" }
    ],
    featured: true,
    collection: "Aquatic Rhythms",
    milestone: { type: "plays", message: "Reached 1,000 plays!" }
  },
  {
    id: "4",
    title: "Autumn Memories",
    type: "image",
    preview: "https://images.unsplash.com/photo-1507783548227-544c3b8fc065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "ethereum",
    views: 1875,
    likes: 284,
    awards: 0,
    description: "A nostalgic capture of fall foliage and seasonal transition.",
    journey: [
      { date: "2023-02-28", event: "Created", chain: "ethereum" },
      { date: "2023-06-15", event: "First Like", chain: "ethereum" }
    ],
    featured: false,
    collection: "Nature's Whispers"
  },
  {
    id: "5",
    title: "Neon Dreams",
    type: "image",
    preview: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2376&q=80",
    chain: "polygon",
    views: 2156,
    likes: 389,
    awards: 1,
    description: "Vibrant city lights creating an otherworldly urban landscape.",
    journey: [
      { date: "2023-01-15", event: "Created", chain: "polygon" },
      { date: "2023-04-20", event: "Featured in Collection", chain: "polygon" },
      { date: "2023-07-25", event: "First Sale", chain: "polygon" }
    ],
    featured: true,
    collection: "Concrete Dreams",
    milestone: { type: "sale", message: "First sale completed!" }
  },
  {
    id: "6",
    title: "Whispers of the Forest",
    type: "audio",
    preview: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    chain: "solana",
    views: 1245,
    likes: 187,
    awards: 0,
    description: "Natural forest sounds interwoven with subtle melodic elements.",
    journey: [
      { date: "2023-03-10", event: "Created", chain: "solana" },
      { date: "2023-05-22", event: "Added to Playlist", chain: "solana" }
    ],
    featured: false,
    collection: "Aquatic Rhythms"
  }
];

// Chain details with colors
const chains = {
  ethereum: { name: "Ethereum", color: "#6F73E9" },
  polygon: { name: "Polygon", color: "#8247E5" },
  solana: { name: "Solana", color: "#14F195" }
};

// Component for asset cards
const AssetCard = ({ asset, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the type icon
  const TypeIcon = asset.type === "image" 
    ? ImageIcon 
    : asset.type === "video" 
      ? Video 
      : Music;
      
  // Chain color
  const chainColor = chains[asset.chain]?.color || "#888";
  
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(asset)}
    >
      {/* Preview Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={asset.preview} 
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Overlay information */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Type badge */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-1.5 rounded-lg">
          <TypeIcon className="h-4 w-4 text-studio-charcoal" />
        </div>
        
        {/* Chain indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chainColor }}></span>
          {chains[asset.chain]?.name}
        </div>
        
        {/* Milestone badge (if any) */}
        {asset.milestone && (
          <motion.div 
            className="absolute top-14 right-4 bg-studio-accent/90 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Sparkles className="h-3 w-3" />
            {asset.milestone.type === "sale" && "Sold!"} 
            {asset.milestone.type === "exhibition" && "Featured!"} 
            {asset.milestone.type === "plays" && "1K Plays!"}
          </motion.div>
        )}
        
        {/* Title and collection */}
        <div>
          <h3 className="text-white font-medium text-lg mb-1">{asset.title}</h3>
          <p className="text-white/70 text-sm">{asset.collection}</p>
        </div>
        
        {/* Stats */}
        <div className="flex mt-3 space-x-4 text-white/80 text-xs">
          <span className="flex items-center">
            <Eye className="h-3 w-3 mr-1" /> {asset.views}
          </span>
          <span className="flex items-center">
            <Heart className="h-3 w-3 mr-1" /> {asset.likes}
          </span>
          {asset.awards > 0 && (
            <span className="flex items-center">
              <Award className="h-3 w-3 mr-1" /> {asset.awards}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Asset Journey Timeline component
const AssetJourney = ({ journey }) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium flex items-center">
        <History className="h-5 w-5 mr-2 text-studio-accent" />
        Asset Journey
      </h3>
      
      <div className="relative pl-6 space-y-4 mt-4">
        {/* Vertical timeline line */}
        <div className="absolute top-0 bottom-0 left-[9px] w-0.5 bg-studio-sand" />
        
        {/* Journey events */}
        {journey.map((event, index) => {
          const chainColor = chains[event.chain]?.color || "#888";
          
          return (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: chainColor }} />
              
              {/* Event content */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="font-medium">{event.event}</span>
                  <span className="text-sm text-studio-charcoal/70">{event.date}</span>
                </div>
                <div className="text-xs mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chainColor }}></span>
                  {chains[event.chain]?.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Asset Detail Modal component
const AssetDetail = ({ asset, onClose }) => {
  if (!asset) return null;
  
  // Determine the type icon
  const TypeIcon = asset.type === "image" 
    ? ImageIcon 
    : asset.type === "video" 
      ? Video 
      : Music;
  
  // Chain color
  const chainColor = chains[asset.chain]?.color || "#888";
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden w-full max-w-5xl shadow-xl flex flex-col md:flex-row"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Asset preview */}
        <div className="md:w-1/2 bg-studio-charcoal/5">
          <div className="aspect-square overflow-hidden">
            <img 
              src={asset.preview} 
              alt={asset.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Asset information */}
        <div className="md:w-1/2 p-6 max-h-[90vh] overflow-y-auto">
          {/* Header with type badge and chain */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-studio-accent/10 p-2 rounded-lg">
                <TypeIcon className="h-5 w-5 text-studio-accent" />
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-studio-sand px-2 py-1 rounded-lg text-xs font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chainColor }}></span>
                {chains[asset.chain]?.name}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-studio-sand/30 hover:bg-studio-sand/50 transition-colors" title="Send Asset">
                <Send className="h-4 w-4 text-studio-charcoal" />
              </button>
              <button className="p-2 rounded-lg bg-studio-sand/30 hover:bg-studio-sand/50 transition-colors" title="Like Asset">
                <Heart className="h-4 w-4 text-studio-charcoal" />
              </button>
            </div>
          </div>
          
          {/* Title and collection */}
          <h2 className="text-2xl font-medium mb-1">{asset.title}</h2>
          <p className="text-studio-charcoal/70">{asset.collection}</p>
          
          {/* Description */}
          <p className="mt-4 text-studio-charcoal/80">{asset.description}</p>
          
          {/* Stats */}
          <div className="flex mt-6 space-x-4 text-studio-charcoal">
            <div className="flex items-center bg-studio-sand/30 px-3 py-1.5 rounded-lg">
              <Eye className="h-4 w-4 mr-2 text-studio-charcoal/70" /> 
              <span className="font-medium">{asset.views}</span>
            </div>
            <div className="flex items-center bg-studio-sand/30 px-3 py-1.5 rounded-lg">
              <Heart className="h-4 w-4 mr-2 text-studio-charcoal/70" /> 
              <span className="font-medium">{asset.likes}</span>
            </div>
            <div className="flex items-center bg-studio-sand/30 px-3 py-1.5 rounded-lg">
              <Award className="h-4 w-4 mr-2 text-studio-charcoal/70" /> 
              <span className="font-medium">{asset.awards}</span>
            </div>
          </div>
          
          {/* Milestone notification if any */}
          {asset.milestone && (
            <motion.div 
              className="mt-6 bg-studio-accent/10 border border-studio-accent/30 rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-studio-accent/20 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-studio-accent" />
              </div>
              <div>
                <h3 className="font-medium text-studio-accent">Milestone Reached!</h3>
                <p className="text-sm mt-1">{asset.milestone.message}</p>
              </div>
            </motion.div>
          )}
          
          {/* Asset Journey */}
          <AssetJourney journey={asset.journey} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Collection component
const Collection = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeCollection, setActiveCollection] = useState("all");
  const [view, setView] = useState("grid");
  
  // Filter assets by collection
  const filteredAssets = activeCollection === "all" 
    ? assetData 
    : assetData.filter(asset => asset.collection === activeCollection);
  
  // Get unique collections
  const collections = ["all", ...new Set(assetData.map(asset => asset.collection))];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              <Gem className="h-6 w-6 mr-2 text-studio-accent" />
              My Collection
            </h1>
            <p className="text-muted-foreground mt-1">Curate and manage your digital creations</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-white border border-studio-sand/50 rounded-xl overflow-hidden">
              <button 
                className={cn("p-2", view === 'grid' ? 'bg-studio-accent text-white' : 'text-studio-charcoal hover:bg-studio-sand/30')}
                onClick={() => setView('grid')}
              >
                <Gem className="h-4 w-4" />
              </button>
              <button 
                className={cn("p-2", view === 'list' ? 'bg-studio-accent text-white' : 'text-studio-charcoal hover:bg-studio-sand/30')}
                onClick={() => setView('list')}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="pl-10 pr-4 py-2 bg-white border border-studio-sand/50 rounded-xl text-sm w-full md:w-auto focus:outline-none focus:border-studio-accent/50 transition-colors"
              />
            </div>
            
            {/* Add new */}
            <button className="flex items-center gap-1 px-3 py-2 bg-studio-accent text-white rounded-xl text-sm hover:bg-studio-accent/90 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
        
        {/* Collection tabs */}
        <div className="flex flex-wrap gap-2 border-b border-studio-sand/30 pb-3">
          {collections.map(collection => (
            <button
              key={collection}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-colors capitalize",
                activeCollection === collection
                  ? "bg-studio-accent text-white"
                  : "text-studio-charcoal hover:bg-studio-sand/30"
              )}
              onClick={() => setActiveCollection(collection)}
            >
              {collection === "all" ? "All Assets" : collection}
            </button>
          ))}
        </div>

        {/* Assets grid */}
        <div className={cn(
          "grid gap-6",
          view === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1 md:grid-cols-2"
        )}>
          {filteredAssets.map((asset, index) => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onSelect={setSelectedAsset}
            />
          ))}
        </div>

        {/* Asset detail modal */}
        {selectedAsset && (
          <AssetDetail 
            asset={selectedAsset} 
            onClose={() => setSelectedAsset(null)} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Collection;