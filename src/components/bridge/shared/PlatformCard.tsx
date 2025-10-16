import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ChainBadge } from "./ChainBadge";
import { Platform, ChainId } from "@/types/bridge";

interface PlatformCardProps {
  platform: Platform;
  selected: boolean;
  onToggle: () => void;
  primaryChain: ChainId;
}

export const PlatformCard = ({ platform, selected, onToggle, primaryChain }: PlatformCardProps) => {
  const cost = platform.estimatedCost[primaryChain] || 0;
  const time = platform.estimatedTime[primaryChain] || 0;
  const timeFormatted = time >= 60 ? `${Math.floor(time / 60)}m ${time % 60}s` : `${time}s`;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative backdrop-blur-md bg-white/10 border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        selected
          ? "border-[#9b87f5] bg-[#9b87f5]/10 shadow-[0_0_30px_rgba(155,135,245,0.3)]"
          : "border-white/20 hover:border-[#9b87f5]/50 shadow-card-glow"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="text-center space-y-4">
        <div className="text-4xl">{platform.icon}</div>
        <div>
          <h3 className="font-semibold text-white text-shadow-sm mb-1">{platform.name}</h3>
          <p className="text-xs text-white/60 text-shadow-sm">{platform.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {platform.chains.slice(0, 3).map(chain => (
            <ChainBadge key={chain} chain={chain as ChainId} size="sm" />
          ))}
        </div>
        
        <div className="text-xs space-y-1 text-white/70 text-shadow-sm">
          <div>Est. Cost: ${cost.toFixed(2)}</div>
          <div>Time: {timeFormatted}</div>
        </div>
      </div>
    </motion.div>
  );
};
