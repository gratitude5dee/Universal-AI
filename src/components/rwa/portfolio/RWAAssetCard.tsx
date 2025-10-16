import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreVertical, Building2 } from "lucide-react";
import { AssetTypeIcon } from "../shared/AssetTypeIcon";
import type { RWAHolding } from "@/types/rwa";

interface RWAAssetCardProps {
  holding: RWAHolding;
  viewMode: "grid" | "list";
  onClick: () => void;
}

export const RWAAssetCard = ({ holding, viewMode, onClick }: RWAAssetCardProps) => {
  const gainPercentage = ((holding.currentValue - holding.totalInvested) / holding.totalInvested) * 100;
  const isGain = gainPercentage >= 0;

  if (viewMode === "list") {
    return (
      <Card
        className="glass-card p-4 rounded-xl border-white/10 hover:bg-white/10 cursor-pointer transition-all hover-scale"
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <AssetTypeIcon assetType={holding.asset.assetType} size="md" />
            <div className="flex-1">
              <h4 className="text-white font-semibold">{holding.asset.tokenName}</h4>
              <p className="text-sm text-white/50">{holding.tokenCount.toLocaleString()} tokens</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">${holding.currentValue.toLocaleString()}</p>
            <div className={`flex items-center gap-1 text-sm ${isGain ? "text-[#059669]" : "text-[#DC2626]"}`}>
              {isGain ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{isGain ? "+" : ""}{gainPercentage.toFixed(2)}%</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group glass-card p-6 rounded-xl border-white/10 hover:bg-white/10 cursor-pointer transition-all hover-scale overflow-hidden"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <AssetTypeIcon assetType={holding.asset.assetType} size="lg" />
          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
            {holding.asset.tokenName}
          </h3>
          <p className="text-sm text-white/50 mt-1">
            {holding.asset.tokenSymbol}
          </p>
        </div>

        {/* Holdings */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-white/50">Holdings</p>
            <p className="text-white font-semibold">{holding.tokenCount.toLocaleString()} tokens</p>
          </div>
          <div className="text-right">
            <p className="text-white/50">Entry Price</p>
            <p className="text-white font-semibold">${holding.entryPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Current Value */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/50 mb-1">Current Value</p>
          <p className="text-2xl font-bold text-white">
            ${holding.currentValue.toLocaleString()}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${isGain ? "text-[#059669]" : "text-[#DC2626]"}`}>
            {isGain ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{isGain ? "+" : ""}{gainPercentage.toFixed(2)}%</span>
            <span className="text-white/50 ml-1">
              (${Math.abs(holding.unrealizedGain).toLocaleString()})
            </span>
          </div>
        </div>

        {/* Yield */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-white/50">Yield Earned</p>
            <p className="text-[#059669] font-semibold">${holding.yieldEarned.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-white/50">Monthly Income</p>
            <p className="text-white font-semibold">
              ${(holding.distributions[0]?.amountPerToken * holding.tokenCount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 text-white hover:bg-white/5"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Trade
          </Button>
        </div>
      </div>
    </Card>
  );
};
