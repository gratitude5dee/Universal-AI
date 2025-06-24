import React from "react";
import { AlertTriangle, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="glass-card p-5">
        <h3 className="text-lg font-medium mb-4 text-white">Income & Expenditure</h3>
        <div className="aspect-video flex items-center justify-center bg-studio-sand/10 rounded-xl">
          <div className="text-center text-white">
            <BarChart3 className="h-10 w-10 mx-auto mb-2 text-studio-accent/50" />
            <p>Income vs. Expenditure Chart</p>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Pending Approvals</h3>
          <Badge className="bg-yellow-500">{2}</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="backdrop-blur-md bg-white/10 p-3 rounded-lg border border-white/20 shadow-card-glow">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm text-white text-shadow-sm">Large Transfer Pending</h4>
                <p className="text-xs text-white/80 mb-2">$2,500.00 to DataVault Pro</p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs bg-studio-accent hover:bg-studio-accent/90 text-white">Approve</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">Deny</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 p-3 rounded-lg border border-white/20 shadow-card-glow">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm text-white text-shadow-sm">New Recipient</h4>
                <p className="text-xs text-white/80 mb-2">$350.00 to Cloud Hosting LLC</p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs bg-studio-accent hover:bg-studio-accent/90 text-white">Approve</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">Deny</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;