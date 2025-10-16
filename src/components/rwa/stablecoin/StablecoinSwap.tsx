import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Settings, ChevronDown } from "lucide-react";
import { mockStablecoins } from "@/data/rwa/mockData";
import { SwapSettings } from "./SwapSettings";
import { StablecoinList } from "./StablecoinList";
import { fetchSwapQuote } from "./SwapQuoteEngine";
import { SwapRoute } from "@/types/rwa";

export const StablecoinSwap = () => {
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showStablecoinList, setShowStablecoinList] = useState(false);
  const [swapRoute, setSwapRoute] = useState<SwapRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fromStable = mockStablecoins.find((s) => s.symbol === fromToken);
  const toStable = mockStablecoins.find((s) => s.symbol === toToken);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        fetchQuote();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [amount, fromToken, toToken]);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const quote = await fetchSwapQuote(fromToken, toToken, parseFloat(amount));
      setSwapRoute(quote);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleMax = () => {
    // Mock balance - in production, fetch from wallet
    setAmount("45230.18");
  };

  const getPriceImpactColor = (impact: number) => {
    if (impact < 0.1) return "text-success";
    if (impact < 1) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Unified Stablecoin Swap</h2>
          <p className="text-white/70 text-sm mt-1">
            Swap between 18+ stablecoins with best price routing across multiple DEXes
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Swap Interface */}
      <div className="glass-card p-6 rounded-xl border border-white/10">
        {/* FROM Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">FROM</span>
            <span className="text-sm text-white/50">Balance: 45,230.18</span>
          </div>
          
          <div className="flex gap-3">
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockStablecoins.map((stable) => (
                  <SelectItem key={stable.symbol} value={stable.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{stable.symbol}</span>
                      {stable.isNew && (
                        <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl h-14 bg-white/5 border-white/10 pr-16"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMax}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
              >
                MAX
              </Button>
            </div>
          </div>

          <div className="text-sm text-white/50">
            ≈ ${amount ? (parseFloat(amount) * 1).toFixed(2) : "0.00"} USD
          </div>
        </div>

        {/* Flip Button */}
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFlip}
            className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* TO Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">TO</span>
            <span className="text-sm text-white/50">Balance: 0.00</span>
          </div>
          
          <div className="flex gap-3">
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockStablecoins.map((stable) => (
                  <SelectItem key={stable.symbol} value={stable.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{stable.symbol}</span>
                      {stable.isNew && (
                        <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1">
              <Input
                type="number"
                placeholder="0.00"
                value={swapRoute ? swapRoute.estimatedOutput.toFixed(2) : ""}
                disabled
                className="text-2xl h-14 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="text-sm text-white/50">
            ≈ ${swapRoute ? swapRoute.estimatedOutput.toFixed(2) : "0.00"} USD
          </div>
        </div>

        {/* Route Details */}
        {swapRoute && (
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Rate</span>
              <span className="text-white">
                1 {fromToken} = {swapRoute.rate.toFixed(5)} {toToken}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Price Impact</span>
              <span className={getPriceImpactColor(swapRoute.priceImpact)}>
                {swapRoute.priceImpact < 0.01 ? "<0.01" : swapRoute.priceImpact.toFixed(2)}%
                {swapRoute.priceImpact < 0.1 && " ✓ Excellent"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Route</span>
              <span className="text-white text-xs">
                {swapRoute.routePath.join(" → ")}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Network Fee</span>
              <span className="text-white">${swapRoute.gasCost.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Platform Fee</span>
              <span className="text-success">0% (Free!)</span>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">You Receive</span>
                <span className="text-white font-bold text-lg">
                  {swapRoute.estimatedOutput.toFixed(2)} {toToken}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                <span>Total Cost</span>
                <span>${(swapRoute.gasCost + swapRoute.platformFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-white/50 text-center">
              Execution Time: ~{swapRoute.executionTime} seconds
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            disabled={!amount || !swapRoute || isLoading}
          >
            {isLoading ? "Fetching Quote..." : "🔄 SWAP NOW"}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-4 rounded-xl border border-white/10">
        <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="w-full">
            Consolidate All to USDC
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Balance Across Chains
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Convert to Yield-Bearing
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowStablecoinList(true)}
          >
            View All Stablecoins
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showSettings && <SwapSettings onClose={() => setShowSettings(false)} />}
      {showStablecoinList && <StablecoinList onClose={() => setShowStablecoinList(false)} />}
    </div>
  );
};
