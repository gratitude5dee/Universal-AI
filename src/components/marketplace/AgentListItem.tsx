import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Agent } from "./types";

interface AgentListItemProps {
  agent: Agent;
}

export const AgentListItem: React.FC<AgentListItemProps> = ({ agent }) => {
  // Animation variants for the list item
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-card-glow transition-all duration-300"
    >
      <div 
        className="h-24 md:h-auto md:w-32 bg-cover bg-center rounded-lg shrink-0"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${agent.image})` 
        }}
      />
      
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-1">
          <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-white/80">
            {agent.category === "creative" ? "Creative" :
             agent.category === "art" ? "Art" :
             agent.category === "code" ? "Code" :
             agent.category === "conversation" ? "Chat" :
             agent.category === "research" ? "Research" : 
             "AI"}
          </span>
          
          <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full flex items-center text-white/80">
            <BadgeDollarSign className="h-3 w-3 mr-1" />
            {agent.price}
          </span>
          
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < parseInt(agent.rating) ? "text-amber-400" : "text-white/30"}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-white/70 ml-1">({agent.reviews})</span>
          </div>
        </div>
        
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-white text-shadow-sm">{agent.name}</h3>
          <span className="text-xs text-white/70">{agent.provider}</span>
        </div>
        
        <p className="text-sm text-white/80 my-2 text-shadow-sm">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
              {tag}
            </span>
          ))}
          {agent.tags.length > 4 && (
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
              +{agent.tags.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      <div className="flex md:flex-col justify-between items-center gap-2 md:w-28 shrink-0">
        <Button variant="outline" size="sm" className="w-full gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
          <span>Details</span>
        </Button>
        <Button size="sm" className="w-full gap-1 bg-studio-accent hover:bg-studio-accent/90 text-white">
          <span>Try Agent</span>
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};