import { ExternalLink, Activity, Droplet, TrendingUp } from "lucide-react";
import { useNetwork } from "@/context/NetworkContext";

export const NetworkStatusCard = () => {
  const { currentNetwork, rpcStatus } = useNetwork();

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getHealthStatus = () => {
    if (!rpcStatus.isHealthy) return { text: "Unavailable", color: "text-red-400" };
    if (rpcStatus.latency > 500) return { text: "Slow", color: "text-yellow-400" };
    return { text: "Healthy", color: "text-green-400" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="glass-card border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[hsl(var(--accent-purple))]" />
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
          Network Status
        </h3>
      </div>

      <div className="space-y-4">
        {/* Network Name */}
        <div>
          <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Network</p>
          <p className="text-sm font-medium text-[hsl(var(--text-primary))]">
            {currentNetwork.name}
          </p>
          <p className="text-xs text-[hsl(var(--text-tertiary))]">
            Chain ID: {currentNetwork.chainId}
          </p>
        </div>

        {/* RPC Status */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              rpcStatus.isHealthy ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--error))]'
            } animate-pulse`} />
            <span className="text-sm text-[hsl(var(--text-secondary))]">
              RPC {rpcStatus.isHealthy ? 'Active' : 'Inactive'}
            </span>
          </div>
          <span className="text-xs text-[hsl(var(--text-tertiary))]">
            {rpcStatus.latency}ms
          </span>
        </div>

        {/* Latest Block */}
        <div>
          <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Latest Block</p>
          <p className="text-xl font-bold text-[hsl(var(--text-primary))]">
            {rpcStatus.blockHeight.toLocaleString()}
          </p>
          <p className="text-xs text-[hsl(var(--text-tertiary))]">
            Updated {Math.floor((Date.now() - rpcStatus.lastChecked.getTime()) / 1000)}s ago
          </p>
        </div>

        {/* Links */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <a
            href={currentNetwork.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <span className="text-sm text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]">
              BlockScout Explorer
            </span>
            <ExternalLink className="w-4 h-4 text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--text-primary))]" />
          </a>

          <a
            href={currentNetwork.ipExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <span className="text-sm text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]">
              IP Explorer
            </span>
            <ExternalLink className="w-4 h-4 text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--text-primary))]" />
          </a>

          {currentNetwork.type === 'testnet' && currentNetwork.faucetUrl && (
            <a
              href={currentNetwork.faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 hover:bg-[hsl(var(--accent-blue))]/20 transition-all group"
            >
              <span className="text-sm text-[hsl(var(--accent-blue))] font-medium flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Get 10 IP from Faucet
              </span>
              <ExternalLink className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
            </a>
          )}

          <a
            href="https://staking.story.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <span className="text-sm text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]">
              Staking Dashboard
            </span>
            <ExternalLink className="w-4 h-4 text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--text-primary))]" />
          </a>
        </div>
      </div>
    </div>
  );
};
