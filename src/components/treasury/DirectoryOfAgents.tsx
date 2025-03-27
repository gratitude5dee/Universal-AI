
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Users, Computer, Smartphone } from "lucide-react";
import NearAgentsList from "./NearAgentsList";
import AutonolasAgentsList from "./AutonolasAgentsList";

const DirectoryOfAgents: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-studio-accent" />
        Directory of Agents
      </h2>
      
      <Tabs defaultValue="near" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="near" className="flex-1 flex items-center justify-center">
            <User className="w-4 h-4 mr-2" />
            NEAR
          </TabsTrigger>
          <TabsTrigger value="autonolas" className="flex-1 flex items-center justify-center">
            <Users className="w-4 h-4 mr-2" />
            Autonolas
          </TabsTrigger>
          <TabsTrigger value="virtuals" className="flex-1 flex items-center justify-center">
            <Computer className="w-4 h-4 mr-2" />
            Virtuals
          </TabsTrigger>
          <TabsTrigger value="zerepy" className="flex-1 flex items-center justify-center">
            <Smartphone className="w-4 h-4 mr-2" />
            Zerepy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="near" className="space-y-4">
          <NearAgentsList />
        </TabsContent>
        
        <TabsContent value="autonolas" className="space-y-4">
          <AutonolasAgentsList />
        </TabsContent>
        
        <TabsContent value="virtuals" className="space-y-4">
          <div className="text-center py-6 text-blue-dark">
            <Computer className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Virtual agents will appear here soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="zerepy" className="space-y-4">
          <div className="text-center py-6 text-blue-dark">
            <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Zerepy agents will appear here soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DirectoryOfAgents;
