import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoyaltyStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType?: "LRP" | "LAP" | "Custom";
}

export const RoyaltyStackModal = ({ 
  isOpen, 
  onClose, 
  policyType = "LRP" 
}: RoyaltyStackModalProps) => {
  const [simulationPrice, setSimulationPrice] = useState("100");

  const calculateSplits = (price: number) => {
    return {
      creator: price * 0.70,
      collaboratorA: price * 0.15,
      collaboratorB: price * 0.15,
      parentIP: price * 0.05, // Upstream royalty
    };
  };

  const splits = simulationPrice ? calculateSplits(parseFloat(simulationPrice)) : null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Royalty Stack</h2>
                <p className="text-sm text-white/70 mt-1">
                  Policy: <span className="text-primary font-medium">{policyType}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Policy Explanation */}
            <div className="glass-card border border-white/10 rounded-xl p-4 bg-primary/5">
              <h3 className="text-sm font-medium text-white mb-2">How {policyType} Works</h3>
              <p className="text-sm text-white/70">
                {policyType === "LRP" && "Liquid Revenue Protocol automatically splits revenue based on predefined percentages. Payments flow through the stack from primary sales to all stakeholders."}
                {policyType === "LAP" && "Liquid Attribution Protocol tracks creative contributions and distributes revenue proportionally to verified attribution."}
                {policyType === "Custom" && "Custom terms define specific conditions for revenue distribution based on your agreement."}
              </p>
            </div>

            {/* Stack Visualization */}
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Revenue Flow</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">Creator</span>
                      <span className="text-sm font-bold text-primary">70%</span>
                    </div>
                    <p className="text-xs text-white/50">Primary rights holder</p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-white/30" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">Collaborator A</span>
                      <span className="text-sm font-bold text-blue-400">15%</span>
                    </div>
                    <p className="text-xs text-white/50">Visual enhancements</p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-white/30" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gradient-to-r from-orange-500/20 to-orange-500/5 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">Collaborator B</span>
                      <span className="text-sm font-bold text-orange-400">15%</span>
                    </div>
                    <p className="text-xs text-white/50">Narrative support</p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-white/30" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">Parent IP (Upstream)</span>
                      <span className="text-sm font-bold text-purple-400">5%</span>
                    </div>
                    <p className="text-xs text-white/50">Original IP royalty</p>
                  </div>
                  <div className="w-5" />
                </div>
              </div>
            </div>

            {/* Simulation */}
            <div className="glass-card border border-white/10 rounded-xl p-4">
              <div className="mb-4">
                <Label className="text-sm font-medium text-white">Simulate License Price</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    type="number"
                    value={simulationPrice}
                    onChange={(e) => setSimulationPrice(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              {splits && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h4 className="text-xs font-medium text-white/70 mb-2">Distribution Preview</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Creator</span>
                      <span className="text-white font-medium">${splits.creator.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Collaborator A</span>
                      <span className="text-white font-medium">${splits.collaboratorA.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Collaborator B</span>
                      <span className="text-white font-medium">${splits.collaboratorB.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                      <span className="text-white/70">Parent IP</span>
                      <span className="text-purple-400 font-medium">${splits.parentIP.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const breakdown = splits 
                    ? `Royalty Breakdown for $${simulationPrice}:\n- Creator: $${splits.creator.toFixed(2)}\n- Collaborator A: $${splits.collaboratorA.toFixed(2)}\n- Collaborator B: $${splits.collaboratorB.toFixed(2)}\n- Parent IP: $${splits.parentIP.toFixed(2)}`
                    : "No simulation data";
                  navigator.clipboard.writeText(breakdown);
                }}
                className="flex-1 border-white/10"
              >
                Copy Breakdown
              </Button>
              <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/80">
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
