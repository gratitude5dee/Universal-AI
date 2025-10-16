import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LensIntegration } from "./LensIntegration";
import { FarcasterIntegration } from "./FarcasterIntegration";
import { MirrorIntegration } from "./MirrorIntegration";

export const SocialTokens = () => {
  const platforms = [
    { 
      id: "lens",
      name: "Lens Protocol", 
      icon: "🌿", 
      description: "Posts as NFTs on Polygon", 
      color: "from-[#00501E]/20 to-[#ABFE2C]/20",
      borderColor: "border-[#ABFE2C]/30"
    },
    { 
      id: "farcaster",
      name: "Farcaster", 
      icon: "🎭", 
      description: "Frames & Casts on Base", 
      color: "from-[#855DCD]/20 to-[#C28FEF]/20",
      borderColor: "border-[#855DCD]/30"
    },
    { 
      id: "mirror",
      name: "Mirror", 
      icon: "✍️", 
      description: "Essays as Editions on Optimism", 
      color: "from-black/20 to-gray-700/20",
      borderColor: "border-gray-500/30"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white text-shadow-sm mb-2">Social Token Launcher</h2>
        <p className="text-white/70 text-shadow-sm">Tokenize your content on decentralized social networks</p>
      </div>

      <Tabs defaultValue="lens" className="w-full">
        <TabsList className="grid grid-cols-3 w-full backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          {platforms.map(platform => (
            <TabsTrigger 
              key={platform.id}
              value={platform.id} 
              className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
            >
              {platform.icon} {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="lens" className="pt-6">
          <LensIntegration />
        </TabsContent>
        
        <TabsContent value="farcaster" className="pt-6">
          <FarcasterIntegration />
        </TabsContent>
        
        <TabsContent value="mirror" className="pt-6">
          <MirrorIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
