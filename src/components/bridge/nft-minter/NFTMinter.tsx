import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "../shared/StatCard";
import { Sparkles, Image, Layers, MessageSquare, TrendingUp, Grid3x3 } from "lucide-react";
import { MintingWizard } from "./MintingWizard";
import { NFTGallery } from "./NFTGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export const NFTMinter = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [mintType, setMintType] = useState<"single" | "collection" | "social">("single");

  const handleStartMinting = (type: "single" | "collection" | "social") => {
    setMintType(type);
    setShowWizard(true);
  };

  if (showWizard) {
    return <MintingWizard type={mintType} onClose={() => setShowWizard(false)} />;
  }

  return (
    <Tabs defaultValue="dashboard" className="w-full space-y-6">
      <TabsList className="grid grid-cols-2 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
          🎨 Dashboard
        </TabsTrigger>
        <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
          🖼️ Gallery
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Image} label="Total Mints" value="1,247" trend={12} trendLabel="vs last month" />
          <StatCard icon={TrendingUp} label="Revenue" value="$45.2K" trend={23} trendLabel="vs last month" iconColor="bg-[#F97316]/20" />
          <StatCard icon={Layers} label="Unique Owners" value="892" trend={8} trendLabel="vs last month" iconColor="bg-[#0EA5E9]/20" />
          <StatCard icon={Sparkles} label="Avg Rating" value="4.8/5.0" trend={0.2} trendLabel="vs last month" iconColor="bg-[#10B981]/20" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleStartMinting("single")}
              className="w-full h-24 backdrop-blur-md bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20 border border-white/20 hover:border-[#9b87f5] text-white shadow-card-glow"
            >
              <div className="flex flex-col items-center gap-2">
                <Image className="w-6 h-6" />
                <span className="font-semibold">New Single NFT</span>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleStartMinting("collection")}
              className="w-full h-24 backdrop-blur-md bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/20 border border-white/20 hover:border-[#F97316] text-white shadow-card-glow"
            >
              <div className="flex flex-col items-center gap-2">
                <Layers className="w-6 h-6" />
                <span className="font-semibold">New Collection</span>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleStartMinting("social")}
              className="w-full h-24 backdrop-blur-md bg-gradient-to-br from-[#0EA5E9]/20 to-[#0284C7]/20 border border-white/20 hover:border-[#0EA5E9] text-white shadow-card-glow"
            >
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span className="font-semibold">Social Post NFT</span>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Recent Deployments */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
          <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Recent Deployments</h3>
          <div className="space-y-3">
            {["Sunset Dreams v2", "Abstract Waves Collection", "Digital Portrait #42"].map((name, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]" />
                  <div>
                    <p className="font-medium text-white text-shadow-sm">{name}</p>
                    <p className="text-sm text-white/60 text-shadow-sm">{3 - idx} platforms • {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-sm border border-[#10B981]/30">Live</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="gallery">
        <NFTGallery />
      </TabsContent>
    </Tabs>
  );
};
