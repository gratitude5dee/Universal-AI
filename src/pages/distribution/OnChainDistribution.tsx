
import React, { useState } from "react";
import { 
  Link, ArrowUpDown, Coins, ArrowRight, Settings, 
  BarChart, Calendar, Plus, Users, Rocket, Music, Headphones, Ticket
} from "lucide-react";
import DistributionLayout from "@/layouts/distribution-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PlatformSelector from "@/components/launchpad/PlatformSelector";
import UnifiedLaunchForm from "@/components/launchpad/UnifiedLaunchForm";
import { AudioPlayer } from "@/components/distribution/music/AudioPlayer";
import { MusicNFTMinter } from "@/components/distribution/music/MusicNFTMinter";
import { ArtistDashboard } from "@/components/distribution/music/ArtistDashboard";
import { TokenGatedContent } from "@/components/distribution/music/TokenGatedContent";
import { Web3TicketingInterface } from "@/components/distribution/music/Web3TicketingInterface";
import { motion } from "framer-motion";

const OnChainDistribution = () => {
  const [activeTab, setActiveTab] = useState("music-distribution");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [launchpadTab, setLaunchpadTab] = useState("platforms");

  // Mock data for token balances
  const tokenBalances = [
    { token: "WZRD", balance: 12500, chain: "Ethereum" },
    { token: "MAGIC", balance: 8750, chain: "Arbitrum" },
    { token: "GEM", balance: 5300, chain: "Optimism" },
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
    },
    {
      id: 2,
      name: "Liquidity Mining Rewards",
      token: "MAGIC",
      amount: 3000,
      recipients: 150,
      status: "Completed",
      startDate: "2023-10-20",
    },
    {
      id: 3,
      name: "Staking Rewards",
      token: "GEM",
      amount: 2000,
      recipients: 100,
      status: "Scheduled",
      startDate: "2023-11-01",
    },
  ];

  return (
    <DistributionLayout
      title="On-Chain Distribution"
      subtitle="Manage music distribution, NFT minting, and token distributions on the blockchain"
    >
      {/* Main Distribution Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-4xl mb-6">
          <TabsTrigger value="music-distribution" className="gap-2">
            <Music className="h-4 w-4" />
            Music Distribution
          </TabsTrigger>
          <TabsTrigger value="nft-minting" className="gap-2">
            <Coins className="h-4 w-4" />
            NFT Minting
          </TabsTrigger>
          <TabsTrigger value="token-distribution">Token Distribution</TabsTrigger>
          <TabsTrigger value="launchpad" className="gap-2">
            <Rocket className="h-4 w-4" />
            Social Token Launchpad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music-distribution">
          <div className="space-y-6">
            {/* Artist Dashboard */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Headphones className="w-6 h-6 mr-3 text-studio-accent" />
                <div>
                  <h3 className="text-xl font-semibold">Web3 Music Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your music distribution across blockchain platforms
                  </p>
                </div>
              </div>
              <ArtistDashboard />
            </div>

            {/* Audio Player Demo */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Featured Track</h3>
              <AudioPlayer 
                trackUrl="/placeholder-audio.mp3"
                title="Midnight Frequencies"
                artist="Digital Symphony"
                coverArt="/placeholder.svg"
              />
            </div>

            {/* Token Gated Content */}
            <TokenGatedContent />

            {/* Web3 Ticketing */}
            <Web3TicketingInterface />
          </div>
        </TabsContent>

        <TabsContent value="nft-minting">
          <div className="space-y-6">
            <MusicNFTMinter />
            
            {/* NFT Collection Overview */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your NFT Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-4 rounded-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-studio-accent to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-medium text-white">Collection #{i}</h4>
                    <p className="text-sm text-white/70">12 items • 0.5 ETH floor</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="token-distribution">
          {/* Token Balances Overview */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Coins className="w-5 h-5 mr-2 text-studio-accent" />
              Token Balances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tokenBalances.map((token, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-xl p-4 border border-studio-sand/30"
                >
                  <h3 className="font-medium">{token.token}</h3>
                  <p className="text-2xl font-semibold">{token.balance}</p>
                  <p className="text-sm text-muted-foreground">
                    {token.chain}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Campaigns */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <ArrowUpDown className="w-5 h-5 mr-2 text-studio-accent" />
                Distribution Campaigns
              </h2>
              <Button variant="default" size="sm" className="bg-studio-accent gap-1">
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
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Rocket className="w-6 h-6 mr-3 text-studio-accent" />
              <div>
                <h3 className="text-xl font-semibold">Social Token Launchpad</h3>
                <p className="text-sm text-muted-foreground">
                  Create and deploy social tokens across multiple Web3 platforms
                </p>
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
      </Tabs>
    </DistributionLayout>
  );
};

export default OnChainDistribution;
