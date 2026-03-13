import { type ReactNode, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Bug, PlugZap, Rocket, Store, Workflow } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface AgentRow {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string | null;
  last_active_at: string | null;
  created_at: string;
}

interface AgentInstallRow {
  id: string;
  agent_id: string | null;
  agent_template_id: string | null;
  marketplace_listing_id: string | null;
  install_status: string;
  created_at: string;
}

interface AgentTemplateRow {
  id: string;
  name: string;
  description: string | null;
  template_type: string;
  created_at: string;
}

interface AgentRunRow {
  id: string;
  agent_id: string | null;
  run_status: string;
  intent: string | null;
  error_message: string | null;
  created_at: string;
}

interface MarketplaceListingRow {
  id: string;
  agent_template_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  price_amount: number;
  currency: string;
  status: string;
}

interface IntegrationAccountRow {
  id: string;
  provider_id: string;
  display_name: string | null;
  status: string;
  last_synced_at: string | null;
}

interface SystemAlertRow {
  id: string;
  workflow_type: string | null;
  alert_type: string;
  severity: string;
  status: string;
  message: string;
  created_at: string;
}

interface WorkflowFailureRow {
  id: string;
  workflow_type: string;
  subject_type: string;
  failure_stage: string;
  failure_reason: string;
  retryable: boolean;
  created_at: string;
}

const statusTone = (status: string) => {
  switch (status) {
    case "active":
    case "installed":
    case "connected":
    case "succeeded":
    case "published":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "draft":
    case "queued":
    case "running":
    case "pending":
    case "updating":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "failed":
    case "error":
    case "removed":
    case "disabled":
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
  icon: typeof Bot;
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

export const AgentsControlPlane = ({ tab }: { tab: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: creatorId } = useCurrentUserId();
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "assistant",
    description: "",
    publishToMarketplace: false,
    listingPrice: "0",
  });
  const [runForm, setRunForm] = useState({
    agentId: "",
    intent: "",
  });

  const { data: agents = [] } = useQuery({
    queryKey: ["agents", "rows"],
    queryFn: async (): Promise<AgentRow[]> => {
      const { data, error } = await supabase
        .from("agents")
        .select("id, name, type, status, description, last_active_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AgentRow[];
    },
  });
  const { data: installs = [] } = useQuery({
    queryKey: ["agents", "installs"],
    queryFn: async (): Promise<AgentInstallRow[]> => {
      const { data, error } = await supabase
        .from("agent_installs")
        .select("id, agent_id, agent_template_id, marketplace_listing_id, install_status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AgentInstallRow[];
    },
  });
  const { data: templates = [] } = useQuery({
    queryKey: ["agents", "templates"],
    queryFn: async (): Promise<AgentTemplateRow[]> => {
      const { data, error } = await supabase
        .from("agent_templates")
        .select("id, name, description, template_type, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AgentTemplateRow[];
    },
  });
  const { data: runs = [] } = useQuery({
    queryKey: ["agents", "runs"],
    queryFn: async (): Promise<AgentRunRow[]> => {
      const { data, error } = await supabase
        .from("agent_runs")
        .select("id, agent_id, run_status, intent, error_message, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AgentRunRow[];
    },
  });
  const { data: listings = [] } = useQuery({
    queryKey: ["agents", "marketplace"],
    queryFn: async (): Promise<MarketplaceListingRow[]> => {
      const { data, error } = await supabase
        .from("agent_marketplace_listings")
        .select("id, agent_template_id, title, description, category, price_amount, currency, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MarketplaceListingRow[];
    },
  });
  const { data: integrations = [] } = useQuery({
    queryKey: ["agents", "integrations"],
    queryFn: async (): Promise<IntegrationAccountRow[]> => {
      const { data, error } = await supabase
        .from("integration_accounts")
        .select("id, provider_id, display_name, status, last_synced_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IntegrationAccountRow[];
    },
  });
  const { data: alerts = [] } = useQuery({
    queryKey: ["agents", "alerts"],
    queryFn: async (): Promise<SystemAlertRow[]> => {
      const { data, error } = await supabase
        .from("system_alerts")
        .select("id, workflow_type, alert_type, severity, status, message, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as SystemAlertRow[];
    },
  });
  const { data: failures = [] } = useQuery({
    queryKey: ["agents", "failures"],
    queryFn: async (): Promise<WorkflowFailureRow[]> => {
      const { data, error } = await supabase
        .from("workflow_failures")
        .select("id, workflow_type, subject_type, failure_stage, failure_reason, retryable, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as WorkflowFailureRow[];
    },
  });

  const agentMap = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents]);
  const templateMap = useMemo(() => new Map(templates.map((template) => [template.id, template])), [templates]);

  const invalidateAgents = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["agents"] }),
      queryClient.invalidateQueries({ queryKey: ["platform-overview"] }),
    ]);
  };

  const handleCreateAgent = async () => {
    if (!creatorId) return;
    try {
      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .insert({
          user_id: creatorId,
          name: createForm.name,
          type: createForm.type,
          description: createForm.description || null,
          status: "active",
          config: {},
          metadata: {},
        })
        .select("id")
        .single();
      if (agentError || !agent) throw agentError ?? new Error("Agent was not created");

      const { data: template, error: templateError } = await supabase
        .from("agent_templates")
        .insert({
          creator_id: creatorId,
          name: createForm.name,
          description: createForm.description || null,
          template_type: createForm.type,
          config: {},
          metadata: { agentId: agent.id },
        })
        .select("id")
        .single();
      if (templateError || !template) throw templateError ?? new Error("Template was not created");

      const { error: installError } = await supabase.from("agent_installs").insert({
        creator_id: creatorId,
        agent_id: agent.id,
        agent_template_id: template.id,
        install_status: "installed",
      });
      if (installError) throw installError;

      if (createForm.publishToMarketplace) {
        const { error: listingError } = await supabase.from("agent_marketplace_listings").insert({
          creator_id: creatorId,
          agent_template_id: template.id,
          title: createForm.name,
          description: createForm.description || null,
          category: createForm.type,
          price_amount: Number(createForm.listingPrice || 0),
          currency: "USD",
          status: "published",
        });
        if (listingError) throw listingError;
      }

      setCreateForm({
        name: "",
        type: "assistant",
        description: "",
        publishToMarketplace: false,
        listingPrice: "0",
      });
      await invalidateAgents();
      toast({ title: "Agent created", description: "Agent, template, and install records were persisted." });
    } catch (error) {
      toast({
        title: "Unable to create agent",
        description: error instanceof Error ? error.message : "Unknown agent creation error.",
        variant: "destructive",
      });
    }
  };

  const handleInstallListing = async (listing: MarketplaceListingRow) => {
    try {
      const { error } = await supabase.functions.invoke("agent-marketplace-install", {
        body: {
          marketplaceListingId: listing.id,
          agentTemplateId: listing.agent_template_id,
        },
      });
      if (error) throw error;
      await invalidateAgents();
      toast({ title: "Agent installed", description: "Marketplace install recorded in agent_installs." });
    } catch (error) {
      toast({
        title: "Unable to install listing",
        description: error instanceof Error ? error.message : "Unknown install error.",
        variant: "destructive",
      });
    }
  };

  const handleRunAgent = async () => {
    try {
      const { error } = await supabase.functions.invoke("agent-runner", {
        body: {
          agentId: runForm.agentId,
          intent: runForm.intent,
          inputPayload: { source: "agents_integrations" },
          steps: [{ stepKey: "plan", toolName: "orchestrator" }],
          outputPayload: { summary: "Run executed from UI" },
        },
      });
      if (error) throw error;
      setRunForm({ agentId: "", intent: "" });
      await invalidateAgents();
      toast({ title: "Agent run completed", description: "A run and step record were appended to the agent ledger." });
    } catch (error) {
      toast({
        title: "Unable to run agent",
        description: error instanceof Error ? error.message : "Unknown run error.",
        variant: "destructive",
      });
    }
  };

  if (tab === "collection") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <SectionCard title="Installed agents" icon={Bot}>
          <div className="space-y-3">
            {installs.length ? installs.map((install) => {
              const agent = install.agent_id ? agentMap.get(install.agent_id) : null;
              const template = install.agent_template_id ? templateMap.get(install.agent_template_id) : null;
              return (
                <div key={install.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{agent?.name ?? template?.name ?? "Installed template"}</p>
                      <p className="mt-1 text-sm text-white/60">{agent?.type ?? template?.template_type ?? "unknown type"}</p>
                    </div>
                    <Badge className={statusTone(install.install_status)}>{install.install_status}</Badge>
                  </div>
                </div>
              );
            }) : <p className="text-sm text-white/60">No agent installs yet.</p>}
          </div>
        </SectionCard>

        <SectionCard title="Recent runs" icon={Workflow}>
          <div className="space-y-3">
            {runs.length ? runs.map((run) => (
              <div key={run.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{agentMap.get(run.agent_id ?? "")?.name ?? "Unknown agent"}</p>
                    <p className="mt-1 text-sm text-white/60">{run.intent ?? "No intent recorded"}</p>
                    {run.error_message ? <p className="mt-1 text-xs text-rose-200">{run.error_message}</p> : null}
                  </div>
                  <Badge className={statusTone(run.run_status)}>{run.run_status}</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No agent runs yet.</p>}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "marketplace") {
    return (
      <SectionCard title="Agent marketplace" icon={Store}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listings.length ? listings.map((listing) => (
            <div key={listing.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{listing.title}</p>
                  <p className="mt-1 text-sm text-white/60">{listing.description ?? "No description"}</p>
                  <p className="mt-2 text-xs text-white/50">
                    {listing.category ?? "uncategorized"} • {Number(listing.price_amount ?? 0).toLocaleString()} {listing.currency}
                  </p>
                </div>
                <Badge className={statusTone(listing.status)}>{listing.status}</Badge>
              </div>
              <Button className="mt-4 w-full bg-primary hover:bg-primary/90" onClick={() => handleInstallListing(listing)}>
                Install Listing
              </Button>
            </div>
          )) : <p className="text-sm text-white/60">No marketplace listings published yet.</p>}
        </div>
      </SectionCard>
    );
  }

  if (tab === "create") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard title="Create agent" icon={Rocket}>
          <div className="space-y-4">
            <Input value={createForm.name} onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Agent name" />
            <Input value={createForm.type} onChange={(event) => setCreateForm((current) => ({ ...current, type: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="assistant / booking / finance" />
            <Textarea value={createForm.description} onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))} className="min-h-[120px] border-white/10 bg-white/5 text-white" placeholder="What this agent does" />
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input type="checkbox" checked={createForm.publishToMarketplace} onChange={(event) => setCreateForm((current) => ({ ...current, publishToMarketplace: event.target.checked }))} />
              Publish to marketplace
            </label>
            {createForm.publishToMarketplace ? (
              <Input type="number" value={createForm.listingPrice} onChange={(event) => setCreateForm((current) => ({ ...current, listingPrice: event.target.value }))} className="border-white/10 bg-white/5 text-white" placeholder="Marketplace price" />
            ) : null}
            <Button onClick={handleCreateAgent} className="w-full bg-primary hover:bg-primary/90">
              Create Agent
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Run agent" icon={Workflow}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Agent</Label>
              <select value={runForm.agentId} onChange={(event) => setRunForm((current) => ({ ...current, agentId: event.target.value }))} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <option value="">Choose agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            <Textarea value={runForm.intent} onChange={(event) => setRunForm((current) => ({ ...current, intent: event.target.value }))} className="min-h-[120px] border-white/10 bg-white/5 text-white" placeholder="Describe the workflow or intent" />
            <Button onClick={handleRunAgent} className="w-full bg-primary hover:bg-primary/90">
              Run Agent
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "observability") {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="System alerts" icon={PlugZap}>
          <div className="space-y-3">
            {alerts.length ? alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{alert.alert_type}</p>
                    <p className="mt-1 text-sm text-white/60">{alert.message}</p>
                    <p className="mt-1 text-xs text-white/50">{alert.workflow_type ?? "system"} • {new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  <Badge className={statusTone(alert.status)}>{alert.severity}</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No system alerts recorded.</p>}
          </div>
        </SectionCard>

        <SectionCard title="Workflow failures" icon={Bug}>
          <div className="space-y-3">
            {failures.length ? failures.map((failure) => (
              <div key={failure.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{failure.workflow_type}</p>
                    <p className="mt-1 text-sm text-white/60">{failure.failure_stage} • {failure.failure_reason}</p>
                    <p className="mt-1 text-xs text-white/50">{failure.subject_type} • retryable: {failure.retryable ? "yes" : "no"}</p>
                  </div>
                  <Badge className={statusTone("failed")}>failed</Badge>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No workflow failures recorded.</p>}
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm font-medium text-white">Connected integrations</p>
            <div className="mt-3 space-y-2">
              {integrations.length ? integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{integration.display_name ?? integration.provider_id}</p>
                    <p className="text-xs text-white/50">{integration.last_synced_at ? new Date(integration.last_synced_at).toLocaleString() : "never synced"}</p>
                  </div>
                  <Badge className={statusTone(integration.status)}>{integration.status}</Badge>
                </div>
              )) : <p className="text-sm text-white/60">No integration accounts connected.</p>}
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  return null;
};
