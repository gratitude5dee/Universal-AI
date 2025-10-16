import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Distribution } from "@/types/rwa";

interface DistributionHistoryProps {
  distributions: Distribution[];
  tokenCount: number;
}

export const DistributionHistory = ({ distributions, tokenCount }: DistributionHistoryProps) => {
  const getStatusConfig = (status: Distribution["status"]) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle, color: "text-[#059669] bg-[#059669]/20", label: "Completed" };
      case "processing":
        return { icon: Clock, color: "text-[#F59E0B] bg-[#F59E0B]/20", label: "Processing" };
      case "scheduled":
        return { icon: Clock, color: "text-[#1E40AF] bg-[#1E40AF]/20", label: "Scheduled" };
      case "failed":
        return { icon: XCircle, color: "text-[#DC2626] bg-[#DC2626]/20", label: "Failed" };
    }
  };

  const totalDistributions = distributions.reduce(
    (sum, d) => sum + d.amountPerToken * tokenCount,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white">Distribution History</h4>
          <p className="text-sm text-white/50">Total received: ${totalDistributions.toFixed(2)}</p>
        </div>
        <Button variant="outline" size="sm" className="border-white/10 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-left text-white/70">
              <th className="pb-3">Date</th>
              <th className="pb-3">Per Token</th>
              <th className="pb-3">Your Share</th>
              <th className="pb-3">Token</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">TX Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {distributions.map((dist) => {
              const config = getStatusConfig(dist.status);
              const Icon = config.icon;
              const yourShare = dist.amountPerToken * tokenCount;

              return (
                <tr key={dist.id} className="text-white/90">
                  <td className="py-3">
                    {new Date(dist.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">${dist.amountPerToken.toFixed(4)}</td>
                  <td className="py-3 font-semibold">${yourShare.toFixed(2)}</td>
                  <td className="py-3">{dist.paymentToken}</td>
                  <td className="py-3">
                    <Badge className={config.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {dist.transactionHash ? (
                      <button className="text-[#1E40AF] hover:underline text-xs">
                        {dist.transactionHash.slice(0, 6)}...{dist.transactionHash.slice(-4)}
                      </button>
                    ) : (
                      <span className="text-white/50 text-xs">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between text-sm">
        <span className="text-white/70">Next Distribution:</span>
        <span className="text-white font-semibold">December 1, 2025</span>
      </div>
    </div>
  );
};
