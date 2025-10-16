import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Sparkles, Link2, BarChart3, Settings as SettingsIcon, Bot } from "lucide-react";
import { StatCard } from "@/components/bridge/shared/StatCard";
import { NFTMinter } from "@/components/bridge/nft-minter/NFTMinter";
import { SocialTokens } from "@/components/bridge/social-tokens/SocialTokens";
import { DistributionAnalytics } from "@/components/bridge/analytics/DistributionAnalytics";
import { Settings } from "@/components/bridge/settings/Settings";
import { AIAssistant } from "@/components/bridge/ai-assistant/AIAssistant";
import { MagicPortal } from "@/components/bridge/MagicPortal";

const Bridge = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white text-shadow-sm">Bridge: On-Chain Distribution Hub</h1>
          <p className="text-white/80 text-shadow-sm">Deploy NFTs, tokenize content, and distribute across 15+ platforms and chains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Rocket} label="Total Deployments" value="1,247" trend={12} trendLabel="vs last month" />
          <StatCard icon={Sparkles} label="Revenue Generated" value="$45.2K" trend={23} trendLabel="vs last month" iconColor="bg-[#F97316]/20" />
          <StatCard icon={Link2} label="Active Platforms" value="9" trendLabel="connected" iconColor="bg-[#0EA5E9]/20" />
          <StatCard icon={BarChart3} label="Success Rate" value="98.5%" trend={2} trendLabel="vs last month" iconColor="bg-[#10B981]/20" />
        </div>

        <Tabs defaultValue="nft-minter" className="w-full">
          <TabsList className="grid grid-cols-6 w-full backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <TabsTrigger value="nft-minter" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">🎨 NFT Minter</TabsTrigger>
            <TabsTrigger value="social" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">🌐 Social Tokens</TabsTrigger>
            <TabsTrigger value="bridges" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">⛓️ Bridges</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">📊 Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">⚙️ Settings</TabsTrigger>
            <TabsTrigger value="ai" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">🤖 AI Assistant</TabsTrigger>
          </TabsList>
          <TabsContent value="nft-minter" className="pt-6">
            <NFTMinter />
          </TabsContent>
          <TabsContent value="social" className="pt-6">
            <SocialTokens />
          </TabsContent>
          <TabsContent value="bridges" className="pt-6">
            <MagicPortal />
          </TabsContent>
          <TabsContent value="analytics" className="pt-6">
            <DistributionAnalytics />
          </TabsContent>
          <TabsContent value="settings" className="pt-6">
            <Settings />
          </TabsContent>
          <TabsContent value="ai" className="pt-6">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Bridge;
