import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  Share2,
  Globe, 
  Link, 
  Tv, 
  User, 
  Music,
  TrendingUp,
  Users,
  Clock,
  Star,
  CheckCircle,
  BarChart3,
  Zap,
  Target,
  PlayCircle,
  Upload,
  Calendar,
  DollarSign
} from "lucide-react";

// Import existing components
import SocialMediaWzrd from "./distribution/SocialMediaWzrd";
import OnChainDistribution from "./distribution/OnChainDistribution";
import MediaChannels from "./distribution/MediaChannels";
import IndependentChannels from "./distribution/IndependentChannels";
import SyncLicensing from "./distribution/SyncLicensing";

const MarketingDistribution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = ["overview", "social-media", "on-chain", "media-channels", "independent", "sync-licensing"];
    if (tab && validTabs.includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("overview");
      navigate(`${location.pathname}?tab=overview`, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/marketing-distribution?tab=${value}`, { replace: true });
  };

  // Mock distribution data
  const distributionChannels = [
    {
      id: "1",
      name: "Social Media WZRD",
      type: "social",
      status: "active",
      lastActivity: "30 minutes ago",
      reach: "12.5K",
      engagement: "8.2%",
      description: "AI-powered social media content creation and scheduling",
      icon: Globe,
      color: "bg-blue-500",
      posts: 47
    },
    {
      id: "2", 
      name: "On-Chain Distribution",
      type: "blockchain",
      status: "active",
      lastActivity: "2 hours ago",
      reach: "3.2K",
      engagement: "15.7%",
      description: "Decentralized content distribution via blockchain",
      icon: Link,
      color: "bg-purple-500",
      posts: 12
    },
    {
      id: "3",
      name: "Media Channels", 
      type: "traditional",
      status: "active",
      lastActivity: "1 day ago",
      reach: "25.8K",
      engagement: "5.4%",
      description: "Traditional media and streaming platform distribution",
      icon: Tv,
      color: "bg-green-500",
      posts: 89
    },
    {
      id: "4",
      name: "Independent Channels",
      type: "independent", 
      status: "paused",
      lastActivity: "3 days ago",
      reach: "1.9K",
      engagement: "12.1%",
      description: "Direct-to-fan and independent platform distribution",
      icon: User,
      color: "bg-orange-500",
      posts: 23
    }
  ];

  const QuickActions = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleTabChange("social-media")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Create Post</h3>
              <p className="text-blue-lightest/70 text-sm">Social content</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleTabChange("media-channels")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <Upload className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Upload Content</h3>
              <p className="text-blue-lightest/70 text-sm">Media distribution</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleTabChange("sync-licensing")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Music className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Sync License</h3>
              <p className="text-blue-lightest/70 text-sm">Music licensing</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => handleTabChange("on-chain")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <Link className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Mint NFT</h3>
              <p className="text-blue-lightest/70 text-sm">Blockchain content</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Total Reach</h3>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">43.4K</div>
              <div className="text-sm text-green-400">+12% this week</div>
              <div className="text-xs text-blue-lightest/70">Across all channels</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Engagement Rate</h3>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">9.8%</div>
              <div className="text-sm text-green-400">Above average</div>
              <div className="text-xs text-blue-lightest/70">Last 7 days</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Content Published</h3>
              <PlayCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">171</div>
              <div className="text-sm text-green-400">This month</div>
              <div className="text-xs text-blue-lightest/70">All platforms</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Revenue</h3>
              <DollarSign className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">$2,847</div>
              <div className="text-sm text-green-400">+8% growth</div>
              <div className="text-xs text-blue-lightest/70">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MainContent = () => {
    if (currentTab !== "overview") {
      return (
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="social-media" className="outline-none">
            <SocialMediaWzrd />
          </TabsContent>
          
          <TabsContent value="on-chain" className="outline-none">
            <OnChainDistribution />
          </TabsContent>
          
          <TabsContent value="media-channels" className="outline-none">
            <MediaChannels />
          </TabsContent>
          
          <TabsContent value="independent" className="outline-none">
            <IndependentChannels />
          </TabsContent>
          
          <TabsContent value="sync-licensing" className="outline-none">
            <SyncLicensing />
          </TabsContent>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribution Channels */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            <Clock className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold text-white">Distribution Channels</h2>
          </div>
          <div className="space-y-4">
            {distributionChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${channel.color}/20 flex items-center justify-center`}>
                          <channel.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{channel.name}</h3>
                          <p className="text-blue-lightest/70 text-sm">{channel.description}</p>
                          <p className="text-xs text-blue-lightest/50 mt-1">Last activity: {channel.lastActivity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={channel.status === "active" ? "default" : "secondary"}
                          className={channel.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30"}
                        >
                          {channel.status}
                        </Badge>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-blue-lightest/70">Reach: {channel.reach}</p>
                          <p className="text-xs text-blue-lightest/70">Engagement: {channel.engagement}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Strategy */}
        <div>
          <div className="flex items-center mb-6">
            <CheckCircle className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold text-white">Content Strategy</h2>
          </div>
          <div className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Plan Content</h3>
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Schedule and organize your content calendar</p>
                <Button 
                  className="w-full bg-blue-primary hover:bg-blue-primary/80 text-white"
                  onClick={() => handleTabChange("social-media")}
                >
                  Create Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Analyze Performance</h3>
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Track metrics across all channels</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Optimize Reach</h3>
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">AI-powered audience targeting</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Get Insights
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Revenue Streams</h3>
                  <DollarSign className="h-5 w-5 text-orange-400" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Monetize your content effectively</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => handleTabChange("sync-licensing")}
                >
                  Explore Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          </div>
          <p className="text-blue-lightest/70">Ready to amplify your reach and engage your audience</p>
        </div>

        <QuickActions />
        <PerformanceMetrics />
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="overview" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="social-media" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Globe className="h-4 w-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger 
              value="on-chain" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Link className="h-4 w-4 mr-2" />
              On-Chain
            </TabsTrigger>
            <TabsTrigger 
              value="media-channels" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Tv className="h-4 w-4 mr-2" />
              Media Channels
            </TabsTrigger>
            <TabsTrigger 
              value="independent" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <User className="h-4 w-4 mr-2" />
              Independent
            </TabsTrigger>
            <TabsTrigger 
              value="sync-licensing" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Music className="h-4 w-4 mr-2" />
              Sync Licensing
            </TabsTrigger>
          </TabsList>
          
          <MainContent />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MarketingDistribution;