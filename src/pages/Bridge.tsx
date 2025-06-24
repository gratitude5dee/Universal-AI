import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { MagicPortal } from "@/components/bridge/MagicPortal";
import { AssetJourney } from "@/components/bridge/AssetJourney";
import { GuardianSpirits } from "@/components/bridge/GuardianSpirits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, ArrowRightLeft, Shield } from "lucide-react";

const Bridge = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white text-shadow-sm">Magical Bridge</h1>
          <p className="text-white/80 text-shadow-sm">Connect your digital assets to the physical world with powerful bridging tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-[#9b87f5]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Physical Product Linking</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">Connect NFTs to physical products with secure verification methods</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-[#F97316]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Digital-Physical Twin</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">Create digital twins of physical items or manifest digital assets physically</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 shadow-card-glow hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <h3 className="font-medium text-white text-shadow-sm">Secure Verification</h3>
            </div>
            <p className="text-sm text-white/80 text-shadow-sm">Protect your bridged assets with robust security measures</p>
          </div>
        </div>

        <Tabs defaultValue="portal" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <TabsTrigger value="portal" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Magic Portal</TabsTrigger>
            <TabsTrigger value="journey" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Asset Journey</TabsTrigger>
            <TabsTrigger value="guardians" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">Guardians</TabsTrigger>
          </TabsList>
          <TabsContent value="portal" className="pt-4">
            <MagicPortal />
          </TabsContent>
          <TabsContent value="journey" className="pt-4">
            <AssetJourney />
          </TabsContent>
          <TabsContent value="guardians" className="pt-4">
            <GuardianSpirits />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Bridge;