
import React from "react";
import { TrendingUp, Users, Music, DollarSign, Eye, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardStats {
  totalStreams: number;
  monthlyListeners: number;
  totalTracks: number;
  revenue: number;
  trending: boolean;
}

const mockStats: DashboardStats = {
  totalStreams: 2540000,
  monthlyListeners: 45200,
  totalTracks: 23,
  revenue: 12400,
  trending: true
};

const mockTracks = [
  {
    id: 1,
    title: "Midnight Frequencies",
    plays: 145000,
    revenue: 2340,
    likes: 8200,
    shares: 1200,
    trending: true
  },
  {
    id: 2,
    title: "Digital Dreams",
    plays: 89000,
    revenue: 1450,
    likes: 4300,
    shares: 890,
    trending: false
  },
  {
    id: 3,
    title: "Blockchain Symphony",
    plays: 67000,
    revenue: 1100,
    likes: 3100,
    shares: 670,
    trending: false
  }
];

export const ArtistDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Total Streams</p>
              <p className="text-xl font-bold text-white">
                {(mockStats.totalStreams / 1000000).toFixed(1)}M
              </p>
            </div>
            <Music className="h-8 w-8 text-studio-accent" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Monthly Listeners</p>
              <p className="text-xl font-bold text-white">
                {(mockStats.monthlyListeners / 1000).toFixed(1)}k
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Active Releases</p>
              <p className="text-xl font-bold text-white">{mockStats.totalTracks}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Revenue (USD)</p>
              <p className="text-xl font-bold text-white">${mockStats.revenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Track Performance */}
      <Card className="p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-studio-accent" />
          Track Performance
        </h3>

        <div className="space-y-4">
          {mockTracks.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-white/10 border border-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-studio-accent to-blue-500 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{track.title}</h4>
                    {track.trending && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">{track.plays.toLocaleString()} plays</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center text-white/60">
                    <Eye className="w-4 h-4 mr-1" />
                    {(track.plays / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center text-white/60">
                    <Heart className="w-4 h-4 mr-1" />
                    {(track.likes / 1000).toFixed(1)}k
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center text-white/60">
                    <Share2 className="w-4 h-4 mr-1" />
                    {track.shares}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-medium">
                    ${track.revenue}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Chart Placeholder */}
      <Card className="p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Analytics</h3>
        <div className="h-64 bg-gradient-to-br from-studio-accent/10 to-blue-500/10 rounded-lg flex items-center justify-center">
          <p className="text-white/60">Revenue chart visualization coming soon</p>
        </div>
      </Card>
    </div>
  );
};
