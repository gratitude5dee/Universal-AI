import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Vote, Download, TrendingUp, TrendingDown } from "lucide-react";
import { AssetTypeIcon } from "../shared/AssetTypeIcon";
import { DistributionHistory } from "./DistributionHistory";
import { PerformanceChart } from "./PerformanceChart";
import type { RWAHolding } from "@/types/rwa";

interface AssetDetailsModalProps {
  holding: RWAHolding;
  onClose: () => void;
}

export const AssetDetailsModal = ({ holding, onClose }: AssetDetailsModalProps) => {
  const gainPercentage = ((holding.currentValue - holding.totalInvested) / holding.totalInvested) * 100;
  const isGain = gainPercentage >= 0;
  const totalROI = ((holding.currentValue + holding.yieldEarned - holding.totalInvested) / holding.totalInvested) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AssetTypeIcon assetType={holding.asset.assetType} size="lg" />
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {holding.asset.tokenName}
                </DialogTitle>
                <p className="text-sm text-white/50 mt-1">
                  {holding.asset.tokenSymbol} • {holding.asset.assetType.replace("-", " ")}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-[#059669] text-[#059669] bg-[#059669]/10">
              Active
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Asset Images (12 photos)</p>
              </div>
            </div>

            {/* Performance Chart */}
            <PerformanceChart holding={holding} />

            {/* Detailed Tabs */}
            <Tabs defaultValue="investment" className="w-full">
              <TabsList className="w-full bg-white/5">
                <TabsTrigger value="investment" className="flex-1 text-white/70 data-[state=active]:text-white">
                  Your Investment
                </TabsTrigger>
                <TabsTrigger value="distributions" className="flex-1 text-white/70 data-[state=active]:text-white">
                  Distributions
                </TabsTrigger>
                <TabsTrigger value="governance" className="flex-1 text-white/70 data-[state=active]:text-white">
                  Governance
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 text-white/70 data-[state=active]:text-white">
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="investment" className="glass-card p-6 rounded-xl mt-4">
                <h4 className="font-semibold text-white mb-4">Your Investment Details</h4>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50">Token Holdings</p>
                      <p className="text-white font-semibold text-lg">{holding.tokenCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Entry Price</p>
                      <p className="text-white font-semibold text-lg">${holding.entryPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Current Price</p>
                      <p className="text-white font-semibold text-lg">${holding.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Price Change</p>
                      <p className={`font-semibold text-lg ${isGain ? "text-[#059669]" : "text-[#DC2626]"}`}>
                        {isGain ? "+" : ""}{((holding.currentPrice - holding.entryPrice) / holding.entryPrice * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Invested</span>
                      <span className="text-white font-semibold">${holding.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Current Value</span>
                      <span className="text-white font-semibold">${holding.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Yield Earned</span>
                      <span className="text-[#059669] font-semibold">${holding.yieldEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Unrealized Gain/Loss</span>
                      <span className={`font-semibold ${isGain ? "text-[#059669]" : "text-[#DC2626]"}`}>
                        {isGain ? "+" : ""}${holding.unrealizedGain.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <span className="text-white font-semibold">Total ROI</span>
                      <span className={`font-bold text-lg ${totalROI >= 0 ? "text-[#059669]" : "text-[#DC2626]"}`}>
                        {totalROI >= 0 ? "+" : ""}{totalROI.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="distributions" className="glass-card p-6 rounded-xl mt-4">
                <DistributionHistory distributions={holding.distributions} tokenCount={holding.tokenCount} />
              </TabsContent>

              <TabsContent value="governance" className="glass-card p-6 rounded-xl mt-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Vote className="h-5 w-5 text-[#1E40AF]" />
                  Governance & Voting
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/70 mb-2">Your Voting Power</p>
                    <p className="text-2xl font-bold text-white">{(holding.tokenCount / holding.asset.totalSupply * 100).toFixed(4)}%</p>
                    <p className="text-xs text-white/50 mt-1">{holding.tokenCount.toLocaleString()} votes</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-white font-semibold">Active Proposals (2)</p>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">Roof Replacement</p>
                          <p className="text-xs text-white/50">Ends in 5 days</p>
                        </div>
                        <Badge className="bg-[#059669]/20 text-[#059669]">78% Yes</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2" variant="outline">
                        View & Vote
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">Property Manager Change</p>
                          <p className="text-xs text-white/50">Ends in 12 days</p>
                        </div>
                        <Badge className="bg-[#EA580C]/20 text-[#EA580C]">45% Yes</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2" variant="outline">
                        View & Vote
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="glass-card p-6 rounded-xl mt-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  Documents & Reports
                </h4>
                <div className="space-y-2">
                  {[
                    { name: "Q3 2025 Financial Statement", date: "Oct 1, 2025", size: "2.4 MB" },
                    { name: "Annual Property Tax Bill", date: "Sep 15, 2025", size: "1.1 MB" },
                    { name: "Insurance Certificate", date: "Aug 1, 2025", size: "856 KB" },
                    { name: "Tenant Lease Agreements", date: "Jul 1, 2025", size: "3.2 MB" },
                    { name: "Property Inspection Report", date: "Jun 15, 2025", size: "4.8 MB" },
                    { name: "LLC Operating Agreement", date: "Jan 1, 2025", size: "1.7 MB" },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-white/50" />
                        <div>
                          <p className="text-white text-sm">{doc.name}</p>
                          <p className="text-xs text-white/50">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4 border-white/10 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Documents
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card p-6 rounded-xl space-y-4 sticky top-6">
              <h3 className="font-semibold text-white">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Trade Tokens
                </Button>
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  Claim Yield
                </Button>
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  Transfer Tokens
                </Button>
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
