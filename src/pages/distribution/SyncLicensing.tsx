
import React from "react";
import DistributionLayout from "@/layouts/distribution-layout";
import { Music, DollarSign, FileText, Tv, Film, Gamepad2, Radio } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

const SyncLicensing = () => {
  const recentDeals = [
    {
      title: "Premium Car Commercial",
      song: "Electric Dreams",
      type: "Commercial",
      fee: "$48,000",
      status: "Confirmed",
      date: "Aug 25, 2023",
      territory: "Global"
    },
    {
      title: "Indie Film Soundtrack",
      song: "Midnight Blue",
      type: "Film",
      fee: "$12,500",
      status: "Pending",
      date: "Sep 10, 2023",
      territory: "North America"
    },
    {
      title: "Mobile Game Integration",
      song: "Power Up",
      type: "Video Game",
      fee: "$22,000",
      status: "Confirmed",
      date: "Aug 18, 2023",
      territory: "Global"
    },
    {
      title: "TV Drama Season Finale",
      song: "Last Goodbye",
      type: "Television",
      fee: "$35,000",
      status: "Confirmed",
      date: "Jul 30, 2023",
      territory: "Global"
    }
  ];
  
  const licensableMusic = [
    {
      title: "Summer Waves",
      mood: "Uplifting, Energetic",
      genres: ["Pop", "Electronic"],
      catalog: "Universal Sounds",
      clearance: "One-stop",
      tracks: 8
    },
    {
      title: "Urban Rhythms",
      mood: "Bold, Confident",
      genres: ["Hip Hop", "R&B"],
      catalog: "Street Beats",
      clearance: "One-stop",
      tracks: 12
    },
    {
      title: "Cinematic Emotions",
      mood: "Dramatic, Intense",
      genres: ["Orchestral", "Ambient"],
      catalog: "Score Library",
      clearance: "One-stop",
      tracks: 15
    }
  ];
  
  return (
    <DistributionLayout 
      title="Sync Licensing" 
      subtitle="Manage licensing opportunities for film, TV, commercials, and more"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Licenses"
          value="24"
          description="Currently in use"
          icon={FileText}
          trend="up"
          trendValue="4"
          delay={0}
        />
        <StatsCard
          title="Annual Revenue"
          value="$248K"
          description="From sync licenses"
          icon={DollarSign}
          trend="up"
          trendValue="15.2%"
          delay={1}
        />
        <StatsCard
          title="Pending Deals"
          value="8"
          description="In negotiation"
          icon={Music}
          delay={2}
        />
        <StatsCard
          title="Licensed Tracks"
          value="42"
          description="Total catalog"
          icon={Music}
          trend="up"
          trendValue="6"
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="glass-card p-6 lg:col-span-8">
          <h2 className="text-xl font-bold mb-4">Recent Licensing Deals</h2>
          <div className="glass-card rounded-xl border border-white/10 backdrop-blur-md overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-studio-sand/10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="glass-card divide-y divide-white/10">
                {recentDeals.map((deal, index) => (
                  <tr key={index} className="hover:bg-studio-sand/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{deal.title}</div>
                      <div className="text-xs text-muted-foreground">Song: {deal.song}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{deal.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{deal.fee}</div>
                      <div className="text-xs text-muted-foreground">{deal.territory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        deal.status === "Confirmed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{deal.date}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="glass-card p-6 lg:col-span-4">
          <h2 className="text-xl font-bold mb-4">Licensing Channels</h2>
          <div className="space-y-4">
            {[
              { name: "Film & TV", icon: Tv, count: 14, revenue: "$135K", color: "bg-purple-100" },
              { name: "Commercials", icon: Radio, count: 8, revenue: "$95K", color: "bg-blue-100" },
              { name: "Video Games", icon: Gamepad2, count: 5, revenue: "$42K", color: "bg-green-100" },
              { name: "Trailers", icon: Film, count: 3, revenue: "$28K", color: "bg-orange-100" }
            ].map((channel, index) => (
              <div key={index} className="glass-card p-4 rounded-lg border border-white/10 backdrop-blur-md flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${channel.color} mr-4`}>
                  <channel.icon className="h-6 w-6 text-studio-clay" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{channel.name}</h3>
                  <div className="text-sm text-muted-foreground">{channel.count} licenses</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{channel.revenue}</div>
                  <div className="text-xs text-muted-foreground">Annual</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Licensable Music Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {licensableMusic.map((package_, index) => (
            <div key={index} className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 mr-4">
                  <Music className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{package_.title}</h3>
                  <div className="text-xs text-muted-foreground">{package_.tracks} tracks</div>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mood:</span>
                  <span className="font-medium text-right">{package_.mood}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Genres:</span>
                  <span className="font-medium text-right">{package_.genres.join(", ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Catalog:</span>
                  <span className="font-medium">{package_.catalog}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Clearance:</span>
                  <span className="font-medium">{package_.clearance}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 backdrop-blur-md flex justify-between">
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                  Listen
                </button>
                <button className="text-studio-accent text-sm font-medium hover:text-studio-accent/80">
                  License Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DistributionLayout>
  );
};

export default SyncLicensing;
