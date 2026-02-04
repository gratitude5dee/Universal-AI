import { Button } from "@/components/ui/button";
import { ExternalLink, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";

export const WalletManagement = () => {
  const { address, nativeBalance, chainMeta } = useEvmWallet();

  const wallets = [
    {
      type: "Ethereum / EVM Chains",
      address: address || "Not connected",
      provider: "thirdweb",
      primary: true,
      balance: nativeBalance && chainMeta ? `${nativeBalance.formatted} ${chainMeta.nativeSymbol}` : "—",
      explorer: chainMeta?.explorerBaseUrl ?? "https://etherscan.io"
    },
    {
      type: "Solana",
      address: "7xKB...9mVq",
      provider: "Phantom",
      primary: true,
      balance: "145.8 SOL ($18,225)",
      explorer: "https://solscan.io"
    },
    {
      type: "Crossmint Custodial",
      address: "you@email.com",
      provider: "Multi-chain",
      primary: false,
      balance: "0.5 ETH, 12 SOL, 450 MATIC",
      explorer: null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Connected Wallets</h3>
        
        <div className="space-y-4">
          {wallets.map((wallet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-5 hover:border-[#9b87f5]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white text-shadow-sm">{wallet.type}</h4>
                    {wallet.primary && (
                      <span className="px-2 py-0.5 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] text-xs border border-[#9b87f5]/30">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 text-shadow-sm font-mono">{wallet.address}</p>
                  <p className="text-xs text-white/50 text-shadow-sm mt-1">{wallet.provider} • {wallet.balance}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                {wallet.explorer && (
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View on Explorer
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  {wallet.explorer ? "Disconnect" : "Manage"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full mt-6 [&_button]:!w-full [&_button]:!h-11 [&_button]:!rounded-lg [&_button]:!bg-[#9b87f5] [&_button]:hover:!bg-[#7E69AB] [&_button]:!text-white">
          <ConnectWalletButton label="Connect New Wallet" />
        </div>
      </div>
    </div>
  );
};
