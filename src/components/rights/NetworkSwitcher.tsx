import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Activity, Droplet } from "lucide-react";
import { useNetwork, ChainId } from "@/context/NetworkContext";
import { Button } from "@/components/ui/button";
import { useEvmWallet } from "@/context/EvmWalletContext";

export const NetworkSwitcher = () => {
  const { currentNetwork, rpcStatus, switchNetwork } = useNetwork();
  const { switchChain } = useEvmWallet();
  const [isOpen, setIsOpen] = useState(false);

  const networks: { chainId: ChainId; label: string }[] = [
    { chainId: 1514, label: "Story Mainnet" },
    { chainId: 1315, label: "Aeneid Testnet" },
  ];

  const getHealthColor = () => {
    if (!rpcStatus.isHealthy) return "bg-red-500";
    if (rpcStatus.latency > 500) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatBlockHeight = (height: number) => {
    return height.toLocaleString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getHealthColor()} animate-pulse`} />
          <span className="text-sm font-medium text-white">{currentNetwork.name}</span>
          <span className="text-xs text-white/50">#{currentNetwork.chainId}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-80 glass-card border border-white/10 rounded-xl p-4 z-50 shadow-2xl"
            >
              {/* Network Selector */}
              <div className="space-y-2 mb-4">
                {networks.map((network) => (
                  <button
                    key={network.chainId}
                    onClick={() => {
                      switchNetwork(network.chainId);
                      // Best-effort: align the connected EVM wallet to the selected Story network.
                      switchChain(network.chainId).catch(() => {});
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
                      currentNetwork.chainId === network.chainId
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-white/5 text-white/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{network.label}</span>
                      {currentNetwork.chainId === network.chainId && (
                        <div className={`w-2 h-2 rounded-full ${getHealthColor()}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* RPC Status */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">RPC Status</span>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-white/50" />
                    <span className={rpcStatus.isHealthy ? 'text-green-500' : 'text-red-500'}>
                      {rpcStatus.isHealthy ? 'Healthy' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Latest Block</span>
                  <span className="text-white font-mono">
                    {formatBlockHeight(rpcStatus.blockHeight)}
                  </span>
                </div>

                {rpcStatus.latency > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Latency</span>
                    <span className="text-white">{rpcStatus.latency}ms</span>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                <a
                  href={currentNetwork.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">BlockScout Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white" />
                </a>

                <a
                  href={currentNetwork.ipExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">IP Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white" />
                </a>

                {currentNetwork.type === 'testnet' && currentNetwork.faucetUrl && (
                  <a
                    href={currentNetwork.faucetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300 font-medium">Get 10 IP (Faucet)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
