import React, { useState } from "react";
import DistributionLayout from "@/layouts/distribution-layout";
import PlatformSelector from "@/components/launchpad/PlatformSelector";
import UnifiedLaunchForm from "@/components/launchpad/UnifiedLaunchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const SocialTokens = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("platforms");

  const handlePlatformSelection = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
    if (platforms.length > 0) {
      setActiveTab("launch");
    }
  };

  return (
    <DistributionLayout
      title="Social Token Launchpad"
      subtitle="Create and deploy social tokens across multiple Web3 platforms"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          key={activeTab}
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
                <button
                  onClick={() => setActiveTab("launch")}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all"
                >
                  Continue to Launch →
                </button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="launch" className="mt-0">
            <UnifiedLaunchForm 
              selectedPlatforms={selectedPlatforms}
              onLaunchComplete={() => setActiveTab("manage")}
            />
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <div className="glass-card rounded-xl p-12 border border-white/10 backdrop-blur-md text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-white text-2xl font-bold mb-2">Token Management Dashboard</h3>
              <p className="text-white/70 mb-6">
                Your tokens have been successfully launched! Access advanced management features here.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all">
                  View Analytics
                </button>
                <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all">
                  Manage Community
                </button>
                <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all">
                  Create Rewards
                </button>
              </div>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </DistributionLayout>
  );
};

export default SocialTokens;