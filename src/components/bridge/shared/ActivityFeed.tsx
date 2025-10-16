import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  type: "mint" | "bridge" | "sale" | "transfer";
  title: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
  amount?: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "mint", title: "Minted 'Sunset Dreams v2' on OpenSea", timestamp: "2 hours ago", status: "completed", txHash: "0x123..." },
  { id: "2", type: "bridge", title: "Bridged NFT from Solana to Ethereum", timestamp: "5 hours ago", status: "completed", txHash: "0x456..." },
  { id: "3", type: "sale", title: "Sold 'Abstract Waves #42' for 1.5 ETH", timestamp: "1 day ago", status: "completed", amount: "1.5 ETH" },
  { id: "4", type: "mint", title: "Minting 100 editions on Zora", timestamp: "1 day ago", status: "pending" }
];

export const ActivityFeed = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />;
      case "pending": return <Clock className="w-5 h-5 text-[#F97316] animate-pulse" />;
      case "failed": return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mint": return "bg-[#9b87f5]/20 text-[#9b87f5] border-[#9b87f5]/30";
      case "bridge": return "bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/30";
      case "sale": return "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30";
      case "transfer": return "bg-[#F97316]/20 text-[#F97316] border-[#F97316]/30";
      default: return "bg-white/20 text-white border-white/30";
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
      <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {mockTransactions.map((tx, idx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {getStatusIcon(tx.status)}
            <div className="flex-1">
              <p className="font-medium text-white text-shadow-sm">{tx.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(tx.type)}`}>
                  {tx.type}
                </span>
                <span className="text-xs text-white/50">{tx.timestamp}</span>
              </div>
            </div>
            {tx.amount && (
              <span className="font-semibold text-[#10B981]">{tx.amount}</span>
            )}
            {tx.txHash && (
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
