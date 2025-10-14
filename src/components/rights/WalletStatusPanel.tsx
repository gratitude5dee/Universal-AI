import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, AlertTriangle, ExternalLink, TrendingUp, Droplet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useNetwork } from "@/context/NetworkContext";
import { Button } from "@/components/ui/button";

export const WalletStatusPanel = () => {
  const { address, balance } = useWallet();
  const { currentNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  // Mock IP balance (in production, fetch from blockchain)
  const ipBalance = 2.5;
  const hasLowBalance = ipBalance < 0.1;
  const stakingStatus = { active: true, amount: 100 };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!address) {
    return (
      <Button variant="outline" size="sm" className="border-white/20">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
          hasLowBalance 
            ? 'border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20' 
            : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}
      >
        <Wallet className={`w-4 h-4 ${hasLowBalance ? 'text-yellow-400' : 'text-white/70'}`} />
        <div className="flex flex-col items-start">
          <span className="text-xs text-white/50">Wallet</span>
          <span className="text-sm font-medium text-white font-mono">{formatAddress(address)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/50">IP Balance</span>
          <span className={`text-sm font-medium ${hasLowBalance ? 'text-yellow-400' : 'text-white'}`}>
            {ipBalance.toFixed(2)} IP
          </span>
        </div>
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
              {/* Low Balance Warning */}
              {hasLowBalance && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300 mb-1">Insufficient IP for gas</p>
                      <p className="text-xs text-yellow-200/70">
                        You need IP to perform transactions. Current balance: {ipBalance.toFixed(2)} IP
                      </p>
                    </div>
                  </div>
                  {currentNetwork.type === 'testnet' && currentNetwork.faucetUrl && (
                    <a
                      href={currentNetwork.faucetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-3 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300 font-medium">Get 10 IP (Faucet)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    </a>
                  )}
                  {currentNetwork.type === 'mainnet' && (
                    <button className="flex items-center justify-center gap-2 mt-3 w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300 font-medium">Top up wallet</span>
                    </button>
                  )}
                </div>
              )}

              {/* Wallet Info */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-white/50">Address</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-mono text-white">{address}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-white/50">IP Balance</span>
                    <p className="text-lg font-medium text-white mt-1">{ipBalance.toFixed(2)} IP</p>
                  </div>
                  <div>
                    <span className="text-xs text-white/50">Network</span>
                    <p className="text-sm text-white mt-1">{currentNetwork.name}</p>
                  </div>
                </div>

                {stakingStatus.active && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-green-300">Staking Active</span>
                    </div>
                    <p className="text-xs text-white/70">
                      {stakingStatus.amount} IP staked
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                <a
                  href={`${currentNetwork.explorerUrl}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">View Transactions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
