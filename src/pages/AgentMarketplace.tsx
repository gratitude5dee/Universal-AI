import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilters from "@/components/marketplace/SearchFilters";
import EnhancedAgentCard from "@/components/marketplace/EnhancedAgentCard";
import { FilterState, MarketplaceListing } from "@/types/marketplace";
import { Grid2x2, Activity } from "lucide-react";
import AgentComparison from "@/components/marketplace/AgentComparison";

const AgentMarketplace = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    priceModel: [],
    minRating: 0,
    sortBy: 'popularity'
  });

  // Mock marketplace listings
  const mockListings: MarketplaceListing[] = [
    {
      id: '1',
      agentId: '1',
      name: 'CodeWhiz Pro',
      description: 'AI-powered code assistant with multi-language support and real-time error detection',
      longDescription: '',
      creator: { id: '1', name: 'TechCorp', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech' },
      category: ['Technical', 'Development'],
      pricing: { model: 'subscription', price: 9.99, currency: 'USD' },
      rating: 4.8,
      reviewCount: 234,
      installCount: 12500,
      features: ['Code completion', 'Error detection', 'Refactoring'],
      screenshots: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'],
      dependencies: [],
      requiredPlugins: [],
      lastUpdated: new Date(),
      version: '2.4.1'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white text-shadow-sm">AI Agent Marketplace</h1>
          <p className="text-white/80 mt-2 text-shadow-sm">
            Discover, evaluate, and acquire pre-built AI agents for your creative projects
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-white/10 backdrop-blur-md border border-white/20 shadow-card-glow">
              <TabsTrigger value="browse" className="flex items-center gap-2 text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                <Grid2x2 className="w-4 h-4" />
                <span>Browse</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2 text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                <Activity className="w-4 h-4" />
                <span>Compare</span>
              </TabsTrigger>
            </TabsList>

            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <TabsContent value="browse" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockListings.map((listing) => (
                <EnhancedAgentCard key={listing.id} listing={listing} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6 mt-0">
            <AgentComparison />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentMarketplace;