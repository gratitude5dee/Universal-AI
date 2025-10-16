import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles, TrendingUp, Shield, Droplet } from 'lucide-react';
import { mockLiquidityOpportunities } from '@/data/on-chain/mockLiquidity';
import { getChainById } from '@/data/on-chain/chains';
import { motion } from 'framer-motion';

export const OpportunityFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredOpportunities = mockLiquidityOpportunities.filter(opp => {
    const matchesSearch = opp.pool.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || opp.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-red-400 border-red-400';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Opportunity Finder</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pools or protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Found {filteredOpportunities.length} opportunities based on your portfolio
        </p>

        {filteredOpportunities.map((opp, idx) => {
          const chain = getChainById(opp.chain);
          
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-card p-5 hover:bg-accent/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{opp.pool}</h4>
                      <Badge variant="secondary">{opp.protocol}</Badge>
                      {chain && (
                        <Badge variant="outline" className="text-xs">
                          {chain.icon} {chain.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className={getRiskColor(opp.risk)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {opp.risk.toUpperCase()} RISK
                      </Badge>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">APY</p>
                        <p className="text-xl font-bold text-green-400">{opp.apy.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">TVL</p>
                        <p className="text-lg font-semibold">${(opp.tvl / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Match Score</p>
                        <p className="text-lg font-semibold">{opp.matchScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Compatible Assets</p>
                        <div className="flex gap-1 mt-1">
                          {opp.compatibleAssets.map(asset => (
                            <Badge key={asset} variant="secondary" className="text-xs">{asset}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-sm">
                        <strong>AI Recommendation:</strong> This pool offers {opp.apy > 50 ? 'exceptionally high' : 'competitive'} yields
                        with {opp.risk} risk. You have {opp.compatibleAssets.join(', ')} in your portfolio.
                        {opp.matchScore > 90 && ' Highly recommended based on your holdings.'}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <Button className="ml-4 hover-scale group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                    <Droplet className="h-4 w-4 mr-2" />
                    Add Liquidity
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
