
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DistributionLayout from "@/layouts/distribution-layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Tv, Radio, Headphones, Film, Music, Mic, Calendar, 
  PlayCircle, CheckCircle2, Loader2, PlusCircle, ListFilter
} from "lucide-react";

const MediaChannels = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appearances");

  // Mock data for upcoming media appearances
  const upcomingAppearances = [
    { 
      id: 1, 
      title: "Morning Show Interview", 
      channel: "Global Radio Network", 
      date: "Oct 29, 2023", 
      time: "09:30 AM",
      status: "Confirmed",
      type: "Radio",
      icon: Radio
    },
    { 
      id: 2, 
      title: "Music Festival Coverage", 
      channel: "Music TV", 
      date: "Nov 12, 2023", 
      time: "04:00 PM",
      status: "Pending",
      type: "TV",
      icon: Tv
    },
    { 
      id: 3, 
      title: "Podcast Guest Appearance", 
      channel: "Sound Explorers Podcast", 
      date: "Nov 18, 2023", 
      time: "10:00 AM",
      status: "Confirmed",
      type: "Podcast",
      icon: Headphones
    },
    { 
      id: 4, 
      title: "Album Review Session", 
      channel: "Music Critics Circle", 
      date: "Nov 25, 2023", 
      time: "02:30 PM",
      status: "Tentative",
      type: "Online",
      icon: Music
    }
  ];

  // Mock data for distribution channels
  const distributionChannels = [
    { 
      name: "Spotify", 
      icon: "https://placehold.co/40/1DB954/FFFFFF?text=S", 
      status: "Active",
      listeners: "345.2K",
      growth: "+12.4%",
      revenue: "$4,235"
    },
    { 
      name: "Apple Music", 
      icon: "https://placehold.co/40/FB233B/FFFFFF?text=A", 
      status: "Active",
      listeners: "278.1K",
      growth: "+8.7%",
      revenue: "$3,187"
    },
    { 
      name: "Amazon Music", 
      icon: "https://placehold.co/40/00A8E1/FFFFFF?text=AM", 
      status: "Active",
      listeners: "156.4K",
      growth: "+15.2%",
      revenue: "$1,842"
    },
    { 
      name: "YouTube Music", 
      icon: "https://placehold.co/40/FF0000/FFFFFF?text=YT", 
      status: "Active",
      listeners: "210.9K",
      growth: "+21.3%",
      revenue: "$2,719"
    },
    { 
      name: "Tidal", 
      icon: "https://placehold.co/40/000000/FFFFFF?text=T", 
      status: "Active",
      listeners: "89.5K",
      growth: "+5.8%",
      revenue: "$1,124"
    }
  ];

  // Mock data for radio play statistics
  const radioPlayStats = [
    { station: "Top 40 Radio", plays: 78, reach: "4.2M", trend: "+12%" },
    { station: "Alternative Rock", plays: 64, reach: "2.8M", trend: "+8%" },
    { station: "Urban Contemporary", plays: 43, reach: "3.1M", trend: "+15%" },
    { station: "Adult Contemporary", plays: 52, reach: "3.5M", trend: "+5%" },
    { station: "College Radio", plays: 31, reach: "1.2M", trend: "+23%" },
  ];

  return (
    <DistributionLayout 
      title="Media Channels" 
      subtitle="Manage your distribution across traditional media channels"
    >
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex justify-center space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
          <div 
            onClick={() => navigate('/distribution/social-media')}
            className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            Social Media WZRD
          </div>
          <div 
            onClick={() => navigate('/distribution/on-chain')}
            className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            On-Chain Distribution
          </div>
          <div className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium">
            Media Channels
          </div>
          <div 
            onClick={() => navigate('/distribution/independent')}
            className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            Independent Channels
          </div>
          <div 
            onClick={() => window.location.href = 'https://sync.universal-ai.xyz/'}
            className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            Sync Licensing
          </div>
        </div>
      </div>

      {/* Media Channel Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="glass-card p-5"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-red-100 mr-3">
              <Tv className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="font-medium">Television</h3>
          </div>
          <p className="text-sm text-studio-clay mb-3">8 appearances in the last quarter</p>
          <div className="text-xs text-emerald-500">Reach: 12.4M viewers</div>
        </motion.div>
        
        <motion.div 
          className="glass-card p-5"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <Radio className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-medium">Radio</h3>
          </div>
          <p className="text-sm text-studio-clay mb-3">268 plays across 42 stations</p>
          <div className="text-xs text-emerald-500">Reach: 18.7M listeners</div>
        </motion.div>
        
        <motion.div 
          className="glass-card p-5"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-purple-100 mr-3">
              <Headphones className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="font-medium">Podcast</h3>
          </div>
          <p className="text-sm text-studio-clay mb-3">15 guest appearances</p>
          <div className="text-xs text-emerald-500">Reach: 5.2M listeners</div>
        </motion.div>
        
        <motion.div 
          className="glass-card p-5"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-amber-100 mr-3">
              <Film className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="font-medium">Film & TV</h3>
          </div>
          <p className="text-sm text-studio-clay mb-3">3 placements in major productions</p>
          <div className="text-xs text-emerald-500">Reach: 7.8M viewers</div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 glass-card rounded-xl border border-white/10 backdrop-blur-md overflow-hidden">
        <div className="flex border-b border-white/10 backdrop-blur-md overflow-x-auto">
          <button 
            className={`px-4 py-3 text-sm font-medium flex-shrink-0 ${activeTab === "appearances" ? "border-b-2 border-studio-accent text-studio-accent" : "text-studio-clay"}`}
            onClick={() => setActiveTab("appearances")}
          >
            Media Appearances
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium flex-shrink-0 ${activeTab === "streaming" ? "border-b-2 border-studio-accent text-studio-accent" : "text-studio-clay"}`}
            onClick={() => setActiveTab("streaming")}
          >
            Streaming Platforms
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium flex-shrink-0 ${activeTab === "radio" ? "border-b-2 border-studio-accent text-studio-accent" : "text-studio-clay"}`}
            onClick={() => setActiveTab("radio")}
          >
            Radio Performance
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium flex-shrink-0 ${activeTab === "campaign" ? "border-b-2 border-studio-accent text-studio-accent" : "text-studio-clay"}`}
            onClick={() => setActiveTab("campaign")}
          >
            Campaign Planning
          </button>
        </div>

        <div className="p-5">
          {activeTab === "appearances" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Upcoming Media Appearances</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </Button>
                  <Button variant="default" size="sm" className="bg-studio-accent gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Appearance
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingAppearances.map((appearance) => {
                  const AppearanceIcon = appearance.icon;
                  return (
                    <div key={appearance.id} className="glass-card rounded-xl border border-white/10 backdrop-blur-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            appearance.type === "Radio" ? "bg-blue-100" : 
                            appearance.type === "TV" ? "bg-red-100" : 
                            appearance.type === "Podcast" ? "bg-purple-100" : "bg-amber-100"
                          }`}>
                            <AppearanceIcon className={`h-5 w-5 ${
                              appearance.type === "Radio" ? "text-blue-500" : 
                              appearance.type === "TV" ? "text-red-500" : 
                              appearance.type === "Podcast" ? "text-purple-500" : "text-amber-500"
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{appearance.title}</h4>
                            <div className="text-sm text-studio-clay">{appearance.channel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{appearance.date}</div>
                          <div className="text-sm text-studio-clay">{appearance.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-3 pt-3 border-t border-white/10 backdrop-blur-md">
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appearance.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" : 
                            appearance.status === "Pending" ? "bg-amber-100 text-amber-700" : 
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {appearance.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Notes</Button>
                          <Button variant="outline" size="sm">Prepare</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "streaming" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Streaming Distribution Channels</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-studio-sand/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Platform</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Monthly Listeners</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Growth</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Revenue (Last Month)</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionChannels.map((channel, index) => (
                      <tr key={channel.name} className={`border-b border-white/10 backdrop-blur-md ${index % 2 === 0 ? 'glass-card' : 'bg-studio-sand/5'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img src={channel.icon} alt={channel.name} className="w-8 h-8 rounded mr-3" />
                            <span className="font-medium">{channel.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                            {channel.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{channel.listeners}</td>
                        <td className="px-4 py-3 text-emerald-500 font-medium">{channel.growth}</td>
                        <td className="px-4 py-3 font-medium">{channel.revenue}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-5 flex justify-center">
                <Button variant="outline" size="sm" className="gap-1">
                  <PlayCircle className="h-4 w-4" />
                  Connect New Platform
                </Button>
              </div>
            </div>
          )}

          {activeTab === "radio" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Radio Play Performance</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Last 30 Days</Button>
                  <Button variant="outline" size="sm">Export Data</Button>
                </div>
              </div>

              <div className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Radio Play Overview</h4>
                  <div className="text-sm text-studio-clay">Updated: Today at 09:34 AM</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-studio-sand/10 rounded-lg text-center">
                    <div className="font-medium text-2xl">268</div>
                    <div className="text-sm text-studio-clay">Total Plays</div>
                  </div>
                  <div className="p-3 bg-studio-sand/10 rounded-lg text-center">
                    <div className="font-medium text-2xl">42</div>
                    <div className="text-sm text-studio-clay">Stations</div>
                  </div>
                  <div className="p-3 bg-studio-sand/10 rounded-lg text-center">
                    <div className="font-medium text-2xl">18.7M</div>
                    <div className="text-sm text-studio-clay">Listener Reach</div>
                  </div>
                  <div className="p-3 bg-studio-sand/10 rounded-lg text-center">
                    <div className="font-medium text-2xl text-emerald-500">+12.4%</div>
                    <div className="text-sm text-studio-clay">Growth (vs. Last Month)</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-studio-sand/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Station Format</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Weekly Plays</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Estimated Reach</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Trend</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-studio-clay">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radioPlayStats.map((station, index) => (
                      <tr key={station.station} className={`border-b border-white/10 backdrop-blur-md ${index % 2 === 0 ? 'glass-card' : 'bg-studio-sand/5'}`}>
                        <td className="px-4 py-3 font-medium">{station.station}</td>
                        <td className="px-4 py-3">{station.plays}</td>
                        <td className="px-4 py-3">{station.reach}</td>
                        <td className="px-4 py-3 text-emerald-500">{station.trend}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "campaign" && (
            <div className="p-8 text-center">
              <div className="bg-studio-sand/20 rounded-xl p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-3">Create Media Campaign</h3>
                <p className="text-studio-clay mb-5">
                  Plan and coordinate your next media campaign across multiple channels, 
                  including press, radio, TV, and digital platforms.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="glass-card p-3 rounded-lg flex flex-col items-center">
                    <Tv className="h-6 w-6 text-studio-clay mb-2" />
                    <span className="text-sm">Television</span>
                  </div>
                  <div className="glass-card p-3 rounded-lg flex flex-col items-center">
                    <Radio className="h-6 w-6 text-studio-clay mb-2" />
                    <span className="text-sm">Radio</span>
                  </div>
                  <div className="glass-card p-3 rounded-lg flex flex-col items-center">
                    <Mic className="h-6 w-6 text-studio-clay mb-2" />
                    <span className="text-sm">Podcast</span>
                  </div>
                  <div className="glass-card p-3 rounded-lg flex flex-col items-center">
                    <Music className="h-6 w-6 text-studio-clay mb-2" />
                    <span className="text-sm">Digital</span>
                  </div>
                </div>
                
                <Button variant="default" size="lg" className="bg-studio-accent gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Start Planning
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Kit */}
      <div className="mt-8 glass-card p-5 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-[#0EA5E9]/20 p-2 rounded-xl mr-3">
              <CheckCircle2 className="h-5 w-5 text-[#0EA5E9]" />
            </div>
            <h2 className="text-xl font-semibold">Media Kit Assets</h2>
          </div>
          <Button variant="outline" size="sm">Manage Assets</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="font-medium mb-2">Press Release</h3>
            <p className="text-sm text-studio-clay mb-3">Official press release for the new album launch (PDF, 2MB)</p>
            <Button variant="outline" size="sm" className="w-full">Download</Button>
          </div>
          
          <div className="glass-card p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="font-medium mb-2">Artist Photos</h3>
            <p className="text-sm text-studio-clay mb-3">High-resolution press photos and promotional images (ZIP, 24MB)</p>
            <Button variant="outline" size="sm" className="w-full">Download</Button>
          </div>
          
          <div className="glass-card p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="font-medium mb-2">EPK (Electronic Press Kit)</h3>
            <p className="text-sm text-studio-clay mb-3">Complete electronic press kit with bio, photos, and music (ZIP, 48MB)</p>
            <Button variant="outline" size="sm" className="w-full">Download</Button>
          </div>
        </div>
      </div>
    </DistributionLayout>
  );
};

export default MediaChannels;
