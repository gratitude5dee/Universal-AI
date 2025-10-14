import { ExternalLink, FileText, TrendingUp, Clock } from "lucide-react";
import { useNetwork } from "@/context/NetworkContext";

export const LicensingAtAGlance = () => {
  const { currentNetwork } = useNetwork();

  const licensingData = {
    activeLicenseTypes: ["Commercial", "Personal", "Remix"],
    unitsMintedThisMonth: 24,
    revenueToDate: 1250,
    lastTxHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
    lastTxTime: "2 hours ago",
  };

  return (
    <div className="glass-card border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Licensing At-a-Glance
        </h3>
      </div>

      <div className="space-y-4">
        {/* Active License Types */}
        <div>
          <p className="text-xs text-white/50 mb-2">Active License Types</p>
          <div className="flex flex-wrap gap-2">
            {licensingData.activeLicenseTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/50 mb-1">Units Minted</p>
            <p className="text-2xl font-bold text-white">{licensingData.unitsMintedThisMonth}</p>
            <p className="text-xs text-white/50 mt-0.5">this month</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/50 mb-1">Revenue</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-green-400">${licensingData.revenueToDate}</p>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-white/50 mt-0.5">total</p>
          </div>
        </div>

        {/* Last Transaction */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 mb-1">Last On-chain Transaction</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-white/50" />
                <span className="text-sm text-white/70">{licensingData.lastTxTime}</span>
              </div>
            </div>
            <a
              href={`${currentNetwork.ipExplorerUrl}/tx/${licensingData.lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <span className="text-xs text-white/70 group-hover:text-white font-mono">
                {licensingData.lastTxHash.slice(0, 6)}...{licensingData.lastTxHash.slice(-4)}
              </span>
              <ExternalLink className="w-3 h-3 text-white/50 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
