import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlatformId } from "@/types/bridge";
import { platforms } from "@/data/bridge/platforms";
import confetti from "canvas-confetti";
import { toExplorerTxUrl } from "@/lib/web3/chains";

interface DeploymentProgressProps {
  platforms: PlatformId[];
  onComplete: () => void;
  mintTxHash?: string | null;
  chainId?: number | null;
}

export const DeploymentProgress = ({ platforms: selectedPlatforms, onComplete, mintTxHash, chainId }: DeploymentProgressProps) => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, "pending" | "deploying" | "complete" | "failed">>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Initialize all platforms as pending
    const initialStatuses: Record<string, "pending"> = {};
    selectedPlatforms.forEach(p => initialStatuses[p] = "pending");
    setStatuses(initialStatuses as any);

    // Simulate deployment process
    selectedPlatforms.forEach((platformId, index) => {
      setTimeout(() => {
        setStatuses(prev => ({ ...prev, [platformId]: "deploying" }));
        
        // Simulate progress
        const interval = setInterval(() => {
          setProgress(prev => {
            const current = prev[platformId] || 0;
            if (current >= 100) {
              clearInterval(interval);
              setStatuses(prevStatus => ({ ...prevStatus, [platformId]: "complete" }));
              return prev;
            }
            return { ...prev, [platformId]: current + 10 };
          });
        }, 200);
      }, index * 1000);
    });

    // Check for completion
    const checkInterval = setInterval(() => {
      const allComplete = selectedPlatforms.every(p => statuses[p] === "complete");
      if (allComplete && selectedPlatforms.length > 0) {
        clearInterval(checkInterval);
        setTimeout(() => {
          setShowSuccess(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  const overallProgress = selectedPlatforms.length > 0
    ? (Object.values(progress).reduce((sum, p) => sum + p, 0) / selectedPlatforms.length)
    : 0;

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl"
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center mx-auto"
          >
            <Check className="w-10 h-10 text-[#10B981]" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold text-white text-shadow-sm mb-2">✨ Deployment Successful! ✨</h2>
            <p className="text-white/70 text-shadow-sm">Your NFT is now live across {selectedPlatforms.length} platforms</p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-white text-shadow-sm mb-3">Live Links</h3>
            {mintTxHash && (
              <div className="p-2 rounded bg-white/5 text-sm text-white/70">
                On-chain mint tx:{" "}
                <a
                  className="text-[#9b87f5] hover:text-[#7E69AB] font-mono"
                  href={chainId ? (toExplorerTxUrl(chainId, mintTxHash) ?? "#") : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {mintTxHash.slice(0, 10)}…{mintTxHash.slice(-8)}
                </a>
              </div>
            )}
            {selectedPlatforms.map(platformId => {
              const platform = platforms.find(p => p.id === platformId);
              return (
                <div key={platformId} className="flex items-center justify-between p-2 rounded bg-white/5">
                  <span className="text-white/80">{platform?.icon} {platform?.name}</span>
                  <Button variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#7E69AB]">
                    View →
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={onComplete} className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
              Create Another NFT
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View Analytics
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 max-w-3xl mx-auto shadow-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white text-shadow-sm mb-2">Deploying Your NFT</h2>
          <p className="text-white/70 text-shadow-sm">Please keep this window open...</p>
        </div>

        {mintTxHash && (
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4 text-sm text-white/70">
            Mint submitted:{" "}
            <span className="font-mono">
              {mintTxHash.slice(0, 10)}…{mintTxHash.slice(-8)}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {selectedPlatforms.map(platformId => {
            const platform = platforms.find(p => p.id === platformId);
            const status = statuses[platformId] || "pending";
            const platformProgress = progress[platformId] || 0;

            return (
              <div key={platformId} className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform?.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-shadow-sm">{platform?.name}</p>
                      <p className="text-sm text-white/60 text-shadow-sm capitalize">{status.replace("-", " ")}</p>
                    </div>
                  </div>
                  {status === "complete" && <Check className="w-6 h-6 text-[#10B981]" />}
                  {status === "deploying" && <Loader2 className="w-6 h-6 text-[#9b87f5] animate-spin" />}
                  {status === "failed" && <AlertCircle className="w-6 h-6 text-[#EF4444]" />}
                </div>
                
                <Progress value={platformProgress} className="h-2" />
                
                <div className="mt-2 text-xs text-white/50 space-y-1">
                  {platformProgress > 0 && platformProgress < 30 && <p>✓ Wallet connected</p>}
                  {platformProgress >= 30 && platformProgress < 60 && <p>✓ Contract deployed</p>}
                  {platformProgress >= 60 && platformProgress < 90 && <p>✓ Metadata uploaded</p>}
                  {platformProgress >= 90 && <p>✓ NFT minted</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4">
          <div className="flex justify-between text-white text-shadow-sm mb-2">
            <span>Overall Progress:</span>
            <span className="font-bold">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      </div>
    </div>
  );
};
