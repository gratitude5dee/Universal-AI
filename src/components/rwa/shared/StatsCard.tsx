import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  trend?: number;
  iconColor?: string;
}

export const StatsCard = ({ icon: Icon, label, value, subtitle, trend, iconColor = "text-[#D4AF37]" }: StatsCardProps) => {
  const getTrendDisplay = () => {
    if (trend === undefined) return null;
    const isPositive = trend >= 0;
    return (
      <p className={`text-xs ${isPositive ? "text-[#059669]" : "text-[#DC2626]"}`}>
        {isPositive ? "+" : ""}{trend.toFixed(2)}%
      </p>
    );
  };

  return (
    <div className="glass-card p-4 rounded-xl hover-scale transition-all">
      {Icon && (
        <div className="mb-3">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      )}
      <p className="text-white/70 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      {getTrendDisplay()}
    </div>
  );
};
