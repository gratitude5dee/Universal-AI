import React, { useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { agents } from "./mockData";
import { Badge } from "@/components/ui/badge";

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
      {/* Search Card */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-card-glow">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Compare AI Agents</CardTitle>
          <CardDescription className="text-white/70 text-base">
            Select up to 3 agents to compare their capabilities, performance, and pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input 
              placeholder="Search for agents to compare..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          {searchQuery && filteredAgents.length > 0 && (
            <div className="max-h-60 overflow-y-auto rounded-lg backdrop-blur-md bg-white/5 border border-white/20 divide-y divide-white/10">
              {filteredAgents.slice(0, 5).map(agent => (
                <div key={agent.id} className="p-4 hover:bg-white/10 transition-colors flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{agent.name}</h3>
                    <p className="text-sm text-white/70 mt-1">{agent.description.substring(0, 80)}...</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-4 text-white hover:bg-studio-accent hover:text-white"
                    onClick={() => handleAddAgent(agent.id)}
                    disabled={selectedAgents.length >= 3}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Selection Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <Card 
                key={index} 
                className={`min-h-40 flex ${
                  selectedAgents[index] 
                    ? 'backdrop-blur-md bg-white/10 border-white/20 shadow-card-glow' 
                    : 'bg-white/5 border-dashed border-white/30'
                }`}
              >
                <CardContent className="p-4 w-full flex flex-col justify-between">
                  {selectedAgents[index] ? (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">
                            {agents.find(a => a.id === selectedAgents[index])?.name}
                          </h3>
                          <p className="text-sm text-white/70 mt-1">
                            {agents.find(a => a.id === selectedAgents[index])?.provider}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAgent(selectedAgents[index])}
                          className="text-white hover:bg-white/20 -mt-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Rating:</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-base ${
                                  i < parseInt(agents.find(a => a.id === selectedAgents[index])?.rating || "0") 
                                    ? "text-yellow-400" 
                                    : "text-white/30"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Price:</span>
                          <Badge className="bg-studio-accent/20 text-studio-accent border-studio-accent/30">
                            {agents.find(a => a.id === selectedAgents[index])?.price}
                          </Badge>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Plus className="h-10 w-10 mx-auto text-white/30 mb-2" />
                        <p className="text-sm text-white/50">Add agent #{index + 1}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedAgents.length > 0 && (
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-card-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-[200px_1fr] divide-x divide-white/20">
              {/* Left Column - Feature Names */}
              <div className="bg-white/5">
                <div className="h-16 border-b border-white/20 flex items-end px-4 pb-4">
                  <span className="font-semibold text-white">Features</span>
                </div>
                
                {categories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="px-4 py-3 bg-white/10 border-y border-white/20 font-semibold text-white">
                      {category.name}
                    </div>
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="px-4 py-3 border-b last:border-b-0 border-white/10">
                        <span className="text-sm text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Right Columns - Agent Data */}
              <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedAgents.length}, 1fr)` }}>
                {selectedAgentData.map((agent) => (
                  <div key={agent.id} className="divide-y divide-white/20">
                    <div className="h-16 px-4 flex items-center justify-center border-b border-white/20">
                      <h3 className="font-semibold text-center text-white">{agent.name}</h3>
                    </div>
                    
                    {categories.map((category, categoryIndex) => (
                      <div key={`${agent.id}-${categoryIndex}`} className="divide-y divide-white/10">
                        <div className="px-4 py-3 bg-white/5 border-b font-medium text-center text-white/70">
                          &nbsp;
                        </div>
                        {category.items.map((item, itemIndex) => {
                          const hasFeature = Math.random() > 0.3;
                          
                          return (
                            <div key={`${agent.id}-${categoryIndex}-${itemIndex}`} className="px-4 py-3 flex justify-center border-b last:border-b-0 border-white/10">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentComparison;
