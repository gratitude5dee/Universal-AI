import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFTCard } from "../shared/NFTCard";
import { mockNFTs } from "@/data/bridge/mockNFTs";
import { Search, Filter, Grid3x3, List, SortAsc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const NFTGallery = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [filterChain, setFilterChain] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-white text-shadow-sm">Your NFT Collection</h3>
          <p className="text-white/70 text-shadow-sm text-sm">{mockNFTs.length} items across all platforms</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search NFTs..."
              className="pl-10 w-64 bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <Select value={filterChain} onValueChange={setFilterChain}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="sales">Most Sales</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-[#9b87f5]" : "text-white hover:bg-white/10"}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-[#9b87f5]" : "text-white hover:bg-white/10"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mockNFTs.map((nft) => (
            <Card key={nft.id} className="backdrop-blur-md bg-white/10 border border-white/20 p-4 hover:shadow-glow transition-all">
              <div className="flex items-center gap-4">
                <img src={nft.image} alt={nft.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-shadow-sm">{nft.title}</h3>
                  <p className="text-sm text-white/60">{nft.platform} • {nft.chain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Price</p>
                  <p className="font-semibold text-white">{nft.price} {nft.currency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Sales</p>
                  <p className="font-semibold text-white">{nft.sales}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Revenue</p>
                  <p className="font-semibold text-[#9b87f5]">${nft.revenue.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
