import React, { useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { agents } from "./mockData";

const AgentComparison = () => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleAddAgent = (agentId: string) => {
    if (selectedAgents.length < 3 && !selectedAgents.includes(agentId)) {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };
  
  const handleRemoveAgent = (agentId: string) => {
    setSelectedAgents(selectedAgents.filter(id => id !== agentId));
  };
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !selectedAgents.includes(agent.id)
  );
  
  const selectedAgentData = agents.filter(agent => selectedAgents.includes(agent.id));
  
  // Comparison categories
  const categories = [
    { name: "Capabilities", items: ["Text Generation", "Image Creation", "Code Generation", "Data Analysis", "Multi-Modal"] },
    { name: "Base Models", items: ["GPT-4o", "Claude 3", "Gemini Pro", "Mistral"] },
    { name: "Integration", items: ["API Access", "Webhook Support", "SDK Libraries", "CLI Tools"] },
    { name: "Pricing", items: ["Free Tier", "Pay-per-use", "Subscription", "Enterprise"] }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <h2 className="text-xl font-semibold mb-4 text-white text-shadow-sm">Compare AI Agents</h2>
        <p className="text-white/80 mb-4 text-shadow-sm">
          Select up to 3 agents to compare their capabilities, performance, and pricing
        </p>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input 
            placeholder="Search for agents to compare..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        {searchQuery && filteredAgents.length > 0 && (
          <div className="max-h-60 overflow-y-auto border rounded-lg mb-6 backdrop-blur-md bg-white/5 border-white/20">
            {filteredAgents.slice(0, 5).map(agent => (
              <div key={agent.id} className="p-3 hover:bg-white/10 border-b last:border-b-0 border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white text-shadow-sm">{agent.name}</h3>
                  <p className="text-xs text-white/70">{agent.description.substring(0, 60)}...</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="ml-2 text-white hover:bg-white/20"
                  onClick={() => handleAddAgent(agent.id)}
                  disabled={selectedAgents.length >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((index) => (
            <div 
              key={index} 
              className={`border rounded-xl p-4 min-h-32 flex ${selectedAgents[index] ? 'backdrop-blur-md bg-white/10 border-white/20 shadow-card-glow' : 'bg-white/5 border-dashed border-white/20'}`}
            >
              {selectedAgents[index] ? (
                <div className="w-full">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-white text-shadow-sm">
                        {agents.find(a => a.id === selectedAgents[index])?.name}
                      </h3>
                      <p className="text-xs text-white/70">
                        {agents.find(a => a.id === selectedAgents[index])?.provider}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAgent(selectedAgents[index])}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-24 text-white/70">Rating:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-4 w-4 text-amber-400 ${i < parseInt(agents.find(a => a.id === selectedAgents[index])?.rating || "0") ? "text-amber-400" : "text-white/30"}`}>★</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-24 text-white/70">Price:</span>
                      <span className="text-white">{agents.find(a => a.id === selectedAgents[index])?.price}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto text-white/30 mb-2" />
                    <p className="text-sm text-white/50">Add agent to compare</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedAgents.length > 0 && (
        <div className="glass-card overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <div className="grid grid-cols-[180px_1fr] divide-x divide-white/20">
            <div className="bg-white/5">
              <div className="h-16 border-b border-white/20 flex items-end px-4 pb-4">
                <span className="font-medium text-white text-shadow-sm">Features</span>
              </div>
              
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="px-4 py-3 bg-white/10 border-y border-white/20 font-medium text-white text-shadow-sm">
                    {category.name}
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="px-4 py-2 border-b last:border-b-0 border-white/10">
                      <span className="text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedAgents.length}, 1fr)` }}>
              <div className="contents">
                {selectedAgentData.map((agent, agentIndex) => (
                  <div key={agent.id} className="divide-y divide-white/20">
                    <div className="h-16 px-4 flex items-center justify-center border-b border-r border-white/20">
                      <h3 className="font-medium text-center text-white text-shadow-sm">{agent.name}</h3>
                    </div>
                    
                    {categories.map((category, categoryIndex) => (
                      <div key={`${agent.id}-${categoryIndex}`} className="divide-y divide-white/10">
                        <div className="px-4 py-3 bg-white/5 border-b font-medium text-center text-white/70">
                          {/* Category header - empty but keeps grid alignment */}
                          &nbsp;
                        </div>
                        {category.items.map((item, itemIndex) => {
                          // Simulate feature support based on agent capabilities
                          const hasFeature = Math.random() > 0.3;
                          
                          return (
                            <div key={`${agent.id}-${categoryIndex}-${itemIndex}`} className="px-4 py-2 flex justify-center border-b last:border-b-0 border-white/10">
                              {hasFeature ? (
                                <Check className="h-5 w-5 text-green-400" />
                              ) : (
                                <X className="h-5 w-5 text-white/30" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentComparison;