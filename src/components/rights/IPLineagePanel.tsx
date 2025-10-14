import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Eye, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IPNode {
  id: string;
  name: string;
  type: "parent" | "ancestor" | "current";
}

const mockNodes: IPNode[] = [
  { id: "1", name: "Original Genesis", type: "ancestor" },
  { id: "2", name: "Foundation Layer", type: "parent" },
  { id: "3", name: "The Universal Dream", type: "current" },
];

export const IPLineagePanel = () => {
  const [simulationPrice, setSimulationPrice] = useState("");
  const [showLineageDrawer, setShowLineageDrawer] = useState(false);
  const [showRoyaltyModal, setShowRoyaltyModal] = useState(false);

  const royaltyPolicy = {
    type: "LRP",
    description: "Liquid Revenue Protocol",
  };

  const calculateSplits = (price: number) => {
    return {
      creator: price * 0.7,
      collaboratorA: price * 0.15,
      collaboratorB: price * 0.15,
    };
  };

  const splits = simulationPrice ? calculateSplits(parseFloat(simulationPrice)) : null;

  return (
    <div className="glass-card border border-white/10 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          IP Lineage & Royalty
        </h3>
      </div>

      {/* Mini Graph */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-4 py-6 relative">
          {/* Ancestor */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-purple-500/40" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Ancestor
              </span>
            </div>
          </motion.div>

          {/* Connection Line */}
          <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30" />

          {/* Parent */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-blue-500/40" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                Parent
              </span>
            </div>
          </motion.div>

          {/* Connection Line */}
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500/30 to-primary/30" />

          {/* Current */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(155,135,245,0.3)]">
              <div className="w-8 h-8 rounded-full bg-primary/60" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                Current
              </span>
            </div>
          </motion.div>
        </div>

        <button
          onClick={() => setShowLineageDrawer(true)}
          className="text-sm text-primary hover:text-primary/80 transition-colors mx-auto block mt-8"
        >
          View Full Lineage →
        </button>
      </div>

      {/* Royalty Policy Summary */}
      <div className="border-t border-white/10 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 mb-1">Royalty Policy</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                {royaltyPolicy.type}
              </span>
              <span className="text-sm text-white/70">{royaltyPolicy.description}</span>
            </div>
          </div>
          <button
            onClick={() => setShowRoyaltyModal(true)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRoyaltyModal(true)}
          className="w-full border-white/10"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Royalty Stack
        </Button>

        {/* Simulation */}
        <div>
          <label className="text-xs text-white/50 mb-2 block">Simulate License Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <Input
              type="number"
              placeholder="100"
              value={simulationPrice}
              onChange={(e) => setSimulationPrice(e.target.value)}
              className="pl-7 bg-white/5 border-white/10"
            />
          </div>

          {splits && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 space-y-2 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Creator (70%)</span>
                <span className="text-white font-medium">${splits.creator.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Collaborator A (15%)</span>
                <span className="text-white font-medium">${splits.collaboratorA.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Collaborator B (15%)</span>
                <span className="text-white font-medium">${splits.collaboratorB.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
