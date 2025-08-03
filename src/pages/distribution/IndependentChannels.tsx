
import React from "react";
import DistributionLayout from "@/layouts/distribution-layout";
import { User, BarChart3, TrendingUp, Globe, Music, DollarSign } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

const IndependentChannels = () => {
  const platforms = [
    {
      name: "Bandcamp",
      icon: "/placeholder.svg",
      followers: "8.2K",
      revenue: "$4,230",
      growth: "+12%",
      releases: 15
    },
    {
      name: "SoundCloud",
      icon: "/placeholder.svg",
      followers: "24.5K",
      revenue: "$1,850",
      growth: "+8%",
      releases: 32
    },
    {
      name: "Patreon",
      icon: "/placeholder.svg",
      followers: "342",
      revenue: "$5,180",
      growth: "+5%",
      releases: 24
    },
    {
      name: "Substack",
      icon: "/placeholder.svg",
      followers: "1.2K",
      revenue: "$2,760",
      growth: "+15%",
      releases: 18
    }
  ];
  
  return (
    <DistributionLayout 
      title="Independent Channels" 
      subtitle="Manage your direct-to-fan platforms and creator economy presence"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Subscribers"
          value="34.2K"
          description="Across all platforms"
          icon={User}
          trend="up"
          trendValue="9.5%"
          delay={0}
        />
        <StatsCard
          title="Direct Revenue"
          value="$14,020"
          description="Last 30 days"
          icon={DollarSign}
          trend="up"
          trendValue="12.4%"
          delay={1}
        />
        <StatsCard
          title="Content Engagement"
          value="22.8%"
          description="Average rate"
          icon={BarChart3}
          trend="up"
          trendValue="3.1%"
          delay={2}
        />
        <StatsCard
          title="New Subscribers"
          value="1,254"
          description="Last 30 days"
          icon={TrendingUp}
          trend="up"
          trendValue="18.7%"
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Platform Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform, index) => (
              <div key={index} className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 mr-4">
                    <img src={platform.icon} alt={platform.name} className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{platform.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">{platform.followers} followers</span>
                      <span className="text-xs text-green-500 ml-2">{platform.growth}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-studio-sand/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Revenue</div>
                    <div className="text-lg font-medium">{platform.revenue}</div>
                  </div>
                  <div className="text-center p-3 bg-studio-sand/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Releases</div>
                    <div className="text-lg font-medium">{platform.releases}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 backdrop-blur-md flex justify-end">
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                    Manage Platform →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Subscriber Tiers</h2>
            <div className="space-y-4">
              {[
                { name: "Casual Fan", price: "$5/month", members: 245, color: "bg-blue-100", textColor: "text-blue-700" },
                { name: "Dedicated Fan", price: "$15/month", members: 128, color: "bg-purple-100", textColor: "text-purple-700" },
                { name: "Super Fan", price: "$30/month", members: 64, color: "bg-pink-100", textColor: "text-pink-700" },
                { name: "Inner Circle", price: "$100/month", members: 12, color: "bg-studio-accent/20", textColor: "text-studio-accent" }
              ].map((tier, index) => (
                <div key={index} className={`${tier.color} ${tier.textColor} p-4 rounded-xl`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{tier.name}</h3>
                      <div className="font-medium">{tier.price}</div>
                    </div>
                    <div className="font-medium">{tier.members} members</div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 px-4 text-sm bg-purple-100 text-purple-700 rounded-lg font-medium mt-2 hover:bg-purple-200 transition-colors">
                Manage Subscription Tiers
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Exclusive Content</h2>
            <div className="space-y-3">
              {[
                { name: "Behind The Scenes", type: "Video Series", newContent: true, tier: "Dedicated Fan" },
                { name: "Early Access Tracks", type: "Music", newContent: false, tier: "Casual Fan" },
                { name: "Production Breakdown", type: "Tutorial", newContent: true, tier: "Super Fan" },
                { name: "Livestream Q&A", type: "Event", newContent: false, tier: "Inner Circle" }
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg border border-white/10 backdrop-blur-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-studio-sand/20 mr-3">
                      <Music className="h-4 w-4 text-studio-clay" />
                    </div>
                    <div>
                      <div className="font-medium text-sm flex items-center">
                        {content.name}
                        {content.newContent && (
                          <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">New</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{content.type} • {content.tier}</div>
                    </div>
                  </div>
                  <button className="text-xs text-purple-600 hover:text-purple-700">
                    Edit
                  </button>
                </div>
              ))}
              <button className="w-full py-2 px-4 text-sm text-purple-600 border border-purple-600 rounded-lg font-medium mt-2 hover:bg-purple-50 transition-colors">
                Add New Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </DistributionLayout>
  );
};

export default IndependentChannels;
