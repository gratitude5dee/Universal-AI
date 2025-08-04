
import React, { useState } from "react";
import { Search, Filter, Grid, List, Zap } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import { integrationsData, categories } from "@/components/integrations/integrationsData";
import { motion } from "framer-motion";

const Integrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter integrations based on search and filters
  const filteredIntegrations = integrationsData.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    const matchesPricing = selectedPricing === "All" || integration.pricing === selectedPricing;
    
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const pricingOptions = ["All", "free", "freemium", "paid", "subscription", "enterprise"];

  return (
    <DashboardLayout>
      <Content 
        title="Music API Integrations" 
        subtitle="Discover and integrate powerful APIs for your music applications"
      >
        <div className="space-y-8">
          {/* Header Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-6 h-6 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-300">Available</Badge>
              </div>
              <p className="text-sm text-white/70">Total APIs</p>
              <p className="text-2xl font-bold text-white">{integrationsData.length}</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="flex items-center justify-between mb-2">
                <Filter className="w-6 h-6 text-green-400" />
                <Badge className="bg-green-500/20 text-green-300">Categories</Badge>
              </div>
              <p className="text-sm text-white/70">API Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="flex items-center justify-between mb-2">
                <Grid className="w-6 h-6 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-300">Free</Badge>
              </div>
              <p className="text-sm text-white/70">Free APIs</p>
              <p className="text-2xl font-bold text-white">
                {integrationsData.filter(i => i.pricing === "free").length}
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <div className="flex items-center justify-between mb-2">
                <List className="w-6 h-6 text-orange-400" />
                <Badge className="bg-orange-500/20 text-orange-300">Enterprise</Badge>
              </div>
              <p className="text-sm text-white/70">Enterprise APIs</p>
              <p className="text-2xl font-bold text-white">
                {integrationsData.filter(i => i.pricing === "enterprise").length}
              </p>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-white/10 border-white/20"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-white/10 border-white/20"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-4">
              <TabsList className="w-full bg-white/5 border border-white/10 rounded-lg p-1 flex-wrap h-auto">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.name}
                    value={category.name} 
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary flex items-center gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full ${category.color}`}></span>
                    {category.name}
                    <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Pricing Filter */}
            <div className="flex flex-wrap gap-2">
              {pricingOptions.map((pricing) => (
                <Button
                  key={pricing}
                  variant={selectedPricing === pricing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPricing(pricing)}
                  className="capitalize bg-white/10 border-white/20 text-white"
                >
                  {pricing}
                  {pricing !== "All" && (
                    <Badge variant="secondary" className="ml-2 bg-white/10 text-white/70">
                      {integrationsData.filter(i => i.pricing === pricing).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-white/80">
              Showing <span className="font-semibold text-white">{filteredIntegrations.length}</span> of{" "}
              <span className="font-semibold text-white">{integrationsData.length}</span> integrations
            </p>
          </motion.div>

          {/* Integration Cards */}
          <motion.div 
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <IntegrationCard integration={integration} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredIntegrations.length === 0 && (
            <motion.div 
              className="glass-card rounded-xl p-12 border border-white/10 backdrop-blur-md text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
              <p className="text-white/60 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedPricing("All");
                }}
                className="bg-gradient-to-r from-studio-accent to-blue-500"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Integrations;
