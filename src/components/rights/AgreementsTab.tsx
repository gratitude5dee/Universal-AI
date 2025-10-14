import { FileText, Users, Clock, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Agreement {
  id: string;
  name: string;
  parties: string[];
  licensePolicy: string;
  status: "draft" | "active" | "expired";
  effectiveDate: string;
  txHash?: string;
}

const mockAgreements: Agreement[] = [
  {
    id: "1",
    name: "Collaboration Agreement - Universal Dream",
    parties: ["You", "Alex Rivera", "Sam Taylor"],
    licensePolicy: "LRP",
    status: "active",
    effectiveDate: "2024-01-15",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8"
  },
  {
    id: "2",
    name: "Remix License - Cosmic Foundation",
    parties: ["You", "Foundation Layer DAO"],
    licensePolicy: "LAP",
    status: "active",
    effectiveDate: "2024-02-20",
    txHash: "0x8a91D82e3d3b35Cc7a92e8b934Bc9e7595f0c2a1"
  },
  {
    id: "3",
    name: "Revenue Split Agreement",
    parties: ["You", "Producer Collective"],
    licensePolicy: "Custom",
    status: "draft",
    effectiveDate: "2024-03-10",
  },
];

export const AgreementsTab = () => {
  const getStatusColor = (status: Agreement['status']) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "draft": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "expired": return "bg-red-500/20 text-red-300 border-red-500/30";
    }
  };

  const getStatusIcon = (status: Agreement['status']) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "draft": return <Clock className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">IP Agreements</h2>
          <p className="text-sm text-white/70 mt-1">Manage collaboration and licensing agreements</p>
        </div>
        <Button className="bg-primary hover:bg-primary/80">
          <FileText className="w-4 h-4 mr-2" />
          Create Agreement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="expired">Expired</option>
        </select>
        <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
          <option value="all">All Policies</option>
          <option value="lrp">LRP</option>
          <option value="lap">LAP</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Agreements Table */}
      <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-sm font-medium text-white/70">Agreement</th>
                <th className="text-left p-4 text-sm font-medium text-white/70">Parties</th>
                <th className="text-left p-4 text-sm font-medium text-white/70">Policy</th>
                <th className="text-left p-4 text-sm font-medium text-white/70">Status</th>
                <th className="text-left p-4 text-sm font-medium text-white/70">Effective Date</th>
                <th className="text-left p-4 text-sm font-medium text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAgreements.map((agreement) => (
                <tr key={agreement.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-white">{agreement.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-white/50" />
                      <span className="text-sm text-white/70">{agreement.parties.length} parties</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                      {agreement.licensePolicy}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(agreement.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(agreement.status)}
                          {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-white/70">{new Date(agreement.effectiveDate).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {agreement.txHash && (
                        <Button variant="ghost" size="sm" className="text-xs text-blue-400">
                          On-chain
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

      {/* Draft/Sign/Record Flow */}
      <div className="glass-card border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Agreement Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <h4 className="text-sm font-medium text-white">Draft</h4>
            </div>
            <p className="text-xs text-white/70">
              Create agreement terms off-chain with all parties
            </p>
            <div className="mt-2 text-xs text-white/50">Off-chain metadata</div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-400">2</span>
              </div>
              <h4 className="text-sm font-medium text-white">Sign</h4>
            </div>
            <p className="text-xs text-white/70">
              All parties cryptographically sign the agreement
            </p>
            <div className="mt-2 text-xs text-white/50">Multi-sig validation</div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <span className="text-sm font-medium text-green-400">3</span>
              </div>
              <h4 className="text-sm font-medium text-white">Record</h4>
            </div>
            <p className="text-xs text-white/70">
              Agreement recorded immutably on-chain
            </p>
            <div className="mt-2 text-xs text-white/50">On-chain record</div>
          </div>
        </div>
      </div>
    </div>
  );
};
