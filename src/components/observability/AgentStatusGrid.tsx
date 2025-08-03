
import React from "react";
import { Bot, CircleCheck, Clock, AlertTriangle } from "lucide-react";

type AgentStatus = "active" | "idle" | "warning";

interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  lastActive: string;
  type: string;
}

const getStatusIcon = (status: AgentStatus) => {
  switch (status) {
    case "active":
      return <CircleCheck className="h-5 w-5 text-green-500" />;
    case "idle":
      return <Clock className="h-5 w-5 text-amber-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusClass = (status: AgentStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "idle":
      return "bg-amber-100 text-amber-700";
    case "warning":
      return "bg-red-100 text-red-700";
  }
};

export const AgentStatusGrid = () => {
  const agents: Agent[] = [
    { id: "1", name: "Storyteller", status: "active", lastActive: "Just now", type: "Creator" },
    { id: "2", name: "Imaginator", status: "active", lastActive: "2m ago", type: "Designer" },
    { id: "3", name: "DataWeaver", status: "idle", lastActive: "15m ago", type: "Analyst" },
    { id: "4", name: "VoxSage", status: "warning", lastActive: "1h ago", type: "Musicist" },
    { id: "5", name: "CodeCrafter", status: "active", lastActive: "5m ago", type: "Developer" },
  ];

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div key={agent.id} className="flex items-center justify-between p-3 glass-card border border-white/10 backdrop-blur-md rounded-xl">
          <div className="flex items-center">
            <div className="bg-studio-accent/10 p-2 rounded-lg mr-3">
              <Bot className="h-4 w-4 text-studio-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{agent.name}</h4>
              <p className="text-xs text-muted-foreground">{agent.type}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full mr-2 ${getStatusClass(agent.status)}`}>
              {agent.status}
            </span>
            {getStatusIcon(agent.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
