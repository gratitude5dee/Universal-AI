import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from './types';

interface DealUpdate {
  id: string;
  project: string;
  type: "Sync" | "Brand Partnership" | "License";
  amount: number;
  status: "Pending" | "Paid" | "Negotiating" | "New Lead";
  timestamp: string;
  change?: 'new' | 'updated' | 'completed';
}

const RealTimeDealsWidget = () => {
  const [recentUpdates, setRecentUpdates] = useState<DealUpdate[]>([
    {
      id: 'd1',
      project: 'Netflix "Midnight Rush"',
      type: 'Sync',
      amount: 18500,
      status: 'New Lead',
      timestamp: '2 min ago',
      change: 'new'
    },
    {
      id: 'd2',
      project: 'Aura Headphones Campaign',
      type: 'Brand Partnership',
      amount: 25000,
      status: 'Negotiating',
      timestamp: '5 min ago',
      change: 'updated'
    },
    {
      id: 'd3',
      project: 'Spotify Playlist Feature',
      type: 'License',
      amount: 5500,
      status: 'Paid',
      timestamp: '12 min ago',
      change: 'completed'
    }
  ]);

  const [totalPipeline, setTotalPipeline] = useState(49000);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new deal updates
      const newUpdate: DealUpdate = {
        id: `d${Date.now()}`,
        project: `Deal ${Math.floor(Math.random() * 1000)}`,
        type: ['Sync', 'Brand Partnership', 'License'][Math.floor(Math.random() * 3)] as any,
        amount: Math.floor(Math.random() * 50000) + 5000,
        status: ['New Lead', 'Negotiating', 'Pending'][Math.floor(Math.random() * 3)] as any,
        timestamp: 'Just now',
        change: 'new'
      };

      setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
      setTotalPipeline(prev => prev + newUpdate.amount);
    }, 15000); // New update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Lead': return 'bg-cyan-400/20 text-cyan-400';
      case 'Negotiating': return 'bg-yellow-400/20 text-yellow-400';
      case 'Pending': return 'bg-orange-400/20 text-orange-400';
      case 'Paid': return 'bg-green-400/20 text-green-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'new': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'updated': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'completed': return <DollarSign className="w-3 h-3 text-green-400" />;
      default: return <AlertCircle className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Live Deals Pipeline</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white/60">Live</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">{formatCurrency(totalPipeline)}</div>
        <p className="text-sm text-white/70">Total pipeline value</p>
      </div>

      <div className="space-y-3 flex-1">
        {recentUpdates.map((deal, index) => (
          <div 
            key={deal.id}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              index === 0 ? 'bg-white/10 border-white/20 animate-pulse' : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getChangeIcon(deal.change || 'new')}
                  <p className="text-sm font-medium text-white truncate">{deal.project}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs py-0 px-2 border-white/30 text-white/80">
                    {deal.type}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{formatCurrency(deal.amount)}</p>
                <p className="text-xs text-white/60">{deal.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/60 text-center">
          Updates refresh automatically • Last update: {recentUpdates[0]?.timestamp || 'Now'}
        </p>
      </div>
    </div>
  );
};

export default RealTimeDealsWidget;