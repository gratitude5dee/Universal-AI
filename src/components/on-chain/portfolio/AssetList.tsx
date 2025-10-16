import { PortfolioAsset } from '@/types/on-chain';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { getChainById } from '@/data/on-chain/chains';

interface AssetListProps {
  assets: PortfolioAsset[];
  searchQuery?: string;
}

export const AssetList = ({ assets, searchQuery = '' }: AssetListProps) => {
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredAssets.length === 0) {
    return (
      <Card className="glass-card p-12 text-center">
        <p className="text-muted-foreground">No assets found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {filteredAssets.map((asset) => {
        const chain = getChainById(asset.chain);
        const isPositive = (asset.change24h || 0) >= 0;

        return (
          <Card key={asset.id} className="glass-card p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon & Name */}
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {asset.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{asset.name}</h4>
                    <Badge variant="secondary">{asset.symbol}</Badge>
                    {chain && (
                      <Badge variant="outline" className="text-xs">
                        {chain.icon} {chain.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Balance: {asset.balance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Value & Change */}
              <div className="text-right mr-4">
                <p className="font-semibold">${asset.value.toLocaleString()}</p>
                {asset.change24h !== undefined && (
                  <p className={`text-sm flex items-center gap-1 justify-end ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{asset.change24h.toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Actions */}
              <Button size="sm" variant="outline" className="hover-scale">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
