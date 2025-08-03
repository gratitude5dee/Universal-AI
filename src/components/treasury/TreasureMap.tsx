
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Map, Scroll, Target, Castle, Book, Gem, Wallet, Sparkles, Shield, Wand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Allocation {
  id: string;
  name: string;
  purpose: string;
  allocation: number;
  spent: number;
  icon: any;
  color: string;
}

const allocations: Allocation[] = [
  {
    id: "castle",
    name: "Castle Construction",
    purpose: "Building our magical headquarters",
    allocation: 30000,
    spent: 12500,
    icon: Castle,
    color: "#8B5CF6",
  },
  {
    id: "research",
    name: "Spell Research",
    purpose: "Developing new magical capabilities",
    allocation: 15000,
    spent: 8750,
    icon: Book,
    color: "#10B981",
  },
  {
    id: "artifacts",
    name: "Magical Artifacts",
    purpose: "Acquiring rare and powerful items",
    allocation: 20000,
    spent: 5200,
    icon: Wand,
    color: "#F59E0B",
  },
  {
    id: "defense",
    name: "Magical Defenses",
    purpose: "Protecting the realm from dark forces",
    allocation: 25000,
    spent: 18900,
    icon: Shield,
    color: "#EF4444",
  },
];

const TreasureMap = () => {
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  const [mapAllocations, setMapAllocations] = useState(allocations);

  const totalAllocated = mapAllocations.reduce((sum, item) => sum + item.allocation, 0);
  const totalSpent = mapAllocations.reduce((sum, item) => sum + item.spent, 0);
  
  const handleAllocationClick = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    
    // Play magical sound
    const audio = new Audio("/map-unfold.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {
      console.log("Audio playback failed");
    });
  };
  
  const approveAdditionalFunds = () => {
    if (selectedAllocation) {
      setMapAllocations(current => 
        current.map(item => {
          if (item.id === selectedAllocation.id) {
            return {
              ...item,
              allocation: item.allocation + 5000
            };
          }
          return item;
        })
      );
      
      toast("Treasury Map Updated!", {
        description: `Additional funds approved for ${selectedAllocation.name}`,
        icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Allocations Overview */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Scroll className="w-5 h-5 mr-2 text-studio-accent" />
            Treasury Maps
          </h2>
          <Button size="sm">Create New Map</Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Total Allocations: ${totalAllocated.toLocaleString()}</span>
            <span>Spent: ${totalSpent.toLocaleString()} ({Math.round((totalSpent/totalAllocated)*100)}%)</span>
          </div>
          <Progress value={(totalSpent/totalAllocated)*100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mapAllocations.map((allocation) => {
            const AllocationIcon = allocation.icon;
            const percentUsed = (allocation.spent / allocation.allocation) * 100;
            
            return (
              <motion.div
                key={allocation.id}
                className={`glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border ${
                  selectedAllocation?.id === allocation.id 
                    ? `border-2 border-${allocation.color}` 
                    : 'border-white/10 backdrop-blur-md'
                }`}
                whileHover={{ y: -5 }}
                onClick={() => handleAllocationClick(allocation)}
              >
                <div className="flex items-start">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1"
                    style={{ backgroundColor: `${allocation.color}20` }}
                  >
                    <AllocationIcon className="w-5 h-5" style={{ color: allocation.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{allocation.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{allocation.purpose}</p>
                    
                    <div className="mb-1">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${percentUsed}%`,
                            backgroundColor: allocation.color
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        ${allocation.spent.toLocaleString()} used
                      </span>
                      <span className="font-medium">
                        ${allocation.allocation.toLocaleString()} allocated
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Allocation Details */}
      <div className="glass-card p-6">
        {selectedAllocation ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Map Details</h2>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${selectedAllocation.color}20` }}
              >
                <selectedAllocation.icon className="w-5 h-5" style={{ color: selectedAllocation.color }} />
              </div>
            </div>
            
            <div 
              className="rounded-xl p-4 mb-4"
              style={{ background: `linear-gradient(135deg, white 0%, ${selectedAllocation.color}15 100%)` }}
            >
              <h3 className="text-2xl font-bold">{selectedAllocation.name}</h3>
              <p className="text-muted-foreground">{selectedAllocation.purpose}</p>
              
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Budget Usage</span>
                    <span className="font-medium">
                      {Math.round((selectedAllocation.spent/selectedAllocation.allocation)*100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(selectedAllocation.spent/selectedAllocation.allocation)*100}%`,
                        backgroundColor: selectedAllocation.color
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">Total Allocated</p>
                    <p className="font-bold">${selectedAllocation.allocation.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Spent</p>
                    <p className="font-bold">${selectedAllocation.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-bold">
                      ${(selectedAllocation.allocation - selectedAllocation.spent).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Magical Map Representation */}
            <div className="bg-studio-sand/10 rounded-xl p-4 mb-4 relative overflow-hidden">
              <div className="flex items-center mb-3">
                <Map className="w-4 h-4 mr-2 text-studio-accent" />
                <h4 className="font-medium">Magical Destinations</h4>
              </div>
              
              <div className="relative">
                {/* Animated map path */}
                <svg className="w-full h-36" viewBox="0 0 300 100">
                  <path 
                    d="M20,50 C60,30 140,80 280,50" 
                    fill="none" 
                    stroke={selectedAllocation.color}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  
                  {/* Start point */}
                  <circle cx="20" cy="50" r="6" fill="#FFF" stroke={selectedAllocation.color} strokeWidth="2" />
                  
                  {/* Waypoints */}
                  <circle cx="100" cy="40" r="4" fill={selectedAllocation.color} opacity="0.5" />
                  <circle cx="180" cy="70" r="4" fill={selectedAllocation.color} opacity="0.5" />
                  
                  {/* End point (destination) */}
                  <circle cx="280" cy="50" r="8" fill={selectedAllocation.color} />
                  <circle cx="280" cy="50" r="12" fill={selectedAllocation.color} opacity="0.2" className="animate-ping" />
                </svg>
                
                <div className="flex justify-between text-xs">
                  <div className="text-center">
                    <Wallet className="w-4 h-4 mx-auto mb-1" />
                    <p>Treasury</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-4 h-4 mx-auto mb-1" style={{ color: selectedAllocation.color }} />
                    <p>Destination</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-2 right-2 opacity-20">
                <Sparkles className="w-6 h-6" style={{ color: selectedAllocation.color }} />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setSelectedAllocation(null)}
                >
                  View All Maps
                </Button>
                <Button 
                  className="w-full"
                  onClick={approveAdditionalFunds}
                >
                  Approve More Funds
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Scroll className="h-12 w-12 text-studio-sand mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a Treasury Map</h3>
            <p className="text-muted-foreground text-sm">
              Click on any allocation to view its magical map and destinations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasureMap;
