import { useMemo } from "react";
import { BarChart3, Megaphone, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformOverview } from "@/hooks/usePlatformOverview";

interface ContentMetricRow {
  metric_date: string;
  assets_created: number;
  assets_published: number;
}

interface RightsMetricRow {
  metric_date: string;
  new_assets: number;
  active_licenses: number;
  agreements_signed: number;
  transfers_completed: number;
  royalty_revenue: number;
}

interface LaunchMetricRow {
  metric_date: string;
  launches_created: number;
  launches_published: number;
  bridge_jobs_completed: number;
  gross_revenue: number;
}

interface CampaignMetricRow {
  metric_date: string;
  campaigns_started: number;
  posts_published: number;
  engagement_total: number;
}

const StatCard = ({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: typeof BarChart3;
}) => (
  <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-xs text-white/50">{sublabel}</p>
        </div>
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </CardContent>
  </Card>
);

const Analytics = () => {
  const { data: overview } = usePlatformOverview();
  const { data: contentMetrics = [] } = useQuery({
    queryKey: ["analytics", "content-metrics"],
    queryFn: async (): Promise<ContentMetricRow[]> => {
      const { data, error } = await supabase
        .from("content_metrics_daily")
        .select("metric_date, assets_created, assets_published")
        .order("metric_date", { ascending: false })
        .limit(14);
      if (error) throw error;
      return (data ?? []) as ContentMetricRow[];
    },
  });
  const { data: rightsMetrics = [] } = useQuery({
    queryKey: ["analytics", "rights-metrics"],
    queryFn: async (): Promise<RightsMetricRow[]> => {
      const { data, error } = await supabase
        .from("rights_metrics_daily")
        .select("metric_date, new_assets, active_licenses, agreements_signed, transfers_completed, royalty_revenue")
        .order("metric_date", { ascending: false })
        .limit(14);
      if (error) throw error;
      return (data ?? []) as RightsMetricRow[];
    },
  });
  const { data: launchMetrics = [] } = useQuery({
    queryKey: ["analytics", "launch-metrics"],
    queryFn: async (): Promise<LaunchMetricRow[]> => {
      const { data, error } = await supabase
        .from("launch_metrics_daily")
        .select("metric_date, launches_created, launches_published, bridge_jobs_completed, gross_revenue")
        .order("metric_date", { ascending: false })
        .limit(14);
      if (error) throw error;
      return (data ?? []) as LaunchMetricRow[];
    },
  });
  const { data: campaignMetrics = [] } = useQuery({
    queryKey: ["analytics", "campaign-metrics"],
    queryFn: async (): Promise<CampaignMetricRow[]> => {
      const { data, error } = await supabase
        .from("campaign_metrics_daily")
        .select("metric_date, campaigns_started, posts_published, engagement_total")
        .order("metric_date", { ascending: false })
        .limit(14);
      if (error) throw error;
      return (data ?? []) as CampaignMetricRow[];
    },
  });

  const totals = useMemo(
    () => ({
      assetsCreated: contentMetrics.reduce((sum, row) => sum + Number(row.assets_created ?? 0), 0),
      assetsPublished: contentMetrics.reduce((sum, row) => sum + Number(row.assets_published ?? 0), 0),
      royaltyRevenue: rightsMetrics.reduce((sum, row) => sum + Number(row.royalty_revenue ?? 0), 0),
      launchesPublished: launchMetrics.reduce((sum, row) => sum + Number(row.launches_published ?? 0), 0),
      bridgeJobsCompleted: launchMetrics.reduce((sum, row) => sum + Number(row.bridge_jobs_completed ?? 0), 0),
      postsPublished: campaignMetrics.reduce((sum, row) => sum + Number(row.posts_published ?? 0), 0),
      engagementTotal: campaignMetrics.reduce((sum, row) => sum + Number(row.engagement_total ?? 0), 0),
    }),
    [campaignMetrics, contentMetrics, launchMetrics, rightsMetrics],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/15 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Platform Analytics</h1>
              <p className="mt-1 text-sm text-white/60">
                Unified rollups for content, rights, launches, bridge activity, and marketing distribution.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Content Assets"
            value={String(overview?.content?.total_assets ?? totals.assetsCreated)}
            sublabel={`${totals.assetsPublished} published in recent metrics`}
            icon={BarChart3}
          />
          <StatCard
            label="Rights Revenue"
            value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totals.royaltyRevenue)}
            sublabel={`${overview?.content?.ip_assets ?? 0} IP assets connected`}
            icon={ShieldCheck}
          />
          <StatCard
            label="Launches"
            value={String(overview?.content?.launches ?? totals.launchesPublished)}
            sublabel={`${totals.bridgeJobsCompleted} bridge jobs completed`}
            icon={Rocket}
          />
          <StatCard
            label="Distribution"
            value={String(overview?.marketing?.published_posts ?? totals.postsPublished)}
            sublabel={`${totals.engagementTotal.toLocaleString()} engagements tracked`}
            icon={Megaphone}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Daily Platform Rollups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contentMetrics.map((row) => {
                const rights = rightsMetrics.find((metric) => metric.metric_date === row.metric_date);
                const launch = launchMetrics.find((metric) => metric.metric_date === row.metric_date);
                const campaign = campaignMetrics.find((metric) => metric.metric_date === row.metric_date);
                return (
                  <div key={row.metric_date} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-medium text-white">{new Date(row.metric_date).toLocaleDateString()}</p>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        consolidated
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs text-white/50">Content</p>
                        <p className="text-sm text-white">{row.assets_created} created / {row.assets_published} published</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Rights</p>
                        <p className="text-sm text-white">
                          {(rights?.active_licenses ?? 0)} active / {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(rights?.royalty_revenue ?? 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Launch</p>
                        <p className="text-sm text-white">
                          {(launch?.launches_published ?? 0)} live / {(launch?.bridge_jobs_completed ?? 0)} bridged
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Marketing</p>
                        <p className="text-sm text-white">
                          {(campaign?.posts_published ?? 0)} posts / {(campaign?.engagement_total ?? 0).toLocaleString()} engagement
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!contentMetrics.length ? <p className="text-sm text-white/60">No analytics rows yet.</p> : null}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Current Backend Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Content + IP</p>
                <p className="mt-2 text-sm text-white/60">
                  {overview?.content?.published_assets ?? 0} published assets, {overview?.content?.ip_assets ?? 0} IP assets, and {overview?.content?.launches ?? 0} launches in the canonical asset catalog.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Marketing + Distribution</p>
                <p className="mt-2 text-sm text-white/60">
                  {overview?.marketing?.active_campaigns ?? 0} active campaigns, {overview?.marketing?.scheduled_posts ?? 0} scheduled posts, and {overview?.marketing?.connected_channels ?? 0} connected channels.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Finance + Agents</p>
                <p className="mt-2 text-sm text-white/60">
                  {overview?.finance?.pending_statements ?? 0} pending statements, {overview?.agents?.installed_agents ?? 0} installed agents, and {overview?.agents?.connected_integrations ?? 0} integration accounts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
