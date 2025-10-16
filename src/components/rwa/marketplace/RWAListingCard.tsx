import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, Users, Calendar, Flame } from "lucide-react";
import { AssetTypeIcon } from "../shared/AssetTypeIcon";
import { YieldIndicator } from "../shared/YieldIndicator";
import { RiskRating } from "../shared/RiskRating";
import type { MarketplaceListing } from "@/types/rwa";

interface RWAListingCardProps {
  listing: MarketplaceListing;
  onClick: () => void;
}

export const RWAListingCard = ({ listing, onClick }: RWAListingCardProps) => {
  const isFullyFunded = listing.fundingProgress >= 100;
  const isNew = new Date(listing.closesAt).getTime() - Date.now() > 30 * 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((new Date(listing.closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getRiskLevel = () => {
    if (listing.asset.assetType === "financial-instruments") return "low";
    if (listing.asset.assetType === "real-estate") return "low";
    if (listing.asset.assetType === "art-collectibles") return "medium";
    return "medium";
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-[1.02] transition-all duration-300"
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <AssetTypeIcon assetType={listing.asset.assetType} size="md" />
            <span className="text-xs text-white/50 uppercase tracking-wider">
              {listing.asset.assetType.replace("-", " ")}
            </span>
          </div>
          <div className="flex gap-1">
            {isNew && (
              <Badge variant="outline" className="border-[#EA580C] text-[#EA580C] bg-[#EA580C]/10">
                <Flame className="h-3 w-3 mr-1" />
                NEW
              </Badge>
            )}
            {isFullyFunded && (
              <Badge variant="outline" className="border-[#059669] text-[#059669] bg-[#059669]/10">
                FILLED
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
            {listing.asset.tokenName}
          </h3>
          <p className="text-sm text-white/50 mt-1">
            {listing.asset.tokenSymbol}
          </p>
        </div>

        {/* Valuation & Tokenization */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-white/50">Total Value</p>
            <p className="text-white font-semibold">
              ${(listing.asset.valuation / 1_000_000).toFixed(1)}M
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50">Token Price</p>
            <p className="text-white font-semibold">
              ${listing.pricePerToken}
            </p>
          </div>
        </div>

        {/* Yield */}
        {listing.financialDetails && (
          <div className="space-y-1">
            <p className="text-xs text-white/50">Yield</p>
            <p className="text-lg font-semibold text-[#059669]">
              {listing.financialDetails.currentYield.toFixed(1)}% APY
            </p>
          </div>
        )}

        {/* Risk Rating */}
        <RiskRating level={getRiskLevel() as any} size="sm" />

        {/* Funding Progress */}
        {!isFullyFunded ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Funding Progress</span>
              <span className="font-semibold">{listing.fundingProgress}%</span>
            </div>
            <Progress value={listing.fundingProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{listing.investorCount} investors</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-[#059669]">
              <Users className="h-4 w-4" />
              <span>{listing.investorCount} investors</span>
            </div>
            <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
              Secondary Market
            </Badge>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 py-2 px-4 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </button>
          <button
            className="flex-1 py-2 px-4 rounded-lg bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {isFullyFunded ? "Buy on Market" : "Invest Now"}
          </button>
        </div>
      </div>
    </Card>
  );
};
