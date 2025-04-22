
import React from "react";
import { motion } from "framer-motion";
import { Star, BadgeDollarSign, Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCard } from "./AgentCard";
import { AgentListItem } from "./AgentListItem";
import { agents } from "./mockData";

interface AgentCatalogProps {
  viewMode: "grid" | "list";
  searchQuery: string;
  selectedCategory: string;
}

const AgentCatalog: React.FC<AgentCatalogProps> = ({ 
  viewMode, 
  searchQuery,
  selectedCategory 
}) => {
  // Filter agents based on search query and selected category
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchQuery === "" || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'} Available
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-studio-accent">
            <BadgeDollarSign className="h-4 w-4 mr-1" />
            Price
          </Button>
          <Button variant="ghost" size="sm" className="text-studio-accent">
            <Star className="h-4 w-4 mr-1" />
            Rating
          </Button>
          <Button variant="ghost" size="sm" className="text-studio-accent">
            <Zap className="h-4 w-4 mr-1" />
            Popular
          </Button>
        </div>
      </div>

      {filteredAgents.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }
        >
          {filteredAgents.map((agent) => (
            viewMode === "grid" ? (
              <AgentCard key={agent.id} agent={agent} />
            ) : (
              <AgentListItem key={agent.id} agent={agent} />
            )
          ))}
        </motion.div>
      ) : (
        <div className="bg-muted/30 rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No agents found matching your criteria.</p>
          <Button variant="link" className="mt-2">Clear filters</Button>
        </div>
      )}
    </div>
  );
};

export default AgentCatalog;
