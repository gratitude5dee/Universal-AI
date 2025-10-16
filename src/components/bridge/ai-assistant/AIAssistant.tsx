import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

export const AIAssistant = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-md bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20 border border-[#9b87f5]/30 rounded-xl p-8 shadow-card-glow">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-[#9b87f5]" />
          <div>
            <h2 className="text-2xl font-bold text-white text-shadow-sm">AI Distribution Assistant</h2>
            <p className="text-white/70 text-shadow-sm">Your intelligent helper for on-chain distribution</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/90 text-shadow-sm">👋 Hi! I can help you mint NFTs, recommend platforms, optimize pricing, and more. What would you like to do?</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about NFT distribution..."
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {["Help me mint an NFT", "Optimize my pricing", "Recommend platforms", "Analyze performance"].map((prompt, idx) => (
            <Button key={idx} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
