import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Filter, Download, RefreshCw } from 'lucide-react';
import { mockPortfolioAssets, getTotalPortfolioValue } from '@/data/on-chain/mockPortfolio';
import { AssetList } from './AssetList';
import { motion } from 'framer-motion';

export const PortfolioManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const totalValue = getTotalPortfolioValue();
  const fungibleAssets = mockPortfolioAssets.filter(a => a.type === 'fungible');
  const nftAssets = mockPortfolioAssets.filter(a => a.type === 'nft');
  const lpAssets = mockPortfolioAssets.filter(a => a.type === 'lp-token');
  const rwaAssets = mockPortfolioAssets.filter(a => a.type === 'rwa');

  const stats = [
    { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, change: '+12.3%', trend: 'up' },
    { label: 'Assets', value: mockPortfolioAssets.length, change: '+3', trend: 'up' },
    { label: 'Top Gainer', value: 'WZRD', change: '+35.6%', trend: 'up' },
    { label: 'Top Loser', value: 'BONK', change: '-8.7%', trend: 'down' },
  ];
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Portfolio Value Chart */}
      <Card className="glass-card p-6 group hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Portfolio Value</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-border/50 relative overflow-hidden group-hover:border-primary/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
          <p className="text-muted-foreground relative z-10">Chart: Portfolio value over time (stacked area)</p>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-card p-4 hover:bg-accent/10 transition-all duration-300 hover:scale-105 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className={`text-sm flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, symbol, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
          />
        </div>
        <Button variant="outline" className="gap-2 whitespace-nowrap hover-scale">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Asset Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">All ({mockPortfolioAssets.length})</TabsTrigger>
          <TabsTrigger value="fungible">Tokens ({fungibleAssets.length})</TabsTrigger>
          <TabsTrigger value="nft">NFTs ({nftAssets.length})</TabsTrigger>
          <TabsTrigger value="lp">LP ({lpAssets.length})</TabsTrigger>
          <TabsTrigger value="rwa">RWAs ({rwaAssets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AssetList assets={mockPortfolioAssets} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="fungible" className="mt-6">
          <AssetList assets={fungibleAssets} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="nft" className="mt-6">
          <AssetList assets={nftAssets} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="lp" className="mt-6">
          <AssetList assets={lpAssets} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="rwa" className="mt-6">
          <AssetList assets={rwaAssets} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
