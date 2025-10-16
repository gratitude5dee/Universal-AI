import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export const PlatformConnections = () => {
  const connectedPlatforms = [
    { name: "OpenSea", icon: "🌊", status: "Connected", lastUsed: "2 hours ago" },
    { name: "Zora", icon: "⚡", status: "Connected", lastUsed: "1 day ago" },
    { name: "Magic Eden", icon: "✨", status: "Connected", lastUsed: "3 days ago" },
    { name: "Lens Protocol", icon: "🌿", status: "Connected", lastUsed: "5 hours ago" }
  ];

  const availablePlatforms = [
    { name: "Rarible", icon: "🎨" },
    { name: "Foundation", icon: "🏛️" },
    { name: "SuperRare", icon: "💎" }
  ];

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Connected Platforms</h3>
        <div className="space-y-3">
          {connectedPlatforms.map((platform, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#9b87f5]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <p className="font-medium text-white text-shadow-sm">{platform.name}</p>
                  <p className="text-sm text-white/60">Last used: {platform.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981]" />
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  Disconnect
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Available Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availablePlatforms.map((platform, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-white text-shadow-sm">{platform.name}</span>
              </div>
              <Button size="sm" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
