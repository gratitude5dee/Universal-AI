import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import type { RWAHolding } from "@/types/rwa";

interface PerformanceChartProps {
  holding: RWAHolding;
}

export const PerformanceChart = ({ holding }: PerformanceChartProps) => {
  // Mock data for chart - would use recharts in production
  const totalROI = ((holding.currentValue + holding.yieldEarned - holding.totalInvested) / holding.totalInvested) * 100;

  return (
    <Card className="glass-card p-6 rounded-xl border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#059669]" />
            Performance Overview
          </h4>
          <p className="text-sm text-white/50 mt-1">Value & yield tracking</p>
        </div>
        <Tabs defaultValue="6m" className="w-auto">
          <TabsList className="bg-white/5">
            <TabsTrigger value="1m" className="text-white/70 data-[state=active]:text-white text-xs">
              1M
            </TabsTrigger>
            <TabsTrigger value="3m" className="text-white/70 data-[state=active]:text-white text-xs">
              3M
            </TabsTrigger>
            <TabsTrigger value="6m" className="text-white/70 data-[state=active]:text-white text-xs">
              6M
            </TabsTrigger>
            <TabsTrigger value="1y" className="text-white/70 data-[state=active]:text-white text-xs">
              1Y
            </TabsTrigger>
            <TabsTrigger value="all" className="text-white/70 data-[state=active]:text-white text-xs">
              ALL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart Placeholder */}
      <div className="aspect-[2/1] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="text-6xl mb-2">📈</div>
          <p className="text-white/50 text-sm">Performance Chart</p>
          <p className="text-white/70 text-xs mt-1">Value over time visualization</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-white/50 mb-1">Total Invested</p>
          <p className="text-white font-semibold">${holding.totalInvested.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-white/50 mb-1">Current Value</p>
          <p className="text-white font-semibold">${holding.currentValue.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-white/50 mb-1">Total ROI</p>
          <p className={`font-semibold ${totalROI >= 0 ? "text-[#059669]" : "text-[#DC2626]"}`}>
            {totalROI >= 0 ? "+" : ""}{totalROI.toFixed(2)}%
          </p>
        </div>
      </div>
    </Card>
  );
};
