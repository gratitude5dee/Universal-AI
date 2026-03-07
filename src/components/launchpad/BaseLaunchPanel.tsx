import { useState } from "react";
import { AlertCircle, Coins, Rocket, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProviderCapabilityGuard } from "@/components/providers/ProviderCapabilityGuard";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { createClankerPreflight, type ClankerPreflightResponse } from "@/lib/provider-actions";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { useWeb3 } from "@/context/Web3Context";
import { WalletLinkBanner } from "@/components/web3/WalletLinkBanner";

export function BaseLaunchPanel() {
  const { toast } = useToast();
  const { address, chainId, chainMeta } = useEvmWallet();
  const { writesEnabled } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ClankerPreflightResponse | null>(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    website: "",
    twitter: "",
    telegram: "",
    devBuyEth: "0.0",
    vestingDays: "0",
  });

  const submit = async () => {
    if (!address || !chainId) return;
    if (!form.name || !form.symbol || !form.description) {
      toast({
        title: "Missing token details",
        description: "Name, symbol, and description are required before preflight.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createClankerPreflight({
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        description: form.description,
        walletAddress: address,
        chainId,
        imageUrl: form.imageUrl || undefined,
        website: form.website || undefined,
        twitter: form.twitter || undefined,
        telegram: form.telegram || undefined,
        devBuyEth: Number(form.devBuyEth || 0),
        vestingDays: Number(form.vestingDays || 0),
      });
      setResponse(data);
      toast({
        title: "Clanker preflight ready",
        description: "The launch request has been normalized around the thirdweb + Clanker boundary.",
      });
    } catch (error) {
      toast({
        title: "Preflight failed",
        description: error instanceof Error ? error.message : "Unable to prepare the Clanker launch payload.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProviderCapabilityGuard
      feature="base_creator_launch"
      requireConnectedEvmWallet
      title="Connect an EVM wallet for Base launch"
      description="Base launch uses thirdweb for the creator wallet and Clanker for the deployment workflow."
    >
      <div className="space-y-6">
        <WalletLinkBanner />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                Wallet boundary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="thirdweb" maturity={PROVIDER_CAPABILITIES.thirdweb.maturity} />
              <p>Connected address: {address ?? "Not connected"}</p>
              <p>Active chain: {chainMeta?.name ?? "Unknown"} ({chainId ?? "—"})</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Coins className="h-5 w-5 text-orange-300" />
                Launch provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="Clanker" maturity={PROVIDER_CAPABILITIES.clanker.maturity} />
              <p>Default Base creator-token deployment path with user-signed wallet execution.</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="h-5 w-5 text-sky-300" />
                Server role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="Engine optional" maturity={PROVIDER_CAPABILITIES.thirdweb_engine.maturity} />
              <p>Engine stays reserved for delegated admin execution, not direct creator launches.</p>
              <p>Wallet writes enabled: {writesEnabled ? "yes" : "no"}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Rocket className="h-5 w-5 text-orange-300" />
              Base Launch Preflight
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="base-launch-name">Token Name</Label>
                <Input
                  id="base-launch-name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="Universal Creator"
                />
              </div>
              <div>
                <Label htmlFor="base-launch-symbol">Symbol</Label>
                <Input
                  id="base-launch-symbol"
                  value={form.symbol}
                  onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value.toUpperCase() }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="UAI"
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="base-launch-description">Description</Label>
                <Textarea
                  id="base-launch-description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-[120px] border-white/10 bg-white/5 text-white"
                  placeholder="Creator token aligned to the UniversalAI provider boundary."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="base-launch-image">Image URL</Label>
                <Input
                  id="base-launch-image"
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="ipfs://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="base-launch-devbuy">Dev Buy (ETH)</Label>
                  <Input
                    id="base-launch-devbuy"
                    value={form.devBuyEth}
                    onChange={(event) => setForm((current) => ({ ...current, devBuyEth: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="base-launch-vesting">Vesting Days</Label>
                  <Input
                    id="base-launch-vesting"
                    value={form.vestingDays}
                    onChange={(event) => setForm((current) => ({ ...current, vestingDays: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="base-launch-website">Website</Label>
                <Input
                  id="base-launch-website"
                  value={form.website}
                  onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="https://universalai.app"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="base-launch-twitter">Twitter / X</Label>
                  <Input
                    id="base-launch-twitter"
                    value={form.twitter}
                    onChange={(event) => setForm((current) => ({ ...current, twitter: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="@universalai"
                  />
                </div>
                <div>
                  <Label htmlFor="base-launch-telegram">Telegram</Label>
                  <Input
                    id="base-launch-telegram"
                    value={form.telegram}
                    onChange={(event) => setForm((current) => ({ ...current, telegram: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="https://t.me/universalai"
                  />
                </div>
              </div>
              <Button onClick={submit} disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90">
                {isSubmitting ? "Preparing preflight..." : "Prepare Clanker Launch"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Preflight response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <div className="flex flex-wrap gap-2">
                <ProviderBadge label={response.launchProvider} maturity={PROVIDER_CAPABILITIES.clanker.maturity} />
                <ProviderBadge label={response.walletProvider} maturity={PROVIDER_CAPABILITIES.thirdweb.maturity} />
              </div>
              <p>Preflight ID: {response.preflightId}</p>
              <p>Mode: {response.mode}</p>
              <p>Next action: {response.nextAction}</p>
              {response.warnings.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-white/60">
                  {response.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderCapabilityGuard>
  );
}
