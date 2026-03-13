import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, CreditCard, Eye, Plus, Store, Zap } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AgentsControlPlane } from "@/components/agents/AgentsControlPlane";
import AgentBanking from "@/components/treasury/AgentBanking";
import Integrations from "./Integrations";
import { usePlatformOverview } from "@/hooks/usePlatformOverview";

const tabConfig = [
  { value: "collection", label: "My Collection", icon: Bot },
  { value: "marketplace", label: "Marketplace", icon: Store },
  { value: "create", label: "Create Agent", icon: Plus },
  { value: "banking", label: "Banking", icon: CreditCard },
  { value: "integrations", label: "Integrations", icon: Zap },
  { value: "observability", label: "Observability", icon: Eye },
];

const AgentsIntegrations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("collection");
  const { data: overview } = usePlatformOverview();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = tabConfig.map((item) => item.value);
    if (tab && validTabs.includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("collection");
      navigate(`${location.pathname}?tab=collection`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/agents-integrations?tab=${value}`, { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents + Integrations</h1>
          <p className="mt-2 text-sm text-white/60">
            Agent creation, installs, runs, marketplace listings, integration control, treasury workflows, and observability now resolve against real backend entities.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Active agents</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.agents?.active_agents ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">From the core `agents` table</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Installed agents</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.agents?.installed_agents ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">Tracked in `agent_installs`</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Connected integrations</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.agents?.connected_integrations ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">Integration accounts online</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Successful runs</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.agents?.successful_runs ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">{overview?.agents?.failed_runs ?? 0} failed run(s)</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="h-auto w-full flex-wrap gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="collection" className="mt-6">
            <AgentsControlPlane tab="collection" />
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6">
            <AgentsControlPlane tab="marketplace" />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
            <AgentsControlPlane tab="create" />
          </TabsContent>
          <TabsContent value="banking" className="mt-6">
            <AgentBanking />
          </TabsContent>
          <TabsContent value="integrations" className="mt-6">
            <Integrations />
          </TabsContent>
          <TabsContent value="observability" className="mt-6">
            <AgentsControlPlane tab="observability" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentsIntegrations;
