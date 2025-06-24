import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Grid2x2, 
  List, 
  Tag, 
  Search, 
  Star, 
  Sparkles, 
  ArrowUpRight, 
  Activity,
  Sliders,
  BadgeDollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AgentCatalog from "@/components/marketplace/AgentCatalog";
import AgentComparison from "@/components/marketplace/AgentComparison";
import CategoryNav from "@/components/marketplace/CategoryNav";

const AgentMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input 
                  placeholder="Search agents..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`${filterOpen ? "bg-white/20" : "bg-white/10"} border-white/20 text-white hover:bg-white/30`}
              >
                <Sliders className="h-4 w-4" />
              </Button>
              
              <div className="hidden sm:flex border border-white/20 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/30`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2x2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/30`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="browse" className="space-y-6 mt-0">
            {filterOpen && (
              <div className="glass-card p-4 animate-in fade-in-50 slide-in-from-top-5 duration-300 backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white text-shadow-sm">Agent Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Creative</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Analytical</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Conversational</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Assistive</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white text-shadow-sm">Pricing Model</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Free</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Subscription</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Pay-per-use</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">One-time</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white text-shadow-sm">Base Model</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">GPT-4o</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Claude 3</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Gemini Pro</Button>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Mixtral</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <CategoryNav selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              </div>
              <div className="md:col-span-3">
                <AgentCatalog viewMode={viewMode} searchQuery={searchQuery} selectedCategory={selectedCategory} />
              </div>
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