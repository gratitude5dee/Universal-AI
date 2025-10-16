import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Coins, TrendingUp, PieChart, Shield, Settings } from "lucide-react";
import { StablecoinSwap } from "./stablecoin/StablecoinSwap";
import { RWAMarketplace } from "./marketplace/RWAMarketplace";

export const RWAWizardHub = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#1E40AF]/20 border border-white/10">
            <Building2 className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">RWA WZRD</h1>
            <p className="text-white/70">Real World Asset Tokenization & Liquidity Hub</p>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/70 text-sm mb-1">Total Assets Tokenized</p>
          <p className="text-2xl font-bold text-white">$142M</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/70 text-sm mb-1">Active Investors</p>
          <p className="text-2xl font-bold text-white">2,847</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/70 text-sm mb-1">Compliance Rate</p>
          <p className="text-2xl font-bold text-[#059669]">94%</p>
        </div>
      </div>

      <Tabs defaultValue="stablecoin-swap" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-white/5 p-2 rounded-xl">
          <TabsTrigger 
            value="stablecoin-swap" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <Coins className="h-4 w-4" />
            <span className="hidden sm:inline">Stablecoin Swap</span>
          </TabsTrigger>
          <TabsTrigger 
            value="marketplace" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Marketplace</span>
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger 
            value="yield-optimizer" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Yield Optimizer</span>
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stablecoin-swap" className="mt-6">
          <StablecoinSwap />
        </TabsContent>

      <TabsContent value="marketplace" className="mt-6">
        <RWAMarketplace />
      </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <div className="glass-card p-8 rounded-xl text-center">
            <PieChart className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">My RWA Portfolio</h2>
            <p className="text-white/70 mb-4">
              Track your RWA holdings, view distributions, monitor performance, and manage governance rights.
              Real-time valuation and yield tracking across all your tokenized assets.
            </p>
            <div className="text-sm text-white/50">
              Coming in Phase 4: Week 5
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yield-optimizer" className="mt-6">
          <div className="glass-card p-8 rounded-xl text-center">
            <TrendingUp className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Yield Optimizer</h2>
            <p className="text-white/70 mb-4">
              Maximize returns on your stablecoins and RWA tokens with AI-powered yield optimization 
              across 50+ DeFi protocols. Auto-pilot mode available.
            </p>
            <div className="text-sm text-white/50">
              Coming in Phase 5: Week 6
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="glass-card p-8 rounded-xl text-center">
            <Shield className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Compliance Hub</h2>
            <p className="text-white/70 mb-4">
              Manage KYC/AML verification, tax reporting, regulatory filings, and investor communications.
              Complete compliance management in one unified dashboard.
            </p>
            <div className="text-sm text-white/50">
              Coming in Phase 6: Week 7
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="glass-card p-8 rounded-xl text-center">
            <Settings className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Platform Settings</h2>
            <p className="text-white/70 mb-4">
              Configure your preferences, manage connected wallets, set notification preferences, 
              and customize your RWA WZRD experience.
            </p>
            <div className="text-sm text-white/50">
              Coming Soon
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
