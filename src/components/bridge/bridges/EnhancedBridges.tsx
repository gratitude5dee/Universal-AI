import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ExternalLink, Link2, RefreshCcw, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface BridgeJobRow {
  id: string;
  content_item_id: string | null;
  source_asset_type: string;
  source_identifier: string | null;
  source_chain: string;
  destination_chain: string;
  destination_wallet: string;
  status: string;
  estimated_fee_usd: number | null;
  source_tx_hash: string | null;
  destination_tx_hash: string | null;
  created_at: string;
}

interface RouteRow {
  id: string;
  source_chain: string;
  destination_chain: string;
  bridge_provider: string;
  status: string;
}

interface ContentItemRow {
  id: string;
  title: string;
  file_type: string;
}

interface MultichainPositionRow {
  id: string;
  chain: string;
  asset_symbol: string;
  balance: number;
  usd_value: number;
}

const statusTone = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "queued":
    case "processing":
    case "submitted":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "failed":
    case "cancelled":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
};

export const EnhancedBridges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    contentItemId: "",
    sourceAssetType: "nft",
    sourceIdentifier: "",
    sourceChain: "solana",
    destinationChain: "base",
    bridgeProvider: "wormhole",
    destinationWallet: "",
    estimatedFeeUsd: "0",
  });

  const { data: contentItems = [] } = useQuery({
    queryKey: ["bridge", "content-items"],
    queryFn: async (): Promise<ContentItemRow[]> => {
      const { data, error } = await supabase
        .from("content_items")
        .select("id, title, file_type")
        .order("updated_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return (data ?? []) as ContentItemRow[];
    },
  });

  const { data: bridgeJobs = [] } = useQuery({
    queryKey: ["bridge", "jobs"],
    queryFn: async (): Promise<BridgeJobRow[]> => {
      const { data, error } = await supabase
        .from("bridge_jobs")
        .select("id, content_item_id, source_asset_type, source_identifier, source_chain, destination_chain, destination_wallet, status, estimated_fee_usd, source_tx_hash, destination_tx_hash, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as BridgeJobRow[];
    },
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["bridge", "routes"],
    queryFn: async (): Promise<RouteRow[]> => {
      const { data, error } = await supabase
        .from("bridge_routes")
        .select("id, source_chain, destination_chain, bridge_provider, status")
        .order("source_chain", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RouteRow[];
    },
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["bridge", "positions"],
    queryFn: async (): Promise<MultichainPositionRow[]> => {
      const { data, error } = await supabase
        .from("multichain_positions")
        .select("id, chain, asset_symbol, balance, usd_value")
        .order("usd_value", { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as MultichainPositionRow[];
    },
  });

  const assetTitles = new Map(contentItems.map((item) => [item.id, item.title]));

  const handleQueueBridge = async () => {
    try {
      const { error } = await supabase.functions.invoke("bridge-execute", {
        body: {
          contentItemId: form.contentItemId || null,
          sourceAssetType: form.sourceAssetType,
          sourceIdentifier: form.sourceIdentifier || null,
          sourceChain: form.sourceChain,
          destinationChain: form.destinationChain,
          bridgeProvider: form.bridgeProvider,
          destinationWallet: form.destinationWallet,
          estimatedFeeUsd: Number(form.estimatedFeeUsd || 0),
        },
      });
      if (error) throw error;
      setForm((current) => ({
        ...current,
        sourceIdentifier: "",
        destinationWallet: "",
        estimatedFeeUsd: "0",
      }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bridge", "jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["platform-overview"] }),
      ]);
      toast({
        title: "Bridge job queued",
        description: "The bridge request was written to the backend queue.",
      });
    } catch (error) {
      toast({
        title: "Unable to queue bridge job",
        description: error instanceof Error ? error.message : "Unknown bridge error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Available inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {positions.length ? (
              positions.map((position) => (
                <div key={position.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="font-medium text-white">{position.chain.toUpperCase()}</p>
                    <p className="text-sm text-white/60">{position.asset_symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{Number(position.balance ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-white/50">${Number(position.usd_value ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No multichain positions synced yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Queue a bridge job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Content item</Label>
                <select
                  value={form.contentItemId}
                  onChange={(event) => setForm((current) => ({ ...current, contentItemId: event.target.value }))}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <option value="">Optional linked asset</option>
                  {contentItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.file_type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Asset type</Label>
                <select
                  value={form.sourceAssetType}
                  onChange={(event) => setForm((current) => ({ ...current, sourceAssetType: event.target.value }))}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <option value="nft">NFT</option>
                  <option value="token">Token</option>
                  <option value="native">Native</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Source chain</Label>
                <Input
                  value={form.sourceChain}
                  onChange={(event) => setForm((current) => ({ ...current, sourceChain: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
              <div className="flex items-end justify-center pb-2">
                <ArrowRight className="h-5 w-5 text-white/60" />
              </div>
              <div className="space-y-2">
                <Label>Destination chain</Label>
                <Input
                  value={form.destinationChain}
                  onChange={(event) => setForm((current) => ({ ...current, destinationChain: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Bridge provider</Label>
                <Input
                  value={form.bridgeProvider}
                  onChange={(event) => setForm((current) => ({ ...current, bridgeProvider: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Source identifier</Label>
                <Input
                  value={form.sourceIdentifier}
                  onChange={(event) => setForm((current) => ({ ...current, sourceIdentifier: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="Mint address or token id"
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated fee (USD)</Label>
                <Input
                  type="number"
                  value={form.estimatedFeeUsd}
                  onChange={(event) => setForm((current) => ({ ...current, estimatedFeeUsd: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destination wallet</Label>
              <Input
                value={form.destinationWallet}
                onChange={(event) => setForm((current) => ({ ...current, destinationWallet: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Wallet address"
              />
            </div>

            <Button onClick={handleQueueBridge} className="w-full bg-primary hover:bg-primary/90">
              Queue Bridge Job
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Known routes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {routes.length ? (
            routes.map((route) => (
              <div key={route.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">
                    {route.source_chain} → {route.destination_chain}
                  </p>
                  <Badge className={statusTone(route.status)}>{route.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-white/60">{route.bridge_provider}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No bridge routes registered yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent bridge jobs</CardTitle>
          <Button variant="outline" className="border-white/15 text-white/70" onClick={() => queryClient.invalidateQueries({ queryKey: ["bridge"] })}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {bridgeJobs.length ? (
            bridgeJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      <p className="font-medium text-white">
                        {job.source_chain} → {job.destination_chain}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-white/60">
                      {assetTitles.get(job.content_item_id ?? "") ?? job.source_identifier ?? "Unlinked asset"} • {job.source_asset_type}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/50">
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        {job.destination_wallet}
                      </span>
                      <span>${Number(job.estimated_fee_usd ?? 0).toFixed(2)} est. fee</span>
                      <span>{new Date(job.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusTone(job.status)}>{job.status}</Badge>
                    {job.destination_tx_hash ? (
                      <a
                        href={`https://basescan.org/tx/${job.destination_tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80"
                      >
                        explorer
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No bridge jobs have been queued yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
