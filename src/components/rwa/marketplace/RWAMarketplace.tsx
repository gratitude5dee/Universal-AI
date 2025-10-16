import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Bell } from "lucide-react";
import { RWAListingCard } from "./RWAListingCard";
import { FilterSidebar } from "./FilterSidebar";
import { ListingDetails } from "./ListingDetails";
import { mockMarketplaceListings } from "@/data/rwa/mockData";
import type { MarketplaceListing, RWAAssetType } from "@/types/rwa";

export const RWAMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RWAAssetType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [sortBy, setSortBy] = useState<"yield" | "newest" | "popular" | "ending-soon" | "lowest-min">("yield");

  const filteredListings = mockMarketplaceListings
    .filter(listing => {
      if (selectedCategory !== "all" && listing.asset.assetType !== selectedCategory) return false;
      if (searchQuery && !listing.asset.tokenName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "yield":
          const aYield = a.financialDetails?.currentYield || 0;
          const bYield = b.financialDetails?.currentYield || 0;
          return bYield - aYield;
        case "newest":
          return new Date(b.closesAt).getTime() - new Date(a.closesAt).getTime();
        case "ending-soon":
          return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search offerings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
        <TabsList className="w-full justify-start overflow-x-auto bg-white/5 flex-wrap h-auto">
          <TabsTrigger value="all" className="text-white/70 data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="real-estate" className="text-white/70 data-[state=active]:text-white">
            🏠 Real Estate
          </TabsTrigger>
          <TabsTrigger value="financial-instruments" className="text-white/70 data-[state=active]:text-white">
            💰 Treasuries
          </TabsTrigger>
          <TabsTrigger value="art-collectibles" className="text-white/70 data-[state=active]:text-white">
            🎨 Art
          </TabsTrigger>
          <TabsTrigger value="commodities" className="text-white/70 data-[state=active]:text-white">
            ⚗️ Commodities
          </TabsTrigger>
          <TabsTrigger value="business-equity" className="text-white/70 data-[state=active]:text-white">
            🏢 Business
          </TabsTrigger>
          <TabsTrigger value="intellectual-property" className="text-white/70 data-[state=active]:text-white">
            📜 IP Rights
          </TabsTrigger>
          <TabsTrigger value="revenue-streams" className="text-white/70 data-[state=active]:text-white">
            ⚡ Revenue
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Sort by:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy("yield")}
          className={sortBy === "yield" ? "text-white" : "text-white/70"}
        >
          Yield
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy("newest")}
          className={sortBy === "newest" ? "text-white" : "text-white/70"}
        >
          Newest
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy("popular")}
          className={sortBy === "popular" ? "text-white" : "text-white/70"}
        >
          Popular
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy("ending-soon")}
          className={sortBy === "ending-soon" ? "text-white" : "text-white/70"}
        >
          Ending Soon
        </Button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <RWAListingCard
            key={listing.id}
            listing={listing}
            onClick={() => setSelectedListing(listing)}
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 mb-4">No offerings found matching your criteria</p>
          <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Filter Sidebar */}
      {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

      {/* Listing Details Modal */}
      {selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
};
