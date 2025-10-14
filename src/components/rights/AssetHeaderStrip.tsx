import { useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Asset {
  id: string;
  name: string;
  status: "registered" | "draft" | "in-review";
}

const mockAssets: Asset[] = [
  { id: "1", name: "The Universal Dream", status: "registered" },
  { id: "2", name: "Cosmic Voyager", status: "registered" },
  { id: "3", name: "Digital Awakening", status: "draft" },
];

export const AssetHeaderStrip = () => {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = mockAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case "registered": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "draft": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "in-review": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
  };

  const getStatusLabel = (status: Asset['status']) => {
    switch (status) {
      case "registered": return "Registered";
      case "draft": return "Draft";
      case "in-review": return "In Review";
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      {/* Asset Chips */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {!searchOpen && mockAssets.slice(0, 3).map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              selectedAsset.id === asset.id
                ? 'bg-primary/20 border-primary/30 text-primary'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {asset.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={`relative transition-all ${searchOpen ? 'w-64' : 'w-auto'}`}>
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                setTimeout(() => setSearchOpen(false), 200);
              }}
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-primary/30"
            />
            {searchQuery && filteredAssets.length > 0 && (
              <div className="absolute top-full mt-2 w-full glass-card border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-white/5 transition-all flex items-center justify-between"
                  >
                    <span className="text-sm text-white">{asset.name}</span>
                    {selectedAsset.id === asset.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Search className="w-4 h-4 text-white/70" />
          </button>
        )}
      </div>

      {/* New Asset Button */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all">
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">New</span>
      </button>

      {/* Status Badge */}
      <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${getStatusColor(selectedAsset.status)}`}>
        {getStatusLabel(selectedAsset.status)}
      </div>
    </div>
  );
};
