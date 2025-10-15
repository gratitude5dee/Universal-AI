import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Link, ArrowUpDown, Coins, ArrowRight, Settings, 
  BarChart, Calendar, Plus, Users, Rocket, Music, Headphones, 
  Ticket, TrendingUp, Zap, Star, Award, Globe
} from "lucide-react";
import DistributionLayout from "@/layouts/distribution-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PlatformSelector from "@/components/launchpad/PlatformSelector";
import UnifiedLaunchForm from "@/components/launchpad/UnifiedLaunchForm";
import { AudioPlayer } from "@/components/distribution/music/AudioPlayer";
import { MusicNFTMinter } from "@/components/distribution/music/MusicNFTMinter";
import { ArtistDashboard } from "@/components/distribution/music/ArtistDashboard";
import { TokenGatedContent } from "@/components/distribution/music/TokenGatedContent";
import { Web3TicketingInterface } from "@/components/distribution/music/Web3TicketingInterface";
import { motion } from "framer-motion";

const OnChainDistribution = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("music-distribution");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [launchpadTab, setLaunchpadTab] = useState("platforms");

  // Enhanced mock data
  const tokenBalances = [
    { token: "WZRD", balance: 12500, chain: "Ethereum", change: "+12.5%", trending: true },
    { token: "MAGIC", balance: 8750, chain: "Arbitrum", change: "+8.3%", trending: false },
    { token: "GEM", balance: 5300, chain: "Optimism", change: "-2.1%", trending: false },
  ];

  const distributionCampaigns = [
    {
      id: 1,
      name: "Community Airdrop",
      token: "WZRD",
      amount: 5000,
      recipients: 250,
      status: "Active",
      startDate: "2023-10-26",
      completion: 85,
    },
    {
      id: 2,
      name: "Liquidity Mining Rewards",
      token: "MAGIC",
      amount: 3000,
      recipients: 150,
      status: "Completed",
      startDate: "2023-10-20",
      completion: 100,
    },
    {
      id: 3,
      name: "Staking Rewards",
      token: "GEM",
      amount: 2000,
      recipients: 100,
      status: "Scheduled",
      startDate: "2023-11-01",
      completion: 0,
    },
  ];

  return (
    <DistributionLayout
      title="On-Chain Distribution Hub"
      subtitle="Comprehensive music distribution, NFT minting, and token management on Web3"
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
          <div className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium">
            On-Chain Distribution
          </div>
          <div 
            onClick={() => navigate('/distribution/media-channels')}
            className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
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

      {/* Hero Stats Section */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <Badge className="bg-green-500/20 text-green-300">+15%</Badge>
          </div>
          <p className="text-sm text-white/70">Total Revenue</p>
          <p className="text-xl font-bold text-white">$24,580</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between mb-2">
            <Music className="w-5 h-5 text-blue-400" />
            <Badge className="bg-blue-500/20 text-blue-300">Active</Badge>
          </div>
          <p className="text-sm text-white/70">Live Tracks</p>
          <p className="text-xl font-bold text-white">47</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <Badge className="bg-purple-500/20 text-purple-300">Growing</Badge>
          </div>
          <p className="text-sm text-white/70">Community</p>
          <p className="text-xl font-bold text-white">12.4k</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <Badge className="bg-orange-500/20 text-orange-300">Hot</Badge>
          </div>
          <p className="text-sm text-white/70">NFT Sales</p>
          <p className="text-xl font-bold text-white">156</p>
        </div>
      </motion.div>

      {/* Main Distribution Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-5xl mb-8 bg-white/5 border border-white/10 backdrop-blur-md">
          <TabsTrigger 
            value="music-distribution" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-studio-accent data-[state=active]:to-blue-500"
          >
            <Music className="h-4 w-4" />
            Music Hub
          </TabsTrigger>
          <TabsTrigger 
            value="nft-minting" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
          >
            <Coins className="h-4 w-4" />
            NFT Studio
          </TabsTrigger>
          <TabsTrigger 
            value="token-distribution"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500"
          >
            <ArrowUpDown className="h-4 w-4" />
            Token Flow
          </TabsTrigger>
          <TabsTrigger 
            value="launchpad" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500"
          >
            <Rocket className="h-4 w-4" />
            Launchpad
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="music-distribution">
            <div className="space-y-8">
              {/* Enhanced Artist Dashboard */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-studio-accent to-blue-500 flex items-center justify-center mr-4">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Web3 Music Dashboard</h3>
                      <p className="text-white/70">Manage your music distribution across blockchain platforms</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-studio-accent to-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Track
                  </Button>
                </div>
                <ArtistDashboard />
              </div>

              {/* Featured Track with Enhanced Player */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Featured Track</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-red-500/20 text-red-300">
                      <Star className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>
                <AudioPlayer 
                  trackUrl="/placeholder-audio.mp3"
                  title="Midnight Frequencies"
                  artist="Digital Symphony"
                  coverArt="/placeholder.svg"
                />
              </div>

              {/* Grid Layout for Token Gated Content and Ticketing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TokenGatedContent />
                <Web3TicketingInterface />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nft-minting">
            <div className="space-y-8">
              <MusicNFTMinter />
              
              {/* Enhanced NFT Collection Overview */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Your NFT Collections</h3>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-4 h-4 mr-2" />
                    New Collection
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Cosmic Beats", items: 12, floor: "0.5 ETH", volume: "2.3 ETH" },
                    { name: "Digital Dreams", items: 25, floor: "0.8 ETH", volume: "4.1 ETH" },
                    { name: "Synth Symphony", items: 8, floor: "1.2 ETH", volume: "6.7 ETH" }
                  ].map((collection, i) => (
                    <div key={i} className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/5 transition-all">
                      <div className="w-full h-40 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                        <Music className="w-12 h-12 text-white z-10" />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <h4 className="font-semibold text-white text-lg mb-2">{collection.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Items:</span>
                          <span className="text-white">{collection.items}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Floor:</span>
                          <span className="text-green-400 font-medium">{collection.floor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Volume:</span>
                          <span className="text-blue-400 font-medium">{collection.volume}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="token-distribution">
            {/* Enhanced Token Balances Overview */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Coins className="w-6 h-6 mr-3 text-studio-accent" />
                  Token Portfolio
                </h2>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Token
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tokenBalances.map((token, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden"
                  >
                    {token.trending && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500/20 text-red-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-studio-accent to-blue-500 flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{token.token.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{token.token}</h3>
                        <p className="text-white/70 text-sm flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {token.chain}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-white">{token.balance.toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">24h Change</span>
                        <span className={`text-sm font-medium ${
                          token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {token.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Distribution Campaigns */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ArrowUpDown className="w-6 h-6 mr-3 text-studio-accent" />
                  Distribution Campaigns
                </h2>
                <Button className="bg-gradient-to-r from-studio-accent to-blue-500 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </Button>
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="w-full max-w-md mb-6">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  {distributionCampaigns
                    .filter((campaign) => campaign.status === "Active")
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="bg-white/80 rounded-xl p-4 mb-4 border border-studio-sand/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.token} - {campaign.amount} tokens
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {campaign.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Recipients: {campaign.recipients}
                          </p>
                          <Button variant="link" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="completed">
                  {distributionCampaigns
                    .filter((campaign) => campaign.status === "Completed")
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="bg-white/80 rounded-xl p-4 mb-4 border border-studio-sand/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.token} - {campaign.amount} tokens
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {campaign.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Recipients: {campaign.recipients}
                          </p>
                          <Button variant="link" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="scheduled">
                  {distributionCampaigns
                    .filter((campaign) => campaign.status === "Scheduled")
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="bg-white/80 rounded-xl p-4 mb-4 border border-studio-sand/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.token} - {campaign.amount} tokens
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            {campaign.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Recipients: {campaign.recipients}
                          </p>
                          <Button variant="link" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>

              {/* Community Engagement Tools */}
              <div className="glass-card p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2 text-studio-accent" />
                    Community Engagement
                  </h3>
                  <Button variant="default" size="sm" className="bg-studio-accent gap-1">
                    <Plus className="h-4 w-4" />
                    Create Poll
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/80 rounded-xl p-4 border border-studio-sand/30">
                    <h4 className="font-medium mb-2">Token-Gated Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Reward token holders with exclusive content and experiences.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create Token Gate
                    </Button>
                  </div>

                  <div className="bg-white/80 rounded-xl p-4 border border-studio-sand/30">
                    <h4 className="font-medium mb-2">On-Chain Polls</h4>
                    <p className="text-sm text-muted-foreground">
                      Gather community feedback and make decisions transparently.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create New Poll
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="launchpad">
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Social Token Launchpad</h3>
                  <p className="text-white/70 text-lg">Create and deploy social tokens across multiple Web3 platforms</p>
                </div>
              </div>

              <Tabs value={launchpadTab} onValueChange={setLaunchpadTab} className="w-full">
                <TabsList className="bg-white/10 border border-white/20 rounded-lg mb-6">
                  <TabsTrigger 
                    value="platforms" 
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary"
                  >
                    1. Select Platforms
                  </TabsTrigger>
                  <TabsTrigger 
                    value="launch" 
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary"
                    disabled={selectedPlatforms.length === 0}
                  >
                    2. Configure & Launch
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manage" 
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary"
                  >
                    3. Manage Tokens
                  </TabsTrigger>
                </TabsList>

                <motion.div
                  key={launchpadTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="platforms" className="mt-0">
                    <PlatformSelector />
                    {selectedPlatforms.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center"
                      >
                        <Button
                          onClick={() => setLaunchpadTab("launch")}
                          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                        >
                          Continue to Launch →
                        </Button>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="launch" className="mt-0">
                    <UnifiedLaunchForm 
                      selectedPlatforms={selectedPlatforms}
                      onLaunchComplete={() => setLaunchpadTab("manage")}
                    />
                  </TabsContent>

                  <TabsContent value="manage" className="mt-0">
                    <div className="glass-card rounded-xl p-12 border border-white/10 backdrop-blur-md text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h4 className="text-white text-2xl font-bold mb-2">Token Management Dashboard</h4>
                      <p className="text-white/70 mb-6">
                        Your tokens have been successfully launched! Access advanced management features here.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                          View Analytics
                        </Button>
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                          Manage Community
                        </Button>
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                          Create Rewards
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </DistributionLayout>
  );
};

export default OnChainDistribution;
