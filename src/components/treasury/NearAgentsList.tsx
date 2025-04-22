
import React from "react";
import { nearAgents } from "./NearAgentsData";
import AgentDirectoryCard from "./AgentDirectoryCard";

const NearAgentsList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nearAgents.map(agent => (
        <AgentDirectoryCard 
          key={agent.id} 
          agent={agent} 
        />
      ))}
    </div>
  );
};

export default NearAgentsList;
