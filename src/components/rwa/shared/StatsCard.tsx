interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard = ({ title, value, subtitle, trend }: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-[#059669]';
      case 'down':
        return 'text-[#DC2626]';
      default:
        return 'text-white/70';
    }
  };

  return (
    <div className="glass-card p-4 rounded-xl">
      <p className="text-white/70 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && (
        <p className={`text-xs ${getTrendColor()}`}>{subtitle}</p>
      )}
    </div>
  );
};
