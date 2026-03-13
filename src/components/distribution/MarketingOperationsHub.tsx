import { type ReactNode, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Music, Radio, Send, Share2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CampaignRow {
  id: string;
  name: string;
  objective: string | null;
  status: string;
  created_at: string;
}

interface ChannelAccountRow {
  id: string;
  provider_id: string;
  handle: string | null;
  display_name: string | null;
  status: string;
  created_at: string;
}

interface ScheduledPostRow {
  id: string;
  campaign_id: string | null;
  content_item_id: string | null;
  copy: string | null;
  scheduled_for: string;
  status: string;
  distribution_target_id: string | null;
}

interface PublishedPostRow {
  id: string;
  provider_id: string;
  post_url: string | null;
  published_at: string;
  metrics: Record<string, number | string>;
}

interface ContentItemRow {
  id: string;
  title: string;
}

interface LaunchRow {
  id: string;
  launch_provider: string;
  chain: string | null;
  venue: string | null;
  status: string;
  created_at: string;
}

interface DefiPositionRow {
  id: string;
  chain: string;
  asset_symbol: string;
  quantity: number;
  usd_value: number;
  provider_id: string;
}

interface GovernanceVoteRow {
  id: string;
  chain: string;
  proposal_id: string;
  vote_choice: string;
  voting_power: number | null;
  cast_at: string | null;
}

interface CommunityMessageRow {
  id: string;
  provider_id: string;
  channel_id: string | null;
  status: string;
  direction: string;
  message_body: string;
  created_at: string;
}

interface SyncOpportunityRow {
  id: string;
  title: string;
  requester_name: string | null;
  status: string;
  created_at: string;
}

interface SyncDealRow {
  id: string;
  sync_opportunity_id: string | null;
  status: string;
  fee_amount: number;
  currency: string;
  created_at: string;
}

interface SyncSubmissionRow {
  id: string;
  sync_opportunity_id: string;
  content_item_id: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
}

const statusTone = (status: string) => {
  switch (status) {
    case "active":
    case "connected":
    case "published":
    case "sent":
    case "won":
    case "paid":
    case "accepted":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "queued":
    case "scheduled":
    case "approval":
    case "draft":
    case "open":
    case "submitted":
    case "shortlisted":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "failed":
    case "error":
    case "disconnected":
    case "rejected":
    case "lost":
    case "closed":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
};

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Share2;
  children: ReactNode;
}) => (
  <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const MarketingOperationsHub = ({ tab }: { tab: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: creatorId } = useCurrentUserId();
  const [dispatchForm, setDispatchForm] = useState({
    providerId: "x",
    targetType: "social_post",
    name: "",
    objective: "",
    copy: "",
    scheduledFor: "",
    destinationId: "",
    contentItemId: "",
  });
  const [channelForm, setChannelForm] = useState({
    providerId: "spotify",
    handle: "",
    displayName: "",
  });
  const [messageForm, setMessageForm] = useState({
    providerId: "botchan",
    channelId: "",
    messageBody: "",
  });
  const [syncForm, setSyncForm] = useState({
    title: "",
    requesterName: "",
  });
  const [hydrexForm, setHydrexForm] = useState({
    chain: "base",
    assetSymbol: "HYDX",
    quantity: "0",
    usdValue: "0",
    proposalId: "",
    voteChoice: "for",
    votingPower: "0",
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["marketing", "campaigns"],
    queryFn: async (): Promise<CampaignRow[]> => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("id, name, objective, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CampaignRow[];
    },
  });
  const { data: channels = [] } = useQuery({
    queryKey: ["marketing", "channels"],
    queryFn: async (): Promise<ChannelAccountRow[]> => {
      const { data, error } = await supabase
        .from("channel_accounts")
        .select("id, provider_id, handle, display_name, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ChannelAccountRow[];
    },
  });
  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ["marketing", "scheduled-posts"],
    queryFn: async (): Promise<ScheduledPostRow[]> => {
      const { data, error } = await supabase
        .from("scheduled_posts")
        .select("id, campaign_id, content_item_id, copy, scheduled_for, status, distribution_target_id")
        .order("scheduled_for", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ScheduledPostRow[];
    },
  });
  const { data: publishedPosts = [] } = useQuery({
    queryKey: ["marketing", "published-posts"],
    queryFn: async (): Promise<PublishedPostRow[]> => {
      const { data, error } = await supabase
        .from("published_posts")
        .select("id, provider_id, post_url, published_at, metrics")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PublishedPostRow[];
    },
  });
  const { data: contentItems = [] } = useQuery({
    queryKey: ["marketing", "content-items"],
    queryFn: async (): Promise<ContentItemRow[]> => {
      const { data, error } = await supabase
        .from("content_items")
        .select("id, title")
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as ContentItemRow[];
    },
  });
  const { data: launches = [] } = useQuery({
    queryKey: ["marketing", "launches"],
    queryFn: async (): Promise<LaunchRow[]> => {
      const { data, error } = await supabase
        .from("asset_launches")
        .select("id, launch_provider, chain, venue, status, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as LaunchRow[];
    },
  });
  const { data: positions = [] } = useQuery({
    queryKey: ["marketing", "defi-positions"],
    queryFn: async (): Promise<DefiPositionRow[]> => {
      const { data, error } = await supabase
        .from("defi_positions")
        .select("id, chain, asset_symbol, quantity, usd_value, provider_id")
        .order("synced_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as DefiPositionRow[];
    },
  });
  const { data: votes = [] } = useQuery({
    queryKey: ["marketing", "governance-votes"],
    queryFn: async (): Promise<GovernanceVoteRow[]> => {
      const { data, error } = await supabase
        .from("governance_votes")
        .select("id, chain, proposal_id, vote_choice, voting_power, cast_at")
        .order("cast_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as GovernanceVoteRow[];
    },
  });
  const { data: messages = [] } = useQuery({
    queryKey: ["marketing", "community-messages"],
    queryFn: async (): Promise<CommunityMessageRow[]> => {
      const { data, error } = await supabase
        .from("community_messages")
        .select("id, provider_id, channel_id, status, direction, message_body, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as CommunityMessageRow[];
    },
  });
  const { data: opportunities = [] } = useQuery({
    queryKey: ["marketing", "sync-opportunities"],
    queryFn: async (): Promise<SyncOpportunityRow[]> => {
      const { data, error } = await supabase
        .from("sync_opportunities")
        .select("id, title, requester_name, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SyncOpportunityRow[];
    },
  });
  const { data: deals = [] } = useQuery({
    queryKey: ["marketing", "sync-deals"],
    queryFn: async (): Promise<SyncDealRow[]> => {
      const { data, error } = await supabase
        .from("sync_deals")
        .select("id, sync_opportunity_id, status, fee_amount, currency, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SyncDealRow[];
    },
  });
  const { data: submissions = [] } = useQuery({
    queryKey: ["marketing", "sync-submissions"],
    queryFn: async (): Promise<SyncSubmissionRow[]> => {
      const { data, error } = await supabase
        .from("sync_submissions")
        .select("id, sync_opportunity_id, content_item_id, status, submitted_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SyncSubmissionRow[];
    },
  });

  const contentMap = useMemo(
    () => new Map(contentItems.map((item) => [item.id, item.title])),
    [contentItems],
  );

  const invalidateMarketing = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["marketing"] }),
      queryClient.invalidateQueries({ queryKey: ["platform-overview"] }),
    ]);
  };

  const handleDispatch = async () => {
    try {
      const { error } = await supabase.functions.invoke("campaign-dispatch", {
        body: {
          providerId: dispatchForm.providerId,
          targetType: dispatchForm.targetType,
          name: dispatchForm.name,
          objective: dispatchForm.objective || null,
          copy: dispatchForm.copy || null,
          scheduledFor: dispatchForm.scheduledFor || null,
          destinationId: dispatchForm.destinationId || null,
          contentItemId: dispatchForm.contentItemId || null,
        },
      });
      if (error) throw error;
      setDispatchForm((current) => ({
        ...current,
        name: "",
        objective: "",
        copy: "",
        scheduledFor: "",
        destinationId: "",
      }));
      await invalidateMarketing();
      toast({ title: "Campaign dispatched", description: "Campaign, target, and scheduled post were stored." });
    } catch (error) {
      toast({
        title: "Unable to dispatch campaign",
        description: error instanceof Error ? error.message : "Unknown campaign error.",
        variant: "destructive",
      });
    }
  };

  const handleCreateChannel = async () => {
    if (!creatorId) return;
    try {
      const { error } = await supabase.from("channel_accounts").insert({
        creator_id: creatorId,
        provider_id: channelForm.providerId,
        handle: channelForm.handle || null,
        display_name: channelForm.displayName || null,
        status: "connected",
      });
      if (error) throw error;
      setChannelForm({ providerId: "spotify", handle: "", displayName: "" });
      await invalidateMarketing();
      toast({ title: "Channel connected", description: "The media channel is now tracked in channel_accounts." });
    } catch (error) {
      toast({
        title: "Unable to connect channel",
        description: error instanceof Error ? error.message : "Unknown channel error.",
        variant: "destructive",
      });
    }
  };

  const handleMessageDispatch = async () => {
    try {
      const { error } = await supabase.functions.invoke("botchan-message-dispatch", {
        body: {
          providerId: messageForm.providerId,
          channelId: messageForm.channelId || null,
          messageBody: messageForm.messageBody,
        },
      });
      if (error) throw error;
      setMessageForm({ providerId: "botchan", channelId: "", messageBody: "" });
      await invalidateMarketing();
      toast({ title: "Community message sent", description: "Message stored in community_messages and agent_inboxes." });
    } catch (error) {
      toast({
        title: "Unable to send community message",
        description: error instanceof Error ? error.message : "Unknown message dispatch error.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOpportunity = async () => {
    if (!creatorId) return;
    try {
      const { error } = await supabase.from("sync_opportunities").insert({
        creator_id: creatorId,
        title: syncForm.title,
        requester_name: syncForm.requesterName || null,
        status: "open",
      });
      if (error) throw error;
      setSyncForm({ title: "", requesterName: "" });
      await invalidateMarketing();
      toast({ title: "Sync opportunity created", description: "The opportunity is now tracked for licensing workflows." });
    } catch (error) {
      toast({
        title: "Unable to create opportunity",
        description: error instanceof Error ? error.message : "Unknown sync opportunity error.",
        variant: "destructive",
      });
    }
  };

  const handleHydrexSync = async () => {
    try {
      const { error } = await supabase.functions.invoke("hydrex-sync", {
        body: {
          chain: hydrexForm.chain,
          positions: [
            {
              chain: hydrexForm.chain,
              assetSymbol: hydrexForm.assetSymbol,
              quantity: Number(hydrexForm.quantity || 0),
              usdValue: Number(hydrexForm.usdValue || 0),
            },
          ],
          votes: hydrexForm.proposalId
            ? [
                {
                  chain: hydrexForm.chain,
                  proposalId: hydrexForm.proposalId,
                  voteChoice: hydrexForm.voteChoice,
                  votingPower: Number(hydrexForm.votingPower || 0),
                },
              ]
            : [],
        },
      });
      if (error) throw error;
      await invalidateMarketing();
      toast({ title: "Hydrex sync recorded", description: "DeFi positions and governance votes were appended." });
    } catch (error) {
      toast({
        title: "Unable to sync Hydrex data",
        description: error instanceof Error ? error.message : "Unknown Hydrex sync error.",
        variant: "destructive",
      });
    }
  };

  if (tab === "social-media") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard title="Dispatch campaign" icon={Share2}>
          <div className="space-y-4">
            <Input value={dispatchForm.name} onChange={(event) => setDispatchForm((current) => ({ ...current, name: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Campaign name" />
            <Input value={dispatchForm.objective} onChange={(event) => setDispatchForm((current) => ({ ...current, objective: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Objective" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={dispatchForm.providerId} onChange={(event) => setDispatchForm((current) => ({ ...current, providerId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="x / instagram / farcaster" />
              <Input value={dispatchForm.targetType} onChange={(event) => setDispatchForm((current) => ({ ...current, targetType: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="social_post" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={dispatchForm.scheduledFor} onChange={(event) => setDispatchForm((current) => ({ ...current, scheduledFor: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="2026-03-13T18:00:00Z" />
              <Input value={dispatchForm.destinationId} onChange={(event) => setDispatchForm((current) => ({ ...current, destinationId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="@handle or channel id" />
            </div>
            <select value={dispatchForm.contentItemId} onChange={(event) => setDispatchForm((current) => ({ ...current, contentItemId: event.target.value }))} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
              <option value="">Optional content asset</option>
              {contentItems.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <Textarea value={dispatchForm.copy} onChange={(event) => setDispatchForm((current) => ({ ...current, copy: event.target.value }))} className="min-h-[120px] border-white/10 bg-white/5 text-white" placeholder="Post copy" />
            <Button onClick={handleDispatch} className="w-full bg-primary hover:bg-primary/90">
              Dispatch Campaign
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Scheduled + published posts" icon={Send}>
          <div className="space-y-3">
            {scheduledPosts.length ? scheduledPosts.slice(0, 12).map((post) => (
              <div key={post.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{post.copy || "Untitled scheduled post"}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {contentMap.get(post.content_item_id ?? "") ?? "No linked asset"} • {new Date(post.scheduled_for).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={statusTone(post.status)}>{post.status}</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No scheduled posts yet.</p>}

            {publishedPosts.length ? publishedPosts.slice(0, 6).map((post) => (
              <div key={post.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{post.provider_id}</p>
                    <p className="mt-1 text-sm text-white/60">{new Date(post.published_at).toLocaleString()}</p>
                    <p className="mt-1 text-xs text-white/50">{JSON.stringify(post.metrics)}</p>
                  </div>
                  <Badge className={statusTone("published")}>published</Badge>
                </div>
              </div>
            )) : null}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "on-chain") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Hydrex + launch sync" icon={Zap}>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={hydrexForm.chain} onChange={(event) => setHydrexForm((current) => ({ ...current, chain: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="base" />
              <Input value={hydrexForm.assetSymbol} onChange={(event) => setHydrexForm((current) => ({ ...current, assetSymbol: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="HYDX" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input type="number" value={hydrexForm.quantity} onChange={(event) => setHydrexForm((current) => ({ ...current, quantity: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Quantity" />
              <Input type="number" value={hydrexForm.usdValue} onChange={(event) => setHydrexForm((current) => ({ ...current, usdValue: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="USD value" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input value={hydrexForm.proposalId} onChange={(event) => setHydrexForm((current) => ({ ...current, proposalId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Proposal id" />
              <Input value={hydrexForm.voteChoice} onChange={(event) => setHydrexForm((current) => ({ ...current, voteChoice: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="for" />
              <Input type="number" value={hydrexForm.votingPower} onChange={(event) => setHydrexForm((current) => ({ ...current, votingPower: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Voting power" />
            </div>
            <Button onClick={handleHydrexSync} className="w-full bg-primary hover:bg-primary/90">
              Record On-Chain Sync
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="On-chain distribution ledger" icon={Radio}>
          <div className="space-y-3">
            {launches.map((launch) => (
              <div key={launch.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{launch.launch_provider}</p>
                    <p className="mt-1 text-sm text-white/60">{launch.chain ?? "unassigned chain"} • {launch.venue ?? "no venue"}</p>
                  </div>
                  <Badge className={statusTone(launch.status)}>{launch.status}</Badge>
                </div>
              </div>
            ))}
            {positions.slice(0, 6).map((position) => (
              <div key={position.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{position.provider_id} • {position.chain}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {position.asset_symbol} {Number(position.quantity ?? 0).toLocaleString()} • ${Number(position.usd_value ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={statusTone("active")}>position</Badge>
                </div>
              </div>
            ))}
            {votes.slice(0, 6).map((vote) => (
              <div key={vote.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{vote.proposal_id}</p>
                    <p className="mt-1 text-sm text-white/60">{vote.chain} • {vote.vote_choice} • {vote.voting_power ?? 0} power</p>
                  </div>
                  <Badge className={statusTone("active")}>vote</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "media-channels") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Connect media channel" icon={Radio}>
          <div className="space-y-4">
            <Input value={channelForm.providerId} onChange={(event) => setChannelForm((current) => ({ ...current, providerId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="spotify / youtube / apple-music" />
            <Input value={channelForm.handle} onChange={(event) => setChannelForm((current) => ({ ...current, handle: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="@channel" />
            <Input value={channelForm.displayName} onChange={(event) => setChannelForm((current) => ({ ...current, displayName: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Display name" />
            <Button onClick={handleCreateChannel} className="w-full bg-primary hover:bg-primary/90">
              Save Channel Account
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Connected channels" icon={Radio}>
          <div className="space-y-3">
            {channels.length ? channels.map((channel) => (
              <div key={channel.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{channel.display_name ?? channel.handle ?? channel.provider_id}</p>
                    <p className="mt-1 text-sm text-white/60">{channel.provider_id} • {channel.handle ?? "no handle"}</p>
                  </div>
                  <Badge className={statusTone(channel.status)}>{channel.status}</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No channel accounts connected yet.</p>}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "independent") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Independent channel message" icon={MessageSquare}>
          <div className="space-y-4">
            <Input value={messageForm.providerId} onChange={(event) => setMessageForm((current) => ({ ...current, providerId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="botchan / mirror / lens" />
            <Input value={messageForm.channelId} onChange={(event) => setMessageForm((current) => ({ ...current, channelId: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Thread or channel id" />
            <Textarea value={messageForm.messageBody} onChange={(event) => setMessageForm((current) => ({ ...current, messageBody: event.target.value }))} className="min-h-[120px] border-white/10 bg-white/5 text-white" placeholder="Community update or direct-to-fan message" />
            <Button onClick={handleMessageDispatch} className="w-full bg-primary hover:bg-primary/90">
              Send Message
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Community message log" icon={MessageSquare}>
          <div className="space-y-3">
            {messages.length ? messages.map((message) => (
              <div key={message.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{message.provider_id} • {message.direction}</p>
                    <p className="mt-1 text-sm text-white/60">{message.message_body}</p>
                    <p className="mt-1 text-xs text-white/50">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                  <Badge className={statusTone(message.status)}>{message.status}</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No independent channel messages yet.</p>}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "sync-licensing") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Create sync opportunity" icon={Music}>
          <div className="space-y-4">
            <Input value={syncForm.title} onChange={(event) => setSyncForm((current) => ({ ...current, title: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Trailer placement request" />
            <Input value={syncForm.requesterName} onChange={(event) => setSyncForm((current) => ({ ...current, requesterName: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Requester / studio" />
            <Button onClick={handleCreateOpportunity} className="w-full bg-primary hover:bg-primary/90">
              Save Opportunity
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Sync licensing pipeline" icon={Music}>
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{opportunity.title}</p>
                    <p className="mt-1 text-sm text-white/60">{opportunity.requester_name ?? "Unknown requester"}</p>
                  </div>
                  <Badge className={statusTone(opportunity.status)}>{opportunity.status}</Badge>
                </div>
              </div>
            ))}
            {deals.map((deal) => (
              <div key={deal.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{deal.sync_opportunity_id ?? "Unlinked opportunity"}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {Number(deal.fee_amount ?? 0).toLocaleString()} {deal.currency}
                    </p>
                  </div>
                  <Badge className={statusTone(deal.status)}>{deal.status}</Badge>
                </div>
              </div>
            ))}
            {submissions.map((submission) => (
              <div key={submission.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{contentMap.get(submission.content_item_id ?? "") ?? "No linked asset"}</p>
                    <p className="mt-1 text-sm text-white/60">{submission.sync_opportunity_id}</p>
                  </div>
                  <Badge className={statusTone(submission.status)}>{submission.status}</Badge>
                </div>
              </div>
            ))}
            {!opportunities.length && !deals.length && !submissions.length ? (
              <p className="text-sm text-white/60">No sync licensing pipeline items yet.</p>
            ) : null}
          </div>
        </SectionCard>
      </div>
    );
  }

  return null;
};
