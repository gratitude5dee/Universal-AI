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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Network Status
        </h3>
        <div className={`w-2 h-2 rounded-full ${rpcStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
      </div>

      <div className="space-y-4">
        {/* Network Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/50 mb-1">Network</p>
            <p className="text-sm font-medium text-white">{currentNetwork.name}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Chain ID</p>
            <p className="text-sm font-medium text-white">#{currentNetwork.chainId}</p>
          </div>
        </div>

        {/* RPC Health */}
        <div>
          <p className="text-xs text-white/50 mb-2">RPC Health</p>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-white/50" />
              <span className="text-sm text-white/70">Status</span>
            </div>
            <span className={`text-sm font-medium ${healthStatus.color}`}>
              {healthStatus.text}
            </span>
          </div>
        </div>

        {/* Latest Block */}
        <div>
          <p className="text-xs text-white/50 mb-2">Latest Block</p>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <span className="text-sm text-white/70">Block Height</span>
            <span className="text-sm font-mono font-medium text-white">
              {rpcStatus.blockHeight.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/10 pt-4 space-y-2">
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
            <>
              <a
                href={currentNetwork.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-medium">Testnet Faucet</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </a>

              <a
                href="https://staking.story.foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">Staking Dashboard</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
