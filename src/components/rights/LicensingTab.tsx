import { useState } from "react";
import { FileText, Eye, Ban, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface License {
  id: string;
  type: string;
  licensee: string;
  price: number;
  mintedDate: string;
  status: "active" | "revoked";
}

const mockLicenses: License[] = [
  { id: "1", type: "Commercial", licensee: "0x742d35Cc...", price: 500, mintedDate: "2024-01-20", status: "active" },
  { id: "2", type: "Personal", licensee: "0x8a91D82e...", price: 50, mintedDate: "2024-02-15", status: "active" },
  { id: "3", type: "Remix", licensee: "0x9c82F93f...", price: 250, mintedDate: "2024-03-01", status: "revoked" },
];

const licenseTemplates = [
  {
    name: "Personal Use",
    description: "Non-commercial, personal projects only",
    price: 50,
    terms: ["Single user", "Non-commercial", "Attribution required"]
  },
  {
    name: "Commercial",
    description: "Full commercial rights with attribution",
    price: 500,
    terms: ["Commercial use", "Attribution required", "No redistribution"]
  },
  {
    name: "Remix",
    description: "Create derivative works with revenue share",
    price: 250,
    terms: ["Derivative works allowed", "5% upstream royalty", "Attribution required"]
  },
  {
    name: "Exclusive",
    description: "Exclusive rights for specific territory/time",
    price: 5000,
    terms: ["Exclusive use", "Territory-specific", "Time-limited"]
  },
];

export const LicensingTab = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked">("all");

  const filteredLicenses = mockLicenses.filter(
    license => filterStatus === "all" || license.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Licensing Management</h2>
          <p className="text-sm text-white/70 mt-1">Create, manage, and track IP licenses</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create License
        </Button>
      </div>

      {/* License Templates */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">License Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {licenseTemplates.map((template) => (
            <div
              key={template.name}
              className="glass-card border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-white">${template.price}</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">{template.name}</h4>
              <p className="text-xs text-white/70 mb-3">{template.description}</p>
              <div className="space-y-1">
                {template.terms.map((term, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 border-white/10 text-xs"
                onClick={() => setShowCreateModal(true)}
              >
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Minted Licenses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Minted Licenses</h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-sm font-medium text-white/70">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-white/70">Licensee</th>
                  <th className="text-left p-4 text-sm font-medium text-white/70">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-white/70">Minted</th>
                  <th className="text-left p-4 text-sm font-medium text-white/70">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license) => (
                  <tr key={license.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-medium text-white">{license.type}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/70 font-mono">{license.licensee}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">{license.price}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/70">
                        {new Date(license.mintedDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          license.status === "active"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                      >
                        {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {license.status === "active" && (
                          <Button variant="ghost" size="sm" className="text-xs text-red-400">
                            <Ban className="w-3 h-3 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-white/70">Total Licenses</p>
              <p className="text-2xl font-bold text-white">{mockLicenses.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Active Licensees</p>
              <p className="text-2xl font-bold text-white">
                {mockLicenses.filter(l => l.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Revenue</p>
              <p className="text-2xl font-bold text-white">
                ${mockLicenses.reduce((sum, l) => sum + l.price, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create License Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-md glass-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Create New License</h3>
            <div className="space-y-4">
              <div>
                <Label>License Type</Label>
                <select className="mt-2 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  <option>Personal Use</option>
                  <option>Commercial</option>
                  <option>Remix</option>
                  <option>Exclusive</option>
                </select>
              </div>
              <div>
                <Label>Price (USD)</Label>
                <Input type="number" placeholder="100" className="mt-2 bg-white/5 border-white/10" />
              </div>
              <div>
                <Label>Supply Cap</Label>
                <Input type="number" placeholder="Unlimited" className="mt-2 bg-white/5 border-white/10" />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-white/10"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/80">
                  Create & Mint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
