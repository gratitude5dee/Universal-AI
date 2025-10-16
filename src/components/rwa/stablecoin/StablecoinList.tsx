import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { mockStablecoins } from "@/data/rwa/mockData";
import { Badge } from "@/components/ui/badge";
import { ChainBadge } from "../shared/ChainBadge";
import { StablecoinComparison } from "./StablecoinComparison";
import { useState } from "react";

interface StablecoinListProps {
  onClose: () => void;
}

export const StablecoinList = ({ onClose }: StablecoinListProps) => {
  const [showComparison, setShowComparison] = useState(false);

  const fiatBacked = mockStablecoins.filter((s) => s.type === "fiat-backed");
  const algorithmic = mockStablecoins.filter((s) => s.type === "algorithmic");
  const yieldBearing = mockStablecoins.filter((s) => s.type === "yield-bearing");

  if (showComparison) {
    return <StablecoinComparison onClose={() => setShowComparison(false)} />;
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Supported Stablecoins ({mockStablecoins.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Fiat-Backed */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Fiat-Backed Stables</h3>
            <div className="space-y-2">
              {fiatBacked.map((stable) => (
                <div
                  key={stable.symbol}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{stable.symbol === "USDC" ? "💵" : "💰"}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{stable.symbol}</span>
                          <span className="text-sm text-white/60">({stable.name})</span>
                          {stable.isNew && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              🔥 NEW
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/50">Balance: $0</span>
                          <span className="text-xs text-white/30">•</span>
                          <div className="flex gap-1">
                            {stable.chains.slice(0, 3).map((chain) => (
                              <ChainBadge key={chain} chain={chain} />
                            ))}
                            {stable.chains.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{stable.chains.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">Market Cap</div>
                      <div className="text-white font-medium">
                        ${(stable.marketCap / 1_000_000_000).toFixed(1)}B
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithmic/Crypto-Backed */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Algorithmic/Crypto-Backed
            </h3>
            <div className="space-y-2">
              {algorithmic.map((stable) => (
                <div
                  key={stable.symbol}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔷</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{stable.symbol}</span>
                          <span className="text-sm text-white/60">({stable.name})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/50">Balance: $0</span>
                          <span className="text-xs text-white/30">•</span>
                          <div className="flex gap-1">
                            {stable.chains.slice(0, 3).map((chain) => (
                              <ChainBadge key={chain} chain={chain} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">Market Cap</div>
                      <div className="text-white font-medium">
                        ${(stable.marketCap / 1_000_000_000).toFixed(1)}B
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yield-Bearing */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Yield-Bearing Stables</h3>
            <div className="space-y-2">
              {yieldBearing.map((stable) => (
                <div
                  key={stable.symbol}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💎</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{stable.symbol}</span>
                          <span className="text-sm text-white/60">({stable.name})</span>
                          {stable.isNew && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              🔥 NEW
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-success font-medium">
                            {stable.currentYield?.toFixed(1)}% APY
                          </span>
                          <span className="text-xs text-white/30">•</span>
                          <div className="flex gap-1">
                            {stable.chains.slice(0, 3).map((chain) => (
                              <ChainBadge key={chain} chain={chain} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">Market Cap</div>
                      <div className="text-white font-medium">
                        ${(stable.marketCap / 1_000_000).toFixed(0)}M
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted: USD1 & $5DEE */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30">
            <h3 className="text-lg font-semibold text-white mb-4">
              🔥 Highlighted: New Yield-Bearing Stables
            </h3>
            
            <div className="space-y-4">
              {/* USD1 */}
              <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-semibold">USD1 (Resolv Labs)</h4>
                    <div className="text-success font-bold text-xl mt-1">8.2% APY</div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">
                    T-Bill Backed
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-white/70 mt-3">
                  <div>• Backing: 100% US Treasuries</div>
                  <div>• Chains: Ethereum, Arbitrum, Optimism</div>
                  <div>• Audit: Trail of Bits ✓</div>
                  <div>• TVL: $450M</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    Add to Portfolio
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Swap to USD1
                  </Button>
                </div>
              </div>

              {/* $5DEE */}
              <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-semibold">$5DEE (5ire Network)</h4>
                    <div className="text-success font-bold text-xl mt-1">12.5% APY</div>
                  </div>
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    Higher Risk
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-white/70 mt-3">
                  <div>• Backing: 5IRE staking + treasury bonds</div>
                  <div>• Chains: 5ireChain, Ethereum (bridged)</div>
                  <div>• Audit: CertiK ✓</div>
                  <div>• TVL: $28M (early stage)</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    Add to Portfolio
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Swap to $5DEE
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => setShowComparison(true)} className="flex-1">
              Compare All Stablecoins
            </Button>
            <Button variant="outline" className="flex-1">
              + Request Stablecoin Addition
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
