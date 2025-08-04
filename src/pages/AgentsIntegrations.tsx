import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Store, 
  Calendar, 
  CreditCard, 
  Globe, 
  Shield, 
  Zap, 
  Eye,
  Activity,
  TrendingUp,
  Users,
  Settings
} from "lucide-react";

// Import existing components
import AgentMarketplace from "./AgentMarketplace";
import CreateAgent from "./CreateAgent";
import AgentBanking from "@/components/treasury/AgentBanking";
import Observability from "./Observability";
import Integrations from "./Integrations";

const AgentsIntegrations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("collection");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = ["collection", "marketplace", "create", "banking", "integrations", "observability"];
    if (tab && validTabs.includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("collection");
      navigate(`${location.pathname}?tab=collection`, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/agents-integrations?tab=${value}`, { replace: true });
  };

  // Mock agent data
  const agents = [
    {
      id: "1",
      name: "Booking Agent",
      type: "booking",
      status: "active",
      lastActivity: "2 hours ago",
      performance: 95,
      description: "Automates venue bookings and tour scheduling",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      id: "2", 
      name: "Invoice Agent",
      type: "invoice",
      status: "active",
      lastActivity: "1 hour ago",
      performance: 88,
      description: "Handles invoice generation and payment tracking",
      icon: CreditCard,
      color: "bg-green-500"
    },
    {
      id: "3",
      name: "Social Media Agent", 
      type: "social",
      status: "paused",
      lastActivity: "1 day ago",
      performance: 92,
      description: "Manages social media content and engagement",
      icon: Globe,
      color: "bg-purple-500"
    },
    {
      id: "4",
      name: "Contract Agent",
      type: "contract", 
      status: "active",
      lastActivity: "30 minutes ago",
      performance: 97,
      description: "Reviews and processes legal contracts",
      icon: Shield,
      color: "bg-orange-500"
    }
  ];

  const AgentCard = ({ agent }: { agent: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-blue-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${agent.color}/20`}>
                <agent.icon className={`h-5 w-5 text-white`} />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                <CardDescription className="text-blue-lightest/70">
                  {agent.description}
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={agent.status === "active" ? "default" : "secondary"}
              className={agent.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30"}
            >
              {agent.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-lightest/70">Performance</span>
              <span className="text-sm font-medium text-white">{agent.performance}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-primary to-studio-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${agent.performance}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-lightest/70">Last activity: {agent.lastActivity}</span>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-primary" />
            <div>
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-sm text-blue-lightest/70">Active Agents</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">93%</p>
              <p className="text-sm text-blue-lightest/70">Avg Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">247</p>
              <p className="text-sm text-blue-lightest/70">Tasks Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-sm text-blue-lightest/70">Integrations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <Content 
        title="Agents + Integrations" 
        subtitle="Manage your AI workforce and third-party integrations"
      >
        <QuickStats />
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white/10 border border-white/20 rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="collection" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Bot className="h-4 w-4 mr-2" />
              My Collection
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Store className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </TabsTrigger>
            <TabsTrigger 
              value="banking" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Banking
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Zap className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger 
              value="observability" 
              className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-primary data-[state=active]:shadow-blue-glow"
            >
              <Eye className="h-4 w-4 mr-2" />
              Observability
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="collection" className="outline-none">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Your AI Agent Collection</h3>
                    <p className="text-blue-lightest/70">Manage and monitor your autonomous agents</p>
                  </div>
                  <Button className="bg-blue-primary hover:bg-blue-primary/80 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Agent
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="marketplace" className="outline-none">
              <AgentMarketplace />
            </TabsContent>
            
            <TabsContent value="create" className="outline-none">
              <CreateAgent />
            </TabsContent>
            
            <TabsContent value="banking" className="outline-none">
              <AgentBanking />
            </TabsContent>
            
            <TabsContent value="integrations" className="outline-none">
              <Integrations />
            </TabsContent>
            
            <TabsContent value="observability" className="outline-none">
              <Observability />
            </TabsContent>
          </motion.div>
        </Tabs>
      </Content>
    </DashboardLayout>
  );
};

export default AgentsIntegrations;