import { Wallet, Shield, AlertTriangle, TrendingUp, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNetwork } from "@/context/NetworkContext";

export const SettingsTab = () => {
  const { currentNetwork } = useNetwork();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">IP Portal Settings</h2>
        <p className="text-sm text-white/70 mt-1">Configure payouts, operators, and security settings</p>
      </div>

      {/* Payout Addresses */}
      <div className="glass-card border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-white">Payout Addresses</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Withdraw Address</Label>
              <div className="group relative">
                <Info className="w-3 h-3 text-white/50 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none">
                  Address for receiving unstaked IP and withdrawals
                </div>
              </div>
            </div>
            <Input
              placeholder="0x..."
              defaultValue="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8"
              className="bg-white/5 border-white/10 font-mono"
            />
            <p className="text-xs text-white/50 mt-2">
              Changes effective next block
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Reward Address</Label>
              <div className="group relative">
                <Info className="w-3 h-3 text-white/50 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none">
                  Address for receiving staking rewards (auto-distributes when ≥ 8 IP)
                </div>
              </div>
            </div>
            <Input
              placeholder="0x..."
              defaultValue="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8"
              className="bg-white/5 border-white/10 font-mono"
            />
          </div>

          <Button className="bg-primary hover:bg-primary/80">
            Update Addresses
          </Button>
        </div>
      </div>

      {/* Operator Management */}
      <div className="glass-card border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Operator Management</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white/70">
            Grant an operator permission to act on your behalf for staking operations
          </p>

          <div>
            <Label>Operator Address</Label>
            <Input
              placeholder="0x... (operator wallet address)"
              className="mt-2 bg-white/5 border-white/10 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Permissions</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <span className="text-sm text-white">Unstake IP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <span className="text-sm text-white">Redelegate IP</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10">
              Grant Operator
            </Button>
            <Button variant="outline" className="border-red-500/20 text-red-400">
              Revoke Operator
            </Button>
          </div>
        </div>
      </div>

      {/* Staking Information */}
      <div className="glass-card border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-medium text-white">Staking Information</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/70 mb-1">Active Stakes</p>
              <p className="text-2xl font-bold text-white">100 IP</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/70 mb-1">Unbonding</p>
              <p className="text-2xl font-bold text-yellow-400">20 IP</p>
              <p className="text-xs text-yellow-400/70 mt-1">11 days remaining</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/70 mb-1">Pending Rewards</p>
              <p className="text-2xl font-bold text-green-400">6.2 IP</p>
              <p className="text-xs text-white/50 mt-1">Auto-distribute at 8 IP</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/70 mb-1">Active Validators</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-300 mb-1">Important Notes</p>
                <ul className="text-xs text-yellow-200/70 space-y-1">
                  <li>• Unbonding period is 14 days. Funds are locked during this time.</li>
                  <li>• Rewards auto-distribute when accumulated rewards ≥ 8 IP</li>
                  <li>• Slashing can occur if validator misbehaves. Your stake may be reduced.</li>
                </ul>
              </div>
            </div>
          </div>

          <a
            href="https://staking.story.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 glass-card border border-white/10 rounded-lg hover:bg-white/5 transition-all"
          >
            <span className="text-sm text-white">Open Staking Dashboard</span>
            <ExternalLink className="w-4 h-4 text-white/50" />
          </a>
        </div>
      </div>

      {/* Export Section */}
      <div className="glass-card border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Export Data</h3>
        <p className="text-sm text-white/70 mb-4">
          Download your IP data, royalty policies, and collaborator information
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10">
            Export IP JSON
          </Button>
          <Button variant="outline" className="border-white/10">
            Export Royalty Policy
          </Button>
          <Button variant="outline" className="border-white/10">
            Export Collaborators
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-medium text-red-300">Danger Zone</h3>
        </div>
        <p className="text-sm text-white/70 mb-4">
          Destructive actions that cannot be undone
        </p>
        <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
          Delete IP Asset
        </Button>
      </div>
    </div>
  );
};
