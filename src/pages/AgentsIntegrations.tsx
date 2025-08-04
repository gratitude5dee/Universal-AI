import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  Settings,
  Clock,
  Star,
  CheckCircle
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
      color: "bg-blue-500",
      tasksCompleted: 47
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
      color: "bg-green-500",
      tasksCompleted: 32
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
      color: "bg-purple-500",
      tasksCompleted: 128
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
      color: "bg-orange-500",
      tasksCompleted: 18
    }
  ];

  const QuickActions = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleTabChange("create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Plus className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">New Agent</h3>
              <p className="text-blue-lightest/70 text-sm">Create automation</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleTabChange("marketplace")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Store className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Browse Market</h3>
              <p className="text-blue-lightest/70 text-sm">Find solutions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleTabChange("integrations")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Add Integration</h3>
              <p className="text-blue-lightest/70 text-sm">Connect services</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => handleTabChange("observability")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <Settings className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Monitor</h3>
              <p className="text-blue-lightest/70 text-sm">Check performance</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Clock className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Active Agents</h3>
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">4</div>
              <div className="text-sm text-green-400">Ready to work</div>
              <div className="text-xs text-blue-lightest/70">Next: Check performance</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Tasks Completed</h3>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">225</div>
              <div className="text-sm text-green-400">This week</div>
              <div className="text-xs text-blue-lightest/70">Last 7 days</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Integrations</h3>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-sm text-green-400">Connected</div>
              <div className="text-xs text-blue-lightest/70">This month</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Efficiency</h3>
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">93%</div>
              <div className="text-sm text-green-400">Avg performance</div>
              <div className="text-xs text-blue-lightest/70">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MainContent = () => {
    if (currentTab !== "collection") {
      return (
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            <Clock className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${agent.color}/20 flex items-center justify-center`}>
                          <agent.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{agent.name}</h3>
                          <p className="text-blue-lightest/70 text-sm">{agent.description}</p>
                          <p className="text-xs text-blue-lightest/50 mt-1">Last activity: {agent.lastActivity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={agent.status === "active" ? "default" : "secondary"}
                          className={agent.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30"}
                        >
                          {agent.status}
                        </Badge>
                        <p className="text-xs text-blue-lightest/70 mt-2">{agent.tasksCompleted} tasks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div>
          <div className="flex items-center mb-6">
            <CheckCircle className="h-5 w-5 text-white mr-2" />
            <h2 className="text-lg font-semibold text-white">Getting Started</h2>
          </div>
          <div className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Create Your First Agent</h3>
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Start automating your workflows</p>
                <Button 
                  className="w-full bg-blue-primary hover:bg-blue-primary/80 text-white"
                  onClick={() => handleTabChange("create")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Connect Integrations</h3>
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Link your favorite tools</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => handleTabChange("integrations")}
                >
                  Browse Integrations
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Monitor Performance</h3>
                  <Activity className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-blue-lightest/70 text-sm mb-4">Track your agent efficiency</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => handleTabChange("observability")}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          </div>
          <p className="text-blue-lightest/70">Ready to automate and streamline your workflows</p>
        </div>

        <QuickActions />
        <PerformanceMetrics />
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 rounded-lg p-1 mb-8">
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
          
          <MainContent />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentsIntegrations;