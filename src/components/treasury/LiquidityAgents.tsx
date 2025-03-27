
import React from "react";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const LiquidityAgents = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-studio-accent" />
          Liquidity Management
        </h2>
        <p className="text-muted-foreground mb-4">
          Optimize your liquidity positions across multiple pools and platforms
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/80 rounded-xl p-5 border border-studio-sand/20">
            <h3 className="font-medium mb-4 text-blue-dark">Active Liquidity Positions</h3>
            
            <div className="space-y-4">
              {[
                { pair: "ETH/USDC", platform: "Uniswap V3", value: "$12,500", apr: "8.4%" },
                { pair: "wBTC/ETH", platform: "Curve", value: "$8,750", apr: "7.2%" },
                { pair: "SOL/USDC", platform: "Raydium", value: "$5,300", apr: "9.5%" }
              ].map((position) => (
                <div key={position.pair} className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-blue-dark">{position.pair}</p>
                      <p className="text-xs text-blue-dark/70">{position.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-dark">{position.value}</p>
                      <p className="text-xs text-green-600">{position.apr} APR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-4">
              Add New Position
            </Button>
          </div>
          
          <div className="bg-white/80 rounded-xl p-5 border border-studio-sand/20">
            <h3 className="font-medium mb-4 text-blue-dark">Liquidity Automation</h3>
            
            <div className="space-y-4">
              {[
                { 
                  name: "Range Wizard",
                  description: "Automatically adjusts liquidity ranges based on market volatility",
                  status: "Active" 
                },
                { 
                  name: "Yield Optimizer",
                  description: "Moves liquidity to highest yielding pools",
                  status: "Paused" 
                }
              ].map((agent) => (
                <div key={agent.name} className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-blue-dark">{agent.name}</p>
                      <p className="text-xs text-blue-dark/70">{agent.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      agent.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-blue-dark">Risk Management</h3>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-dark">Impermanent Loss Protection</span>
                  <span className="font-medium text-yellow-600">Medium</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "60%" }} />
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Adjust Risk Parameters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityAgents;
