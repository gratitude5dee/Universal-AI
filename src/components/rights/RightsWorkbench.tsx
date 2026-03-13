import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  BarChart3,
  FileCheck,
  FileSignature,
  Network,
  PackageCheck,
  ScrollText,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface RightsRollup {
  registeredAssets: number;
  activeLicenses: number;
  pendingAgreements: number;
  rightsTransfers: number;
}

interface IpAssetRow {
  id: string;
  title: string;
  network: string;
  registration_status: string;
  story_ip_id: string | null;
  created_at: string;
}

interface IpAgreementRow {
  id: string;
  ip_asset_id: string | null;
  agreement_type: string;
  title: string;
  counterparty_name: string | null;
  counterparty_email: string | null;
  status: string;
  effective_at: string | null;
  created_at: string;
}

interface LicenseTemplateRow {
  id: string;
  name: string;
  description: string | null;
}

interface IpLicenseRow {
  id: string;
  ip_asset_id: string;
  license_template_id: string | null;
  licensee_name: string | null;
  licensee_wallet: string | null;
  scope: string;
  status: string;
  price_amount: number;
  currency: string;
  minted_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

interface IpTransferRow {
  id: string;
  ip_asset_id: string;
  from_wallet: string | null;
  to_wallet: string;
  status: string;
  transfer_tx_hash: string | null;
  created_at: string;
}

interface RightsAuditRow {
  id: string;
  ip_asset_id: string | null;
  event_type: string;
  subject_type: string;
  subject_id: string | null;
  created_at: string;
}

interface RightsMetricRow {
  metric_date: string;
  new_assets: number;
  active_licenses: number;
  agreements_signed: number;
  transfers_completed: number;
  royalty_revenue: number;
}

const statusTone = (status: string) => {
  switch (status) {
    case "registered":
    case "active":
    case "completed":
    case "signed":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "queued":
    case "pending":
    case "pending_signature":
    case "draft":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "revoked":
    case "failed":
    case "expired":
    case "terminated":
    case "cancelled":
      return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
};

const money = (amount: number | null | undefined, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));

const shortDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString() : "Not set";

const SectionCard = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof Shield;
  children: ReactNode;
}) => (
  <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-white">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description ? <p className="mt-2 text-sm text-white/60">{description}</p> : null}
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const RightsOverviewPane = () => {
  const { data: rollup } = useQuery({
    queryKey: ["rights", "rollup"],
    queryFn: async (): Promise<RightsRollup> => {
      const { data, error } = await supabase.rpc("get_rights_rollup");
      if (error) throw error;
      return (data ?? {}) as RightsRollup;
    },
  });

  const { data: assets = [] } = useQuery({
    queryKey: ["rights", "assets"],
    queryFn: async (): Promise<IpAssetRow[]> => {
      const { data, error } = await supabase
        .from("ip_assets")
        .select("id, title, network, registration_status, story_ip_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpAssetRow[];
    },
  });

  const { data: edges = [] } = useQuery({
    queryKey: ["rights", "lineage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ip_lineage_edges")
        .select("id, parent_ip_asset_id, child_ip_asset_id, relationship_type, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: audit = [] } = useQuery({
    queryKey: ["rights", "audit"],
    queryFn: async (): Promise<RightsAuditRow[]> => {
      const { data, error } = await supabase
        .from("rights_audit")
        .select("id, ip_asset_id, event_type, subject_type, subject_id, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as RightsAuditRow[];
    },
  });

  const assetsById = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <SectionCard title="Registered Assets" icon={PackageCheck}>
          <div className="text-3xl font-semibold text-white">{rollup?.registeredAssets ?? 0}</div>
        </SectionCard>
        <SectionCard title="Active Licenses" icon={FileCheck}>
          <div className="text-3xl font-semibold text-white">{rollup?.activeLicenses ?? 0}</div>
        </SectionCard>
        <SectionCard title="Pending Agreements" icon={FileSignature}>
          <div className="text-3xl font-semibold text-white">{rollup?.pendingAgreements ?? 0}</div>
        </SectionCard>
        <SectionCard title="Rights Transfers" icon={ArrowRightLeft}>
          <div className="text-3xl font-semibold text-white">{rollup?.rightsTransfers ?? 0}</div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <SectionCard
          title="Registered IP Assets"
          description="All Story/IP-backed assets now live in Postgres and can participate in licensing, transfer, and launch workflows."
          icon={Shield}
        >
          <div className="space-y-3">
            {assets.length ? (
              assets.map((asset) => (
                <div key={asset.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{asset.title}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {asset.network.toUpperCase()} {asset.story_ip_id ? `• ${asset.story_ip_id}` : "• awaiting registration id"}
                      </p>
                    </div>
                    <Badge className={statusTone(asset.registration_status)}>{asset.registration_status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No IP assets registered yet.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Lineage Graph"
          description="Derivative relationships are persisted in `ip_lineage_edges` and drive royalty visibility."
          icon={Network}
        >
          <div className="space-y-3">
            {edges.length ? (
              edges.slice(0, 8).map((edge: any) => (
                <div key={edge.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">
                    {assetsById.get(edge.parent_ip_asset_id)?.title ?? "Unknown parent"}
                  </p>
                  <p className="my-2 text-xs text-white/50">↓ {edge.relationship_type}</p>
                  <p className="text-sm text-white/80">
                    {assetsById.get(edge.child_ip_asset_id)?.title ?? "Unknown child"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No lineage edges have been synced yet.</p>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent Rights Audit"
        description="Every licensing and transfer action appends an immutable audit event."
        icon={ScrollText}
      >
        <div className="space-y-3">
          {audit.length ? (
            audit.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-medium text-white">{entry.event_type.replaceAll("_", " ")}</p>
                  <p className="text-sm text-white/60">
                    {entry.subject_type} {entry.subject_id ? `• ${entry.subject_id}` : ""}
                  </p>
                </div>
                <p className="text-sm text-white/50">{shortDate(entry.created_at)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No audit events yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export const RightsAgreementsPane = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: assets = [] } = useQuery({
    queryKey: ["rights", "assets"],
    queryFn: async (): Promise<IpAssetRow[]> => {
      const { data, error } = await supabase
        .from("ip_assets")
        .select("id, title, network, registration_status, story_ip_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpAssetRow[];
    },
  });
  const { data: agreements = [] } = useQuery({
    queryKey: ["rights", "agreements"],
    queryFn: async (): Promise<IpAgreementRow[]> => {
      const { data, error } = await supabase
        .from("ip_agreements")
        .select("id, ip_asset_id, agreement_type, title, counterparty_name, counterparty_email, status, effective_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpAgreementRow[];
    },
  });
  const [form, setForm] = useState({
    ipAssetId: "",
    title: "",
    agreementType: "collaboration",
    counterpartyName: "",
    counterpartyEmail: "",
  });

  const assetOptions = assets.map((asset) => ({ value: asset.id, label: asset.title }));

  const handleCreate = async () => {
    try {
      const { error } = await supabase.functions.invoke("agreement-create", {
        body: {
          ipAssetId: form.ipAssetId || null,
          title: form.title,
          agreementType: form.agreementType,
          counterpartyName: form.counterpartyName || null,
          counterpartyEmail: form.counterpartyEmail || null,
          effectiveAt: new Date().toISOString(),
        },
      });
      if (error) throw error;
      setForm({
        ipAssetId: "",
        title: "",
        agreementType: "collaboration",
        counterpartyName: "",
        counterpartyEmail: "",
      });
      await queryClient.invalidateQueries({ queryKey: ["rights"] });
      toast({ title: "Agreement created", description: "The agreement was stored and queued for signature." });
    } catch (error) {
      toast({
        title: "Unable to create agreement",
        description: error instanceof Error ? error.message : "Unknown agreement error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <SectionCard title="Create Agreement" icon={FileSignature}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Linked asset</Label>
            <select
              value={form.ipAssetId}
              onChange={(event) => setForm((current) => ({ ...current, ipAssetId: event.target.value }))}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <option value="">Choose asset</option>
              {assetOptions.map((asset) => (
                <option key={asset.value} value={asset.value}>
                  {asset.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Agreement title</Label>
            <Input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="border-white/10 bg-white/5 text-white"
              placeholder="Festival sync agreement"
            />
          </div>
          <div className="space-y-2">
            <Label>Agreement type</Label>
            <Input
              value={form.agreementType}
              onChange={(event) => setForm((current) => ({ ...current, agreementType: event.target.value }))}
              className="border-white/10 bg-white/5 text-white"
              placeholder="collaboration"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Counterparty</Label>
              <Input
                value={form.counterpartyName}
                onChange={(event) => setForm((current) => ({ ...current, counterpartyName: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Studio partner"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={form.counterpartyEmail}
                onChange={(event) => setForm((current) => ({ ...current, counterpartyEmail: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="partner@example.com"
              />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-full bg-primary hover:bg-primary/90">
            Create Agreement
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Agreement Ledger" icon={ScrollText}>
        <div className="space-y-3">
          {agreements.length ? (
            agreements.map((agreement) => (
              <div key={agreement.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{agreement.title}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {agreement.agreement_type} {agreement.counterparty_name ? `• ${agreement.counterparty_name}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Effective {shortDate(agreement.effective_at)} • {agreement.counterparty_email ?? "No contact email"}
                    </p>
                  </div>
                  <Badge className={statusTone(agreement.status)}>{agreement.status}</Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No agreements created yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export const RightsLicensingPane = () => {
  const { toast } = useToast();
  const { data: creatorId } = useCurrentUserId();
  const queryClient = useQueryClient();
  const { data: assets = [] } = useQuery({
    queryKey: ["rights", "assets"],
    queryFn: async (): Promise<IpAssetRow[]> => {
      const { data, error } = await supabase
        .from("ip_assets")
        .select("id, title, network, registration_status, story_ip_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpAssetRow[];
    },
  });
  const { data: templates = [] } = useQuery({
    queryKey: ["rights", "templates"],
    queryFn: async (): Promise<LicenseTemplateRow[]> => {
      const { data, error } = await supabase
        .from("ip_license_templates")
        .select("id, name, description")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LicenseTemplateRow[];
    },
  });
  const { data: licenses = [] } = useQuery({
    queryKey: ["rights", "licenses"],
    queryFn: async (): Promise<IpLicenseRow[]> => {
      const { data, error } = await supabase
        .from("ip_licenses")
        .select("id, ip_asset_id, license_template_id, licensee_name, licensee_wallet, scope, status, price_amount, currency, minted_at, revoked_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpLicenseRow[];
    },
  });
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    templateBody: "",
  });
  const [licenseForm, setLicenseForm] = useState({
    ipAssetId: "",
    licenseTemplateId: "",
    licenseeName: "",
    licenseeWallet: "",
    scope: "commercial",
    priceAmount: "0",
  });

  useEffect(() => {
    if (!licenseForm.ipAssetId && assets[0]?.id) {
      setLicenseForm((current) => ({ ...current, ipAssetId: assets[0].id }));
    }
  }, [assets, licenseForm.ipAssetId]);

  const handleTemplateCreate = async () => {
    if (!creatorId) return;
    try {
      const { error } = await supabase.from("ip_license_templates").insert({
        creator_id: creatorId,
        name: templateForm.name,
        description: templateForm.description || null,
        template_body: templateForm.templateBody || null,
      });
      if (error) throw error;
      setTemplateForm({ name: "", description: "", templateBody: "" });
      await queryClient.invalidateQueries({ queryKey: ["rights"] });
      toast({ title: "Template saved", description: "License template is ready for minting." });
    } catch (error) {
      toast({
        title: "Unable to save template",
        description: error instanceof Error ? error.message : "Unknown template error.",
        variant: "destructive",
      });
    }
  };

  const handleMint = async () => {
    try {
      const { error } = await supabase.functions.invoke("license-mint", {
        body: {
          ipAssetId: licenseForm.ipAssetId,
          licenseTemplateId: licenseForm.licenseTemplateId || null,
          licenseeName: licenseForm.licenseeName || null,
          licenseeWallet: licenseForm.licenseeWallet || null,
          scope: licenseForm.scope,
          priceAmount: Number(licenseForm.priceAmount || 0),
          currency: "USD",
        },
      });
      if (error) throw error;
      setLicenseForm((current) => ({
        ...current,
        licenseeName: "",
        licenseeWallet: "",
        priceAmount: "0",
      }));
      await queryClient.invalidateQueries({ queryKey: ["rights"] });
      toast({ title: "License queued", description: "The mint request has been written to the rights ledger." });
    } catch (error) {
      toast({
        title: "Unable to mint license",
        description: error instanceof Error ? error.message : "Unknown license error.",
        variant: "destructive",
      });
    }
  };

  const handleRevoke = async (licenseId: string) => {
    try {
      const { error } = await supabase.functions.invoke("license-revoke", {
        body: { licenseId },
      });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["rights"] });
      toast({ title: "License revoked", description: "The license status is now revoked." });
    } catch (error) {
      toast({
        title: "Unable to revoke license",
        description: error instanceof Error ? error.message : "Unknown revoke error.",
        variant: "destructive",
      });
    }
  };

  const assetsById = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset.title])),
    [assets],
  );
  const templatesById = useMemo(
    () => new Map(templates.map((template) => [template.id, template.name])),
    [templates],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="License Templates" icon={FileCheck}>
          <div className="space-y-4">
            <Input
              value={templateForm.name}
              onChange={(event) => setTemplateForm((current) => ({ ...current, name: event.target.value }))}
              className="border-white/10 bg-white/5 text-white"
              placeholder="Commercial sync"
            />
            <Input
              value={templateForm.description}
              onChange={(event) => setTemplateForm((current) => ({ ...current, description: event.target.value }))}
              className="border-white/10 bg-white/5 text-white"
              placeholder="Short description"
            />
            <Textarea
              value={templateForm.templateBody}
              onChange={(event) => setTemplateForm((current) => ({ ...current, templateBody: event.target.value }))}
              className="min-h-[120px] border-white/10 bg-white/5 text-white"
              placeholder="Usage rights, exclusivity, term, attribution, territories..."
            />
            <Button onClick={handleTemplateCreate} className="w-full bg-primary hover:bg-primary/90">
              Save Template
            </Button>
            <div className="space-y-2">
              {templates.map((template) => (
                <div key={template.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="font-medium text-white">{template.name}</p>
                  <p className="text-sm text-white/60">{template.description ?? "No description"}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Mint License" icon={PackageCheck}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <select
                value={licenseForm.ipAssetId}
                onChange={(event) => setLicenseForm((current) => ({ ...current, ipAssetId: event.target.value }))}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                <option value="">Choose asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <select
                value={licenseForm.licenseTemplateId}
                onChange={(event) => setLicenseForm((current) => ({ ...current, licenseTemplateId: event.target.value }))}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                <option value="">No template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={licenseForm.licenseeName}
                onChange={(event) => setLicenseForm((current) => ({ ...current, licenseeName: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Licensee name"
              />
              <Input
                value={licenseForm.licenseeWallet}
                onChange={(event) => setLicenseForm((current) => ({ ...current, licenseeWallet: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="0x... or wallet"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={licenseForm.scope}
                onChange={(event) => setLicenseForm((current) => ({ ...current, scope: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="commercial"
              />
              <Input
                type="number"
                value={licenseForm.priceAmount}
                onChange={(event) => setLicenseForm((current) => ({ ...current, priceAmount: event.target.value }))}
                className="border-white/10 bg-white/5 text-white"
                placeholder="500"
              />
            </div>
            <Button onClick={handleMint} className="w-full bg-primary hover:bg-primary/90">
              Queue License Mint
            </Button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="License Ledger" icon={ScrollText}>
        <div className="space-y-3">
          {licenses.length ? (
            licenses.map((license) => (
              <div key={license.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">
                      {assetsById.get(license.ip_asset_id) ?? "Unlinked asset"} • {license.scope}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {templatesById.get(license.license_template_id ?? "") ?? "Custom"} • {license.licensee_name ?? license.licensee_wallet ?? "Unassigned"}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      {money(license.price_amount, license.currency)} • minted {shortDate(license.minted_at || license.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusTone(license.status)}>{license.status}</Badge>
                    {license.status === "active" ? (
                      <Button variant="outline" className="border-white/15 text-white/70" onClick={() => handleRevoke(license.id)}>
                        Revoke
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No licenses minted yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export const RightsAnalyticsPane = () => {
  const { data: metrics = [] } = useQuery({
    queryKey: ["rights", "metrics"],
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

  const totals = metrics.reduce(
    (accumulator, row) => ({
      newAssets: accumulator.newAssets + Number(row.new_assets ?? 0),
      activeLicenses: accumulator.activeLicenses + Number(row.active_licenses ?? 0),
      agreementsSigned: accumulator.agreementsSigned + Number(row.agreements_signed ?? 0),
      transfersCompleted: accumulator.transfersCompleted + Number(row.transfers_completed ?? 0),
      royaltyRevenue: accumulator.royaltyRevenue + Number(row.royalty_revenue ?? 0),
    }),
    { newAssets: 0, activeLicenses: 0, agreementsSigned: 0, transfersCompleted: 0, royaltyRevenue: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <SectionCard title="Assets Added" icon={PackageCheck}>
          <div className="text-3xl font-semibold text-white">{totals.newAssets}</div>
        </SectionCard>
        <SectionCard title="Licenses Active" icon={FileCheck}>
          <div className="text-3xl font-semibold text-white">{totals.activeLicenses}</div>
        </SectionCard>
        <SectionCard title="Agreements Signed" icon={FileSignature}>
          <div className="text-3xl font-semibold text-white">{totals.agreementsSigned}</div>
        </SectionCard>
        <SectionCard title="Transfers Settled" icon={ArrowRightLeft}>
          <div className="text-3xl font-semibold text-white">{totals.transfersCompleted}</div>
        </SectionCard>
        <SectionCard title="Royalty Revenue" icon={BarChart3}>
          <div className="text-3xl font-semibold text-white">{money(totals.royaltyRevenue)}</div>
        </SectionCard>
      </div>

      <SectionCard title="Daily Rights Metrics" icon={BarChart3}>
        <div className="space-y-3">
          {metrics.length ? (
            metrics.map((row) => (
              <div key={row.metric_date} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-6">
                <div>
                  <p className="text-xs text-white/50">Date</p>
                  <p className="text-sm font-medium text-white">{shortDate(row.metric_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">New Assets</p>
                  <p className="text-sm font-medium text-white">{row.new_assets}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Active Licenses</p>
                  <p className="text-sm font-medium text-white">{row.active_licenses}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Agreements</p>
                  <p className="text-sm font-medium text-white">{row.agreements_signed}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Transfers</p>
                  <p className="text-sm font-medium text-white">{row.transfers_completed}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Revenue</p>
                  <p className="text-sm font-medium text-white">{money(row.royalty_revenue)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No rights analytics yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export const RightsSettingsPane = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: assets = [] } = useQuery({
    queryKey: ["rights", "assets"],
    queryFn: async (): Promise<IpAssetRow[]> => {
      const { data, error } = await supabase
        .from("ip_assets")
        .select("id, title, network, registration_status, story_ip_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpAssetRow[];
    },
  });
  const { data: transfers = [] } = useQuery({
    queryKey: ["rights", "transfers"],
    queryFn: async (): Promise<IpTransferRow[]> => {
      const { data, error } = await supabase
        .from("ip_transfers")
        .select("id, ip_asset_id, from_wallet, to_wallet, status, transfer_tx_hash, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IpTransferRow[];
    },
  });
  const [transferForm, setTransferForm] = useState({
    ipAssetId: "",
    fromWallet: "",
    toWallet: "",
  });

  const handleTransfer = async () => {
    try {
      const { error } = await supabase.functions.invoke("rights-transfer", {
        body: {
          ipAssetId: transferForm.ipAssetId,
          fromWallet: transferForm.fromWallet || null,
          toWallet: transferForm.toWallet,
        },
      });
      if (error) throw error;
      setTransferForm({ ipAssetId: "", fromWallet: "", toWallet: "" });
      await queryClient.invalidateQueries({ queryKey: ["rights"] });
      toast({ title: "Transfer requested", description: "The rights transfer has been queued for reconciliation." });
    } catch (error) {
      toast({
        title: "Unable to request transfer",
        description: error instanceof Error ? error.message : "Unknown transfer error.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const { error } = await supabase.functions.invoke("report-export", {
        body: { reportType: "rights-ledger" },
      });
      if (error) throw error;
      toast({ title: "Rights export queued", description: "A report export row has been generated for the IP ledger." });
    } catch (error) {
      toast({
        title: "Unable to export rights ledger",
        description: error instanceof Error ? error.message : "Unknown export error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <SectionCard title="Rights Transfer Controls" icon={ArrowRightLeft}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Asset</Label>
            <select
              value={transferForm.ipAssetId}
              onChange={(event) => setTransferForm((current) => ({ ...current, ipAssetId: event.target.value }))}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <option value="">Choose asset</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.title}
                </option>
              ))}
            </select>
          </div>
          <Input
            value={transferForm.fromWallet}
            onChange={(event) => setTransferForm((current) => ({ ...current, fromWallet: event.target.value }))}
            className="border-white/10 bg-white/5 text-white"
            placeholder="Current owner wallet"
          />
          <Input
            value={transferForm.toWallet}
            onChange={(event) => setTransferForm((current) => ({ ...current, toWallet: event.target.value }))}
            className="border-white/10 bg-white/5 text-white"
            placeholder="Destination wallet"
          />
          <Button onClick={handleTransfer} className="w-full bg-primary hover:bg-primary/90">
            Queue Rights Transfer
          </Button>
          <Button variant="outline" className="w-full border-white/15 text-white/70" onClick={handleExport}>
            Export Rights Ledger
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Transfer History" icon={ScrollText}>
        <div className="space-y-3">
          {transfers.length ? (
            transfers.map((transfer) => (
              <div key={transfer.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{assets.find((asset) => asset.id === transfer.ip_asset_id)?.title ?? "Unlinked asset"}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {transfer.from_wallet ?? "unknown"} → {transfer.to_wallet}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{transfer.transfer_tx_hash ?? "Awaiting transfer hash"}</p>
                  </div>
                  <Badge className={statusTone(transfer.status)}>{transfer.status}</Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No rights transfers requested yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};
