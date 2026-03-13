import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, DollarSign, Rocket, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LaunchMetricRow {
  metric_date: string;
  launches_created: number;
  launches_published: number;
  bridge_jobs_completed: number;
  gross_revenue: number;
}

interface EngagementRow {
  metric_date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue_amount: number;
}

interface PublicationRow {
  id: string;
  marketplace_listing_id: string;
  publication_status: string;
  url: string | null;
  external_id: string | null;
  published_at: string | null;
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount ?? 0));

const statusTone = (status: string) => {
  switch (status) {
    case "published":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "queued":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "failed":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof BarChart3;
}) => (
  <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-xs text-white/50">{subtitle}</p>
        </div>
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </CardContent>
  </Card>
);

export const DistributionAnalytics = () => {
  const { data: launchMetrics = [] } = useQuery({
    queryKey: ["bridge", "launch-metrics"],
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

  const { data: engagement = [] } = useQuery({
    queryKey: ["bridge", "engagement"],
    queryFn: async (): Promise<EngagementRow[]> => {
      const { data, error } = await supabase
        .from("launch_engagement_snapshots")
        .select("metric_date, views, likes, comments, shares, revenue_amount")
        .order("metric_date", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as EngagementRow[];
    },
  });

  const { data: publications = [] } = useQuery({
    queryKey: ["bridge", "publications"],
    queryFn: async (): Promise<PublicationRow[]> => {
      const { data, error } = await supabase
        .from("marketplace_publications")
        .select("id, marketplace_listing_id, publication_status, url, external_id, published_at")
        .order("published_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as PublicationRow[];
    },
  });

  const totals = useMemo(
    () => ({
      launchesPublished: launchMetrics.reduce((sum, row) => sum + Number(row.launches_published ?? 0), 0),
      bridgeJobsCompleted: launchMetrics.reduce((sum, row) => sum + Number(row.bridge_jobs_completed ?? 0), 0),
      grossRevenue: launchMetrics.reduce((sum, row) => sum + Number(row.gross_revenue ?? 0), 0),
      totalViews: engagement.reduce((sum, row) => sum + Number(row.views ?? 0), 0),
      totalShares: engagement.reduce((sum, row) => sum + Number(row.shares ?? 0), 0),
    }),
    [engagement, launchMetrics],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Launches Published" value={String(totals.launchesPublished)} subtitle="All live launches in the selected window" icon={Rocket} />
        <StatCard title="Bridge Jobs Settled" value={String(totals.bridgeJobsCompleted)} subtitle="Completed transfers from launch_metrics_daily" icon={BarChart3} />
        <StatCard title="Gross Revenue" value={money(totals.grossRevenue)} subtitle="Launch + marketplace revenue snapshot" icon={DollarSign} />
        <StatCard title="Audience Reach" value={totals.totalViews.toLocaleString()} subtitle={`${totals.totalShares.toLocaleString()} shares recorded`} icon={Share2} />
      </div>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Daily launch performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {launchMetrics.length ? (
            launchMetrics.map((row) => {
              const snapshot = engagement.find((item) => item.metric_date === row.metric_date);
              return (
                <div key={row.metric_date} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs text-white/50">Date</p>
                    <p className="text-sm font-medium text-white">{new Date(row.metric_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Launches</p>
                    <p className="text-sm font-medium text-white">{row.launches_created} created / {row.launches_published} published</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Bridge jobs</p>
                    <p className="text-sm font-medium text-white">{row.bridge_jobs_completed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Engagement</p>
                    <p className="text-sm font-medium text-white">
                      {(snapshot?.views ?? 0).toLocaleString()} views / {(snapshot?.likes ?? 0) + (snapshot?.comments ?? 0)} reactions
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Revenue</p>
                    <p className="text-sm font-medium text-white">{money(row.gross_revenue ?? 0)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-white/60">No launch analytics rows yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Marketplace publications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {publications.length ? (
            publications.map((publication) => (
              <div key={publication.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">{publication.marketplace_listing_id}</p>
                  <p className="mt-1 text-sm text-white/60">
                    {publication.external_id ?? "No external id"} • {publication.published_at ? new Date(publication.published_at).toLocaleString() : "Not published"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusTone(publication.publication_status)}>{publication.publication_status}</Badge>
                  {publication.url ? (
                    <a href={publication.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:opacity-80">
                      open
                    </a>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No marketplace publications yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
