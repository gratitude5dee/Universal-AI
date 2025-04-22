
import React from "react";
import { autonomasAgents } from "./AutonolasAgentsData";
import AgentDirectoryCard from "./AgentDirectoryCard";

const AutonolasAgentsList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {autonomasAgents.map(agent => (
        <AgentDirectoryCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AutonolasAgentsList;
