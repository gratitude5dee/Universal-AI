import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface YieldIndicatorProps {
  current: number;
  potential?: number;
  improvement?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export const YieldIndicator = ({ current, potential, improvement, trend = 'neutral' }: YieldIndicatorProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-[#059669]" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-[#DC2626]" />;
      default:
        return <Minus className="h-4 w-4 text-white/50" />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-2xl font-bold text-white">{current.toFixed(1)}% APY</p>
        {potential && (
          <p className="text-sm text-white/70">
            Potential: {potential.toFixed(1)}% APY
            {improvement && (
              <span className="text-[#059669] ml-1">(+{improvement.toFixed(1)}%)</span>
            )}
          </p>
        )}
      </div>
      {getTrendIcon()}
    </div>
  );
};
