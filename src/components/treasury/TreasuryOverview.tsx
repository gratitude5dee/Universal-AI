
import React from "react";
import { Briefcase, Coins, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DirectoryOfAgents from "./DirectoryOfAgents";

interface TreasuryOverviewProps {
  totalBalance: number;
  todayChange: number;
  percentageChange: number;
}

const TreasuryOverview: React.FC<TreasuryOverviewProps> = ({
  totalBalance,
  todayChange,
  percentageChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="glass-card rounded-xl p-4 border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Treasury</p>
              <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Coins className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>${todayChange.toLocaleString()} today</span>
          </div>
        </div>
        
        {/* Performance */}
        <div className="glass-card rounded-xl p-4 border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <p className="text-3xl font-bold text-green-600">+{percentageChange}%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <span>Performing better than 82% of wizards</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-4 border border-white/10 backdrop-blur-md">
          <p className="text-sm text-muted-foreground mb-2">Quick Spells</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs h-9">Add Treasure</Button>
            <Button size="sm" variant="outline" className="text-xs h-9">Send Token</Button>
            <Button size="sm" variant="outline" className="text-xs h-9">Set Goal</Button>
            <Button size="sm" variant="outline" className="text-xs h-9">View History</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryOverview;
