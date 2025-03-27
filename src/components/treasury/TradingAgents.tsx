
import React from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const TradingAgents = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-studio-accent" />
          AI Trading Agents
        </h2>
        <p className="text-muted-foreground mb-4">
          Intelligent agents that execute trades on your behalf based on magical algorithms
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {[
            {
              name: "Market Sentinel",
              description: "Monitors market conditions and identifies optimal trading opportunities",
              status: "Active",
              performance: "+12.4%",
              risk: "Medium"
            },
            {
              name: "Momentum Mage",
              description: "Captures trending market movements with algorithmic precision",
              status: "Paused",
              performance: "+8.7%",
              risk: "High"
            },
            {
              name: "Value Oracle",
              description: "Identifies undervalued assets based on fundamental analysis",
              status: "Active",
              performance: "+5.2%",
              risk: "Low"
            }
          ].map((agent) => (
            <div key={agent.name} className="bg-white/80 rounded-xl p-5 border border-studio-sand/20 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-blue-dark">{agent.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  agent.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-blue-dark/80 mt-2">{agent.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-dark/70">Performance</p>
                  <p className="text-sm font-medium text-green-600">{agent.performance}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-dark/70">Risk Level</p>
                  <p className="text-sm font-medium text-blue-dark">{agent.risk}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">Configure</Button>
                <Button size="sm" className="flex-1">{agent.status === "Active" ? "Pause" : "Activate"}</Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="mt-6">
          Create New Trading Agent
        </Button>
      </div>
    </div>
  );
};

export default TradingAgents;
