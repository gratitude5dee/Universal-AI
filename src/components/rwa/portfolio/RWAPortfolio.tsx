import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Grid3x3, List, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { StatsCard } from "../shared/StatsCard";
import { RWAAssetCard } from "./RWAAssetCard";
import { AssetDetailsModal } from "./AssetDetailsModal";
import { mockUserHoldings, mockPortfolioStats } from "@/data/rwa/mockData";
import type { RWAHolding } from "@/types/rwa";

export const RWAPortfolio = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHolding, setSelectedHolding] = useState<RWAHolding | null>(null);
  const [sortBy, setSortBy] = useState<"value" | "yield" | "date" | "type">("value");

  const filteredHoldings = mockUserHoldings
    .filter(holding => 
      holding.asset.tokenName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "value":
          return b.currentValue - a.currentValue;
        case "yield":
          return b.yieldEarned - a.yieldEarned;
        case "date":
          return new Date(b.asset.createdAt).getTime() - new Date(a.asset.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Wallet}
          label="Total RWA Value"
          value={`$${mockPortfolioStats.totalRWAValue.toLocaleString()}`}
          trend={mockPortfolioStats.monthlyPerformance}
          iconColor="text-[#D4AF37]"
        />
        <StatsCard
          icon={DollarSign}
          label="Cash Balance"
          value={`$${mockPortfolioStats.cashBalance.toLocaleString()}`}
          iconColor="text-[#1E40AF]"
        />
        <StatsCard
          icon={TrendingUp}
          label="Yield Earnings"
          value={`$${mockPortfolioStats.yieldEarnings.toLocaleString()}`}
          subtitle="This month"
          iconColor="text-[#059669]"
        />
        <StatsCard
          icon={Wallet}
          label="Combined Value"
          value={`$${mockPortfolioStats.combinedValue.toLocaleString()}`}
          trend={mockPortfolioStats.monthlyPerformance}
          iconColor="text-[#D4AF37]"
        />
      </div>

      {/* Asset Breakdown */}
      <Card className="glass-card p-6 rounded-xl border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Asset Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut Chart Placeholder */}
          <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">📊</div>
              <p className="text-white/50 text-sm">Asset Breakdown Chart</p>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-3">
            {[
              { name: "Real Estate", percentage: 45, value: 128025, color: "#D4AF37" },
              { name: "Financial", percentage: 30, value: 85350, color: "#1E40AF" },
              { name: "Art", percentage: 15, value: 42675, color: "#EA580C" },
              { name: "Commodities", percentage: 7, value: 19915, color: "#059669" },
              { name: "Business", percentage: 3, value: 8535, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/70 text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {item.percentage}%
                  </p>
                  <p className="text-white/50 text-xs">
                    ${item.value.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search holdings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
            <TabsList className="bg-white/5">
              <TabsTrigger value="grid" className="text-white/70 data-[state=active]:text-white">
                <Grid3x3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="text-white/70 data-[state=active]:text-white">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Sort by:</span>
        {[
          { id: "value", label: "Value" },
          { id: "yield", label: "Yield" },
          { id: "date", label: "Date Acquired" },
          { id: "type", label: "Asset Type" },
        ].map((option) => (
          <Button
            key={option.id}
            variant="ghost"
            size="sm"
            onClick={() => setSortBy(option.id as any)}
            className={sortBy === option.id ? "text-white" : "text-white/70"}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Holdings Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredHoldings.map((holding) => (
          <RWAAssetCard
            key={holding.id}
            holding={holding}
            viewMode={viewMode}
            onClick={() => setSelectedHolding(holding)}
          />
        ))}
      </div>

      {filteredHoldings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 mb-4">No holdings found</p>
          <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedHolding && (
        <AssetDetailsModal
          holding={selectedHolding}
          onClose={() => setSelectedHolding(null)}
        />
      )}
    </div>
  );
};
