import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Download, Share } from 'lucide-react';
import { mockPortfolioAssets } from '@/data/on-chain/mockPortfolio';
import { motion } from 'framer-motion';

export const AdvancedAnalytics = () => {
  const totalValue = mockPortfolioAssets.reduce((sum, a) => sum + a.value, 0);
  const thirtyDayReturn = 12.3;
  const allTimeROI = 43.2;

  const topGainers = mockPortfolioAssets
    .filter(a => a.change24h && a.change24h > 0)
    .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
    .slice(0, 3);

  const topLosers = mockPortfolioAssets
    .filter(a => a.change24h && a.change24h < 0)
    .sort((a, b) => (a.change24h || 0) - (b.change24h || 0))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="hover-scale gap-2">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="hover-scale gap-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
          <Button
            key={period}
            variant={period === '1M' ? 'default' : 'outline'}
            size="sm"
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="glass-card p-6 group hover:border-primary/30 transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/10 rounded-lg border border-border/50 relative overflow-hidden group-hover:border-primary/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
          <p className="text-muted-foreground relative z-10">Chart: Portfolio value over time (stacked area)</p>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">30-Day Return</p>
          <p className="text-2xl font-bold mt-1 text-green-400">+${(totalValue * thirtyDayReturn / 100).toFixed(0)}</p>
          <p className="text-sm text-muted-foreground">+{thirtyDayReturn}%</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">All-Time ROI</p>
          <p className="text-2xl font-bold mt-1 text-green-400">+{allTimeROI}%</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold mt-1">73.4%</p>
        </Card>
      </div>

      {/* Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Type Distribution */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Type Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-background/20 rounded-lg border border-border/50">
            <p className="text-muted-foreground">Chart: Donut chart by asset type</p>
          </div>
        </Card>

        {/* Chain Distribution */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Chain Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-background/20 rounded-lg border border-border/50">
            <p className="text-muted-foreground">Chart: Horizontal bar chart by chain</p>
          </div>
        </Card>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Top Gainers (24h)
          </h3>
          <div className="space-y-3">
            {topGainers.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{asset.icon}</span>
                  <div>
                    <p className="font-semibold">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +{asset.change24h?.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Losers */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            Top Losers (24h)
          </h3>
          <div className="space-y-3">
            {topLosers.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{asset.icon}</span>
                  <div>
                    <p className="font-semibold">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {asset.change24h?.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Beta</p>
            <p className="text-xl font-bold">1.24</p>
            <p className="text-xs text-muted-foreground">vs market</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-xl font-bold">1.87</p>
            <p className="text-xs text-green-400">Good risk-adjusted returns</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-xl font-bold text-red-400">-18.3%</p>
            <p className="text-xs text-muted-foreground">Oct 3-7</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Value at Risk (95%)</p>
            <p className="text-xl font-bold">-$5,234</p>
            <p className="text-xs text-muted-foreground">daily</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diversification</p>
            <p className="text-xl font-bold">72/100</p>
            <p className="text-xs text-green-400">Well diversified</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
