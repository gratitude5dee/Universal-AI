import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, TrendingUp, UserPlus, Mail, Phone } from 'lucide-react';

interface NetworkStats {
  totalContacts: number;
  venues: number;
  promoters: number;
  newThisMonth: number;
  emailsSent: number;
  phoneCallsMade: number;
}

interface NetworkAnalyticsProps {
  stats: NetworkStats;
  loading?: boolean;
}

export const NetworkAnalytics: React.FC<NetworkAnalyticsProps> = ({
  stats,
  loading = false
}) => {
  const metrics = [
    {
      label: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      color: 'hsl(var(--accent-blue))',
      bgColor: 'hsl(var(--accent-blue))/20',
      description: 'Network size'
    },
    {
      label: 'Venues',
      value: stats.venues,
      icon: Building,
      color: 'hsl(var(--success))',
      bgColor: 'hsl(var(--success))/20',
      description: 'Performance locations'
    },
    {
      label: 'Promoters',
      value: stats.promoters,
      icon: UserPlus,
      color: 'hsl(var(--accent-purple))',
      bgColor: 'hsl(var(--accent-purple))/20',
      description: 'Event organizers'
    },
    {
      label: 'New This Month',
      value: stats.newThisMonth,
      icon: TrendingUp,
      color: 'hsl(var(--warning))',
      bgColor: 'hsl(var(--warning))/20',
      description: 'Network growth'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={metric.label}
            className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-10 bg-white/10 rounded" />
                  <div className="h-8 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-sm">{metric.label}</h3>
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: metric.bgColor }}
                    >
                      <Icon className="h-5 w-5" style={{ color: metric.color }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">{metric.value}</div>
                    <div className="text-xs text-white/60">{metric.description}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
