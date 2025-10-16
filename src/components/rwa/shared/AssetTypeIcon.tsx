import { Building2, Coins, Palette, Gem, Briefcase, FileText, Zap, LandPlot } from "lucide-react";
import { RWAAssetType } from "@/types/rwa";

interface AssetTypeIconProps {
  assetType: RWAAssetType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AssetTypeIcon = ({ assetType, size = 'md', className = '' }: AssetTypeIconProps) => {
  const getIcon = () => {
    switch (assetType) {
      case 'real-estate':
        return Building2;
      case 'financial-instruments':
        return Coins;
      case 'art-collectibles':
        return Palette;
      case 'commodities':
        return Gem;
      case 'business-equity':
        return Briefcase;
      case 'intellectual-property':
        return FileText;
      case 'revenue-streams':
        return Zap;
      case 'infrastructure':
        return LandPlot;
    }
  };

  const Icon = getIcon();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return <Icon className={`${sizeClasses[size]} ${className}`} />;
};
