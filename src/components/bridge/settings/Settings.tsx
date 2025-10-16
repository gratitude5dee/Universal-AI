import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletManagement } from "./WalletManagement";
import { PlatformConnections } from "./PlatformConnections";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white text-shadow-sm mb-2">Settings</h2>
        <p className="text-white/70 text-shadow-sm">Manage your wallets and platform connections</p>
      </div>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <TabsTrigger value="wallets" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            Wallet Management
          </TabsTrigger>
          <TabsTrigger value="platforms" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            Platform Connections
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wallets" className="pt-6">
          <WalletManagement />
        </TabsContent>
        <TabsContent value="platforms" className="pt-6">
          <PlatformConnections />
        </TabsContent>
      </Tabs>
    </div>
  );
};
