import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Globe, Link, Music, Share2, Tv, User } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformOverview } from "@/hooks/usePlatformOverview";
import { MarketingOperationsHub } from "@/components/distribution/MarketingOperationsHub";

interface ChannelAccountRow {
  id: string;
  provider_id: string;
  status: string;
}

interface CampaignRow {
  id: string;
  name: string;
  status: string;
  objective: string | null;
}

const tabConfig = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "social-media", label: "Social Media", icon: Globe },
  { value: "on-chain", label: "On-Chain", icon: Link },
  { value: "media-channels", label: "Media Channels", icon: Tv },
  { value: "independent", label: "Independent", icon: User },
  { value: "sync-licensing", label: "Sync Licensing", icon: Music },
];

const MarketingDistribution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  const { data: overview } = usePlatformOverview();

  const { data: channels = [] } = useQuery({
    queryKey: ["marketing", "page-channels"],
    queryFn: async (): Promise<ChannelAccountRow[]> => {
      const { data, error } = await supabase
        .from("channel_accounts")
        .select("id, provider_id, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ChannelAccountRow[];
    },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["marketing", "page-campaigns"],
    queryFn: async (): Promise<CampaignRow[]> => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("id, name, status, objective")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CampaignRow[];
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = tabConfig.map((item) => item.value);
    if (tab && validTabs.includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("overview");
      navigate(`${location.pathname}?tab=overview`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/marketing-distribution?tab=${value}`, { replace: true });
  };

  const channelSummary = useMemo(() => {
    const groups = new Map<string, number>();
    for (const channel of channels) {
      groups.set(channel.provider_id, (groups.get(channel.provider_id) ?? 0) + 1);
    }
    return Array.from(groups.entries()).slice(0, 6);
  }, [channels]);

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing & Distribution</h1>
          <p className="mt-2 text-sm text-white/60">
            Campaign dispatch, channel connectivity, community messaging, on-chain distribution, and sync licensing all persist to the backend control plane.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Active campaigns</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.marketing?.active_campaigns ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">{campaigns.length} total campaign records</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Scheduled posts</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.marketing?.scheduled_posts ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">Queued across provider-specific targets</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Published posts</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.marketing?.published_posts ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">Metrics ingest lands in `published_posts`</p>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">Connected channels</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview?.marketing?.connected_channels ?? 0}</p>
              <p className="mt-2 text-xs text-white/50">Provider accounts currently tracked</p>
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

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Channel mix</h2>
                      <p className="text-sm text-white/60">Real provider accounts connected through `channel_accounts`.</p>
                    </div>
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  {channelSummary.length ? (
                    channelSummary.map(([providerId, count]) => (
                      <div key={providerId} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                        <div>
                          <p className="font-medium text-white">{providerId}</p>
                          <p className="text-sm text-white/60">{count} connected account(s)</p>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-white/70">
                          connected
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No channel accounts connected yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Recent campaigns</h2>
                      <p className="text-sm text-white/60">Latest campaign records stored in `marketing_campaigns`.</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  {campaigns.length ? (
                    campaigns.slice(0, 8).map((campaign) => (
                      <div key={campaign.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{campaign.name}</p>
                            <p className="mt-1 text-sm text-white/60">{campaign.objective ?? "No stated objective"}</p>
                          </div>
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No campaigns created yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {tabConfig.filter((tab) => tab.value !== "overview").map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <MarketingOperationsHub tab={tab.value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MarketingDistribution;
