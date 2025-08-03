
import React from "react";
import { Button } from "@/components/ui/button";
import { Agent } from "@/components/marketplace/types";

interface AgentDirectoryCardProps {
  agent: Agent;
}

const AgentDirectoryCard: React.FC<AgentDirectoryCardProps> = ({ agent }) => {
  return (
    <div className="glass-card rounded-lg border border-white/10 backdrop-blur-md p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div 
          className="h-12 w-12 rounded-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${agent.image})` 
          }}
        />
        <div className="flex-1">
          <h3 className="font-medium">{agent.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
          <div className="flex mt-2 gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {agent.category}
            </span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center">
              {agent.price}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button variant="link" size="sm" className="text-xs p-0 h-auto">View Details</Button>
      </div>
    </div>
  );
};

export default AgentDirectoryCard;
