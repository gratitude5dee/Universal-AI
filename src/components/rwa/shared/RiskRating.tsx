import { Shield, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskRatingProps {
  level: 'low' | 'medium' | 'high';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const RiskRating = ({ level, showLabel = true, size = 'md' }: RiskRatingProps) => {
  const getConfig = () => {
    switch (level) {
      case 'low':
        return {
          icon: Shield,
          color: 'text-[#059669] bg-[#059669]/20',
          label: 'Low Risk',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-[#F59E0B] bg-[#F59E0B]/20',
          label: 'Medium Risk',
        };
      case 'high':
        return {
          icon: AlertOctagon,
          color: 'text-[#DC2626] bg-[#DC2626]/20',
          label: 'High Risk',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 ${config.color} ${sizeClasses}`}>
      <Icon className={iconSize} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </div>
  );
};
