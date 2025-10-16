import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  iconColor?: string;
}

export const StatCard = ({ icon: Icon, label, value, trend, trendLabel, iconColor = "bg-[#9b87f5]/20" }: StatCardProps) => {
  const isPositive = trend && trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:shadow-glow transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white text-shadow-sm">{value}</p>
        <p className="text-sm text-white/70 text-shadow-sm">{label}</p>
        {trendLabel && (
          <p className="text-xs text-white/50 text-shadow-sm">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
};
