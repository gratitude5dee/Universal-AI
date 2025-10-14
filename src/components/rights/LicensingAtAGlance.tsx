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
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[hsl(var(--accent-purple))]" />
          Licensing Summary
        </h3>
        <a href="#" className="text-xs text-[hsl(var(--accent-purple))] hover:text-[hsl(var(--accent-purple-light))] transition-colors font-medium">
          View All →
        </a>
      </div>

      <div className="space-y-4">
        {/* Active License Types */}
        <div>
          <p className="text-xs text-[hsl(var(--text-tertiary))] mb-2 font-medium">Active License Types: {licensingData.activeLicenseTypes.length}</p>
          <div className="flex flex-wrap gap-2">
            {licensingData.activeLicenseTypes.map((type, index) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-md bg-[hsl(var(--accent-purple))]/10 border border-[hsl(var(--accent-purple))]/20 text-[hsl(var(--accent-purple))] text-xs font-semibold"
              >
                • {type} ({index + 2} minted)
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Total Units Minted</p>
            <p className="text-3xl font-bold text-[hsl(var(--text-primary))]">8</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Total Revenue</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-[hsl(var(--success))]">45.8 IP</p>
              <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
          </div>
        </div>

        {/* Latest Activity */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-[hsl(var(--text-tertiary))] mb-2 font-medium">Latest Activity:</p>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-[hsl(var(--text-primary))] font-medium mb-1">Commercial license minted</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-tertiary))]">
                <Clock className="w-3 h-3" />
                <span>{licensingData.lastTxTime}</span>
              </div>
              <a
                href={`${currentNetwork.ipExplorerUrl}/tx/${licensingData.lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[hsl(var(--accent-purple))] hover:text-[hsl(var(--accent-purple-light))] transition-colors group"
              >
                <span className="text-xs font-medium">View Tx</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
