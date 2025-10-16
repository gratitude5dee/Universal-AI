import { Card } from "@/components/ui/card";

export const SocialTokens = () => {
  const platforms = [
    { name: "Lens Protocol", icon: "🌿", description: "Posts as NFTs on Polygon", color: "from-[#00501E]/20 to-[#00501E]/10" },
    { name: "Farcaster", icon: "🎭", description: "Frames & Casts on Base", color: "from-[#855DCD]/20 to-[#855DCD]/10" },
    { name: "Mirror", icon: "✍️", description: "Essays as Editions on Optimism", color: "from-[#000000]/20 to-[#000000]/10" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white text-shadow-sm">Social Token Launcher</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform, idx) => (
          <Card key={idx} className={`backdrop-blur-md bg-gradient-to-br ${platform.color} border border-white/20 p-6 cursor-pointer hover:scale-105 transition-transform`}>
            <div className="text-center space-y-3">
              <div className="text-5xl">{platform.icon}</div>
              <h4 className="font-semibold text-white text-shadow-sm">{platform.name}</h4>
              <p className="text-sm text-white/70 text-shadow-sm">{platform.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
