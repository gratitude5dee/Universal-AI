import { useMemo, useState } from "react";
import { AlertTriangle, Rocket, Sparkles, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProviderCapabilityGuard } from "@/components/providers/ProviderCapabilityGuard";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { createBagsLaunchSession, type BagsLaunchSessionResponse } from "@/lib/provider-actions";
import {
  connectInjectedSolanaWallet,
  hasInjectedSolanaWallet,
  normalizeSolanaAddress,
} from "@/lib/solana-route-wallet";

export function SolanaLaunchPanel() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletProviderLabel, setWalletProviderLabel] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<BagsLaunchSessionResponse | null>(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    website: "",
    twitter: "",
    telegram: "",
    socialHandle: "",
    socialProvider: "twitter" as "twitter" | "farcaster" | "tiktok",
  });

  const hasInjectedWallet = useMemo(() => hasInjectedSolanaWallet(), []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const connection = await connectInjectedSolanaWallet();
      setWalletAddress(connection.address);
      setWalletProviderLabel(connection.providerLabel);
      toast({
        title: "Solana wallet connected",
        description: `${connection.providerLabel} is now scoped to this launch flow.`,
      });
    } catch (error) {
      toast({
        title: "Solana wallet unavailable",
        description: error instanceof Error ? error.message : "Unable to connect a route-scoped Solana wallet.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const submit = async () => {
    const normalizedAddress = normalizeSolanaAddress(walletAddress);
    if (!form.name || !form.symbol || !form.description || !normalizedAddress) {
      toast({
        title: "Missing launch details",
        description: "Name, symbol, description, and Solana wallet are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createBagsLaunchSession({
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        description: form.description,
        launchWallet: normalizedAddress,
        imageUrl: form.imageUrl || undefined,
        website: form.website || undefined,
        twitter: form.twitter || undefined,
        telegram: form.telegram || undefined,
        socialHandle: form.socialHandle || undefined,
        socialProvider: form.socialHandle ? form.socialProvider : undefined,
      });
      setResponse(data);
      toast({
        title: "Bags launch session prepared",
        description: "The Solana launch draft is now isolated to the Bags route-scoped flow.",
      });
    } catch (error) {
      toast({
        title: "Unable to start Bags session",
        description: error instanceof Error ? error.message : "The Bags launch session could not be created.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProviderCapabilityGuard feature="solana_creator_launch" title="Solana launch boundary">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5 text-fuchsia-300" />
                Route-scoped wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="solana_wallet_standard" maturity={PROVIDER_CAPABILITIES.bags.maturity} />
              <p>{walletAddress ? `Active address: ${walletAddress}` : "No Solana wallet connected yet."}</p>
              <p>{walletProviderLabel ?? "Use an injected Solana wallet or paste a public key for preflight."}</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Rocket className="h-5 w-5 text-violet-300" />
                Launch provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="Bags" maturity={PROVIDER_CAPABILITIES.bags.maturity} />
              <p>Owns creator launch metadata, fee-share config, claims, and Solana swap/quote flows.</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
                Boundary rule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <p>thirdweb, Crossmint, and OnchainKit are intentionally excluded from this launch execution path.</p>
              <p>All Solana coupling is isolated to this route so it does not leak into the global EVM wallet stack.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Solana launch draft</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Wallet access</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={connectWallet}
                    disabled={!hasInjectedWallet || isConnecting}
                    variant="outline"
                    className="border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                  >
                    {isConnecting ? "Connecting..." : "Connect injected wallet"}
                  </Button>
                  <span className="text-sm text-white/50">
                    {hasInjectedWallet ? "Detected browser wallet" : "No injected Solana wallet detected"}
                  </span>
                </div>
                <div>
                  <Label htmlFor="solana-wallet-address">Or paste a public key</Label>
                  <Input
                    id="solana-wallet-address"
                    value={walletAddress}
                    onChange={(event) => setWalletAddress(event.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="7xKXtg..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="solana-launch-name">Token Name</Label>
                <Input
                  id="solana-launch-name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="Universal Sol"
                />
              </div>
              <div>
                <Label htmlFor="solana-launch-symbol">Symbol</Label>
                <Input
                  id="solana-launch-symbol"
                  value={form.symbol}
                  onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value.toUpperCase() }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="USOL"
                />
              </div>
              <div>
                <Label htmlFor="solana-launch-description">Description</Label>
                <Textarea
                  id="solana-launch-description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-[120px] border-white/10 bg-white/5 text-white"
                  placeholder="A creator token launched through Bags with isolated Solana wallet state."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="solana-launch-image">Image URL</Label>
                <Input
                  id="solana-launch-image"
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="solana-launch-website">Website</Label>
                <Input
                  id="solana-launch-website"
                  value={form.website}
                  onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="https://universalai.app"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="solana-launch-twitter">Twitter / X</Label>
                  <Input
                    id="solana-launch-twitter"
                    value={form.twitter}
                    onChange={(event) => setForm((current) => ({ ...current, twitter: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="@universalai"
                  />
                </div>
                <div>
                  <Label htmlFor="solana-launch-telegram">Telegram</Label>
                  <Input
                    id="solana-launch-telegram"
                    value={form.telegram}
                    onChange={(event) => setForm((current) => ({ ...current, telegram: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="https://t.me/universalai"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="solana-social-provider">Social provider</Label>
                  <Input
                    id="solana-social-provider"
                    value={form.socialProvider}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        socialProvider: event.target.value as "twitter" | "farcaster" | "tiktok",
                      }))
                    }
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="twitter"
                  />
                </div>
                <div>
                  <Label htmlFor="solana-social-handle">Social handle</Label>
                  <Input
                    id="solana-social-handle"
                    value={form.socialHandle}
                    onChange={(event) => setForm((current) => ({ ...current, socialHandle: event.target.value }))}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="@creator"
                  />
                </div>
              </div>
              <Button onClick={submit} disabled={isSubmitting} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90">
                {isSubmitting ? "Preparing Bags session..." : "Prepare Bags Launch Session"}
              </Button>
              <p className="text-xs text-white/50">
                This route-scoped wallet experience is isolated to Solana launch only. The global app wallet remains thirdweb-owned.
              </p>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                Bags launch session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <div className="flex flex-wrap gap-2">
                <ProviderBadge label={response.launchProvider} maturity={PROVIDER_CAPABILITIES.bags.maturity} />
                <ProviderBadge label={response.walletProvider} maturity={PROVIDER_CAPABILITIES.bags.maturity} />
              </div>
              <p>Session ID: {response.sessionId}</p>
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
