import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Agent } from "./types";

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  // Animation variants for the individual card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden flex flex-col hover:shadow-card-glow transition-all duration-300"
    >
      <div 
        className="h-32 bg-cover bg-center p-3 flex flex-col justify-between"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${agent.image})` 
        }}
      >
        <div className="flex justify-between">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {agent.category === "creative" ? "Creative" :
             agent.category === "art" ? "Art" :
             agent.category === "code" ? "Code" :
             agent.category === "conversation" ? "Chat" :
             agent.category === "research" ? "Research" : 
             "AI"}
          </span>
          
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
            <BadgeDollarSign className="h-3 w-3 mr-1" />
            {agent.price === "Free" ? "Free" : 
             agent.price === "Paid" ? "Paid" : 
             agent.price === "Freemium" ? "Freemium" : agent.price}
          </span>
        </div>
        
        <h3 className="text-white font-medium text-shadow-sm">{agent.name}</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < parseInt(agent.rating) ? "text-amber-400" : "text-white/30"}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-white/70 ml-1">({agent.reviews})</span>
          </div>
          <span className="text-xs text-white/70">{agent.provider}</span>
        </div>
        
        <p className="text-sm text-white/80 mb-3 line-clamp-2 flex-1 text-shadow-sm">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <Button variant="link" className="p-0 h-auto text-sm font-normal text-studio-accent">
            Learn more
          </Button>
          <Button size="sm" className="gap-1 bg-studio-accent hover:bg-studio-accent/90 text-white">
            <span>Try Agent</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};