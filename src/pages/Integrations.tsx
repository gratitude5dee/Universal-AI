import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bolt,
  ExternalLink,
  KeyRound,
  Layers3,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUserSecrets } from "@/hooks/useUserSecrets";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import type { ProviderCapability } from "@/types/provider-boundary";
import { motion } from "framer-motion";

const supportedProviders = [
  PROVIDER_CAPABILITIES.thirdweb,
  PROVIDER_CAPABILITIES.clanker,
  PROVIDER_CAPABILITIES.bags,
  PROVIDER_CAPABILITIES.crossmint,
];

const advancedProviders = [PROVIDER_CAPABILITIES.bankr, PROVIDER_CAPABILITIES.onchainkit];
const serverProviders = [PROVIDER_CAPABILITIES.thirdweb_engine];

const USER_MANAGED_SECRET_TYPES = new Set(["bags_api_key", "bankr_api_key"]);

function formatFeatureLabel(feature: string) {
  return feature.replaceAll("_", " ");
}

function getProviderStatus(
  provider: ProviderCapability,
  address: string | null,
  getSecret: (secretType: string) => string | null,
) {
  if (provider.id === "thirdweb") {
    return address ? "Wallet connected" : "Awaiting wallet connection";
  }

  if (provider.id === "clanker") {
    return address ? "Ready with connected thirdweb wallet" : "Needs thirdweb wallet";
  }

  if (provider.secretType && USER_MANAGED_SECRET_TYPES.has(provider.secretType)) {
    return getSecret(provider.secretType) ? "API key configured" : "API key missing";
  }

  return provider.maturity === "server" || provider.id === "crossmint"
    ? "Server managed"
    : "Available";
}

const ProviderPanel = ({
  provider,
  address,
  getSecret,
  draftValue,
  onDraftChange,
  onSaveSecret,
  onDeleteSecret,
  savingSecretType,
}: {
  provider: ProviderCapability;
  address: string | null;
  getSecret: (secretType: string) => string | null;
  draftValue: string;
  onDraftChange: (value: string) => void;
  onSaveSecret: (secretType: string) => Promise<void>;
  onDeleteSecret: (secretType: string) => Promise<void>;
  savingSecretType: string | null;
}) => {
  const status = getProviderStatus(provider, address, getSecret);
  const canManageSecret = Boolean(provider.secretType && USER_MANAGED_SECRET_TYPES.has(provider.secretType));
  const secretValue = provider.secretType ? getSecret(provider.secretType) : null;

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-white">{provider.label}</CardTitle>
              <ProviderBadge label={provider.maturity} maturity={provider.maturity} />
            </div>
            <p className="mt-2 text-sm text-white/65">{provider.description}</p>
          </div>
          <Badge variant="outline" className="border-white/20 text-white/70">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {provider.features.map((feature) => (
            <Badge key={feature} variant="outline" className="border-white/10 text-white/60">
              {formatFeatureLabel(feature)}
            </Badge>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Supported chains</p>
            <p className="mt-2 text-sm capitalize text-white/60">{provider.chains.join(", ")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Custody modes</p>
            <p className="mt-2 text-sm text-white/60">{provider.custodyModes.join(", ")}</p>
          </div>
        </div>

        {provider.notes.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Boundary notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/60">
              {provider.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {canManageSecret && provider.secretType && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-white">
              <KeyRound className="h-4 w-4 text-amber-300" />
              User-managed secret
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              <Input
                value={draftValue}
                onChange={(event) => onDraftChange(event.target.value)}
                className="border-white/10 bg-white/5 text-white"
                placeholder={secretValue ? "Stored. Enter a new value to rotate." : "Paste API key"}
                type="password"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => onSaveSecret(provider.secretType!)}
                  disabled={!draftValue || savingSecretType === provider.secretType}
                  className="bg-gradient-to-r from-studio-accent to-blue-500"
                >
                  {savingSecretType === provider.secretType ? "Saving..." : "Save"}
                </Button>
                {secretValue && (
                  <Button
                    variant="outline"
                    onClick={() => onDeleteSecret(provider.secretType!)}
                    disabled={savingSecretType === provider.secretType}
                    className="border-white/20 text-white/70"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {!canManageSecret && provider.secretType && (
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100/90">
            This provider is intentionally server-managed. Configure `{provider.secretType}` in platform env or operator tooling, not in creator profile data.
          </div>
        )}

        {provider.docsHref && (
          <a
            href={provider.docsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-studio-accent transition-opacity hover:opacity-80"
          >
            View provider docs
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

const Integrations = () => {
  const { toast } = useToast();
  const { address } = useEvmWallet();
  const { getSecret, upsertSecret, deleteSecret, loading } = useUserSecrets();
  const [draftSecrets, setDraftSecrets] = useState<Record<string, string>>({});
  const [savingSecretType, setSavingSecretType] = useState<string | null>(null);

  const stats = useMemo(
    () => [
      {
        label: "Supported Core",
        value: supportedProviders.length,
        icon: BadgeCheck,
        accent: "from-emerald-500/10 to-green-500/10",
      },
      {
        label: "Advanced Optional",
        value: advancedProviders.length,
        icon: Sparkles,
        accent: "from-amber-500/10 to-orange-500/10",
      },
      {
        label: "Server Managed",
        value: serverProviders.length,
        icon: ShieldCheck,
        accent: "from-sky-500/10 to-blue-500/10",
      },
      {
        label: "Wallet Status",
        value: address ? "Connected" : "Pending",
        icon: Wallet,
        accent: "from-violet-500/10 to-fuchsia-500/10",
      },
    ],
    [address],
  );

  const handleSaveSecret = async (secretType: string) => {
    const value = draftSecrets[secretType]?.trim();
    if (!value) return;
    setSavingSecretType(secretType);
    try {
      await upsertSecret(secretType, value);
      setDraftSecrets((current) => ({ ...current, [secretType]: "" }));
      toast({
        title: "Provider secret saved",
        description: `${secretType} is now stored in user_secrets.`,
      });
    } catch (error) {
      toast({
        title: "Unable to save secret",
        description: error instanceof Error ? error.message : "Unknown provider secret error.",
        variant: "destructive",
      });
    } finally {
      setSavingSecretType(null);
    }
  };

  const handleDeleteSecret = async (secretType: string) => {
    setSavingSecretType(secretType);
    try {
      await deleteSecret(secretType);
      toast({
        title: "Provider secret removed",
        description: `${secretType} was deleted from user_secrets.`,
      });
    } catch (error) {
      toast({
        title: "Unable to remove secret",
        description: error instanceof Error ? error.message : "Unknown provider secret error.",
        variant: "destructive",
      });
    } finally {
      setSavingSecretType(null);
    }
  };

  return (
    <DashboardLayout>
      <Content
        title="Provider Integrations"
        subtitle="UniversalAI now distinguishes supported core providers, advanced optional tooling, and server-managed execution infrastructure."
      >
        <div className="space-y-8">
          <motion.div
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-xl border border-white/10 bg-gradient-to-br p-6 ${stat.accent}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-white" />
                    <Badge className="bg-white/10 text-white/80">{stat.label}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </motion.div>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Layers3 className="h-5 w-5 text-studio-accent" />
                Boundary summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">thirdweb</p>
                <p className="mt-2 text-sm text-white/60">Primary EVM wallet and contract UX.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Clanker + Bags</p>
                <p className="mt-2 text-sm text-white/60">Supported creator launch providers for Base and Solana.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Crossmint + Engine</p>
                <p className="mt-2 text-sm text-white/60">Custody and delegated server execution only.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Bankr + OnchainKit</p>
                <p className="mt-2 text-sm text-white/60">Optional advanced automation and widget UI, never app root ownership.</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="supported" className="w-full">
            <TabsList className="h-auto w-full flex-wrap gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
              <TabsTrigger value="supported">Supported</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="server">Server</TabsTrigger>
            </TabsList>

            <TabsContent value="supported" className="mt-6">
              <div className="grid gap-6">
                {supportedProviders.map((provider) => (
                  <ProviderPanel
                    key={provider.id}
                    provider={provider}
                    address={address}
                    getSecret={getSecret}
                    draftValue={draftSecrets[provider.secretType ?? provider.id] ?? ""}
                    onDraftChange={(value) =>
                      setDraftSecrets((current) => ({
                        ...current,
                        [provider.secretType ?? provider.id]: value,
                      }))
                    }
                    onSaveSecret={handleSaveSecret}
                    onDeleteSecret={handleDeleteSecret}
                    savingSecretType={savingSecretType}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="grid gap-6">
                {advancedProviders.map((provider) => (
                  <ProviderPanel
                    key={provider.id}
                    provider={provider}
                    address={address}
                    getSecret={getSecret}
                    draftValue={draftSecrets[provider.secretType ?? provider.id] ?? ""}
                    onDraftChange={(value) =>
                      setDraftSecrets((current) => ({
                        ...current,
                        [provider.secretType ?? provider.id]: value,
                      }))
                    }
                    onSaveSecret={handleSaveSecret}
                    onDeleteSecret={handleDeleteSecret}
                    savingSecretType={savingSecretType}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="server" className="mt-6">
              <div className="grid gap-6">
                {serverProviders.map((provider) => (
                  <ProviderPanel
                    key={provider.id}
                    provider={provider}
                    address={address}
                    getSecret={getSecret}
                    draftValue={draftSecrets[provider.secretType ?? provider.id] ?? ""}
                    onDraftChange={(value) =>
                      setDraftSecrets((current) => ({
                        ...current,
                        [provider.secretType ?? provider.id]: value,
                      }))
                    }
                    onSaveSecret={handleSaveSecret}
                    onDeleteSecret={handleDeleteSecret}
                    savingSecretType={savingSecretType}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {loading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              Loading provider secret status...
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            <div className="mb-2 flex items-center gap-2 text-white">
              <Bolt className="h-4 w-4 text-amber-300" />
              Storage rule
            </div>
            Provider secrets live in `user_secrets` or server environment variables only. They are not stored in creator profile rows or client bundles.
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Integrations;
