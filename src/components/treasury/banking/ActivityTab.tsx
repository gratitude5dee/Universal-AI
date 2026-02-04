
import React from "react";
import { BarChart3 } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import { Button } from "@/components/ui/button";
import { useEvmWallet } from "@/context/EvmWalletContext";

const ActivityTab: React.FC = () => {
  const { address, nativeBalance, chainMeta, isLoading, refresh } = useEvmWallet();

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Banking Activities</h3>
      
      <div className="mb-6 space-y-4">
        {/* Wallet Information */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Wallet Information</h4>
            <Button variant="ghost" size="sm" onClick={() => refresh()}>
              Refresh
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">{address || 'No wallet connected'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span>
                {isLoading
                  ? "Loading..."
                  : nativeBalance && chainMeta
                    ? `${nativeBalance.formatted} ${chainMeta.nativeSymbol}`
                    : "—"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Visualization of transaction activity */}
        <div className="aspect-video bg-studio-sand/10 rounded-xl flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-2 text-studio-accent/50" />
            <p>Transaction Activity Chart</p>
          </div>
        </div>
      </div>
      
      <TransactionHistory />
    </div>
  );
};

export default ActivityTab;
