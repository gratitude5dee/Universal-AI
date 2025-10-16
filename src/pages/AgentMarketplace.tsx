import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilters from "@/components/marketplace/SearchFilters";
import EnhancedAgentCard from "@/components/marketplace/EnhancedAgentCard";
import { FilterState, MarketplaceListing } from "@/types/marketplace";
import { Grid2x2, Activity, Sparkles, Zap, Shield } from "lucide-react";
import AgentComparison from "@/components/marketplace/AgentComparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            AI Agent Marketplace
          </h1>
          <p className="text-white/70 text-xl max-w-3xl">
            Discover, evaluate, and deploy pre-built AI agents for your creative workflows
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-[#22c55e]" />
                Smart Discovery
              </CardTitle>
              <CardDescription className="text-white/70">
                AI-powered recommendations based on your workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-[#6366f1]" />
                Instant Deployment
              </CardTitle>
              <CardDescription className="text-white/70">
                One-click installation and automatic configuration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-[#f59e0b]" />
                Verified Quality
              </CardTitle>
              <CardDescription className="text-white/70">
                Curated agents tested for performance and security
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <TabsList className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
              <TabsTrigger value="browse" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                <Grid2x2 className="mr-2 h-4 w-4" />
                Browse Agents
              </TabsTrigger>
              <TabsTrigger value="compare" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                <Activity className="mr-2 h-4 w-4" />
                Compare
              </TabsTrigger>
            </TabsList>

            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <TabsContent value="browse" className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {mockListings.map((listing) => (
                <EnhancedAgentCard key={listing.id} listing={listing} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compare" className="pt-6">
            <AgentComparison />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentMarketplace;