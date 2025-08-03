
import React, { useState } from "react";
import { motion } from "framer-motion";
import { HardDrive, Cpu, Network, Database, BarChart2, HelpCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ResourceItemProps {
  name: string;
  icon: React.ReactNode;
  currentUsage: number;
  capacity: number;
  trend: "increasing" | "stable" | "decreasing";
  unit: string;
  description: string;
}

export const ResourceCapacity = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [resources, setResources] = useState<ResourceItemProps[]>([
    {
      name: "Compute",
      icon: <Cpu className="h-5 w-5 text-studio-accent" />,
      currentUsage: 42,
      capacity: 100,
      trend: "stable",
      unit: "CPU cores",
      description: "Processing power for your AI workflows"
    },
    {
      name: "Storage",
      icon: <HardDrive className="h-5 w-5 text-studio-accent" />,
      currentUsage: 68,
      capacity: 100,
      trend: "increasing",
      unit: "TB",
      description: "Space for your creative assets and data"
    },
    {
      name: "Network",
      icon: <Network className="h-5 w-5 text-studio-accent" />,
      currentUsage: 35,
      capacity: 100,
      trend: "stable",
      unit: "Gbps",
      description: "Connection speed for data transfers"
    },
    {
      name: "Database",
      icon: <Database className="h-5 w-5 text-studio-accent" />,
      currentUsage: 76,
      capacity: 100,
      trend: "increasing",
      unit: "tables",
      description: "Organized storage for structured information"
    }
  ]);

  const optimizeResources = () => {
    setIsOptimizing(true);
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setResources(prev => 
            prev.map(resource => ({
              ...resource,
              currentUsage: Math.max(20, resource.currentUsage - Math.floor(Math.random() * 15)),
              trend: "decreasing" as const
            }))
          );
          setIsOptimizing(false);
          resolve(true);
        }, 2500);
      }),
      {
        loading: "Optimizing resources...",
        success: "Resources optimized successfully!",
        error: "Optimization encountered an issue"
      }
    );
  };
  
  const addCapacity = (resourceIndex: number) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setResources(prev => 
            prev.map((resource, idx) => 
              idx === resourceIndex 
                ? {...resource, capacity: resource.capacity + 25} 
                : resource
            )
          );
          resolve(true);
        }, 1500);
      }),
      {
        loading: "Adding capacity...",
        success: "Capacity added successfully!",
        error: "Failed to add capacity"
      }
    );
  };
  
  const getTrendIcon = (trend: "increasing" | "stable" | "decreasing") => {
    switch (trend) {
      case "increasing":
        return <Plus className="h-3 w-3 text-amber-500" />;
      case "decreasing":
        return <Minus className="h-3 w-3 text-green-500" />;
      default:
        return <span className="w-3 h-3 inline-block rounded-full bg-blue-400"></span>;
    }
  };
  
  const getUsageColor = (usage: number) => {
    if (usage < 50) return "bg-green-500";
    if (usage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const usagePrediction = resources.some(r => r.currentUsage > 75) ? 
    "Your storage usage is growing quickly. Consider adding capacity within 30 days." : 
    "Current resource usage is healthy and sustainable.";

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-medium mb-2 flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-studio-accent" />
              Resource Garden
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Monitor how your resources grow and flourish. Each bar represents a resource in your creative garden.
              As usage increases, the bar fills. Keep your garden healthy by maintaining balanced resource usage.
            </p>
          </div>
          <Button 
            onClick={optimizeResources} 
            disabled={isOptimizing}
            className="bg-studio-accent hover:bg-studio-accent/90"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Optimize Resources
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-studio-accent/10 rounded-lg">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-studio-accent" />
            <p className="text-sm font-medium">Resource Prediction</p>
          </div>
          <p className="text-sm mt-1 ml-7">{usagePrediction}</p>
        </div>
      </div>
      
      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, idx) => (
          <motion.div
            key={resource.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-studio-accent/10 p-2 rounded-lg">
                  {resource.icon}
                </div>
                <div>
                  <h3 className="font-medium">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">{Math.floor(resource.currentUsage / resource.capacity * 100)}%</span>
                {getTrendIcon(resource.trend)}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Current usage: {resource.currentUsage} {resource.unit}</span>
                <span>Capacity: {resource.capacity} {resource.unit}</span>
              </div>
              <Progress 
                value={(resource.currentUsage / resource.capacity) * 100} 
                indicatorClassName={getUsageColor(resource.currentUsage / resource.capacity * 100)} 
              />
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10 backdrop-blur-md">
              <div className="text-sm text-muted-foreground">
                {resource.trend === "increasing" ? "Trending upward" : 
                 resource.trend === "decreasing" ? "Trending downward" : 
                 "Stable usage"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCapacity(idx)}
                className="text-xs"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Capacity
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Recommendation Card */}
      <div className="glass-card p-6 mt-6 bg-gradient-to-r from-studio-cream to-studio-sand/30">
        <h3 className="text-lg font-medium mb-3">Resource Planning</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your current usage patterns, here are our recommendations for resource management:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-1.5 rounded-full">
              <Cpu className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Compute Optimization</h4>
              <p className="text-xs text-muted-foreground">
                Your compute usage is optimal. Continue with current capacity.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full">
              <HardDrive className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Storage Management</h4>
              <p className="text-xs text-muted-foreground">
                Consider archiving older assets to reduce storage needs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Database Growth</h4>
              <p className="text-xs text-muted-foreground">
                Your database is growing steadily. Plan for expansion in the next quarter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
