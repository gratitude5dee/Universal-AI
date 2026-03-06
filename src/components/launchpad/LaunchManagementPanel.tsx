import { ArrowRight, BarChart3, Coins, Sparkles, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";

const panels = [
  {
    title: "Base Launch Ops",
    body: "Clanker launches stay tied to the creator's thirdweb wallet, while post-launch admin actions can escalate to Engine-only server execution.",
    provider: PROVIDER_CAPABILITIES.clanker,
    icon: Coins,
    action: "Review launch jobs",
  },
  {
    title: "Solana Fee + Claim Flow",
    body: "Bags owns creator token analytics, claims, and swap-related actions. Solana wallet state stays isolated to the launch route.",
    provider: PROVIDER_CAPABILITIES.bags,
    icon: Wallet,
    action: "Inspect Bags sessions",
  },
  {
    title: "Advanced Automation",
    body: "Bankr remains optional for advanced automation, market research, and operator-driven post-launch tasks.",
    provider: PROVIDER_CAPABILITIES.bankr,
    icon: Sparkles,
    action: "Configure automation",
  },
];

export function LaunchManagementPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <Card key={panel.title} className="border border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-white/10 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ProviderBadge label={panel.provider.label} maturity={panel.provider.maturity} />
                </div>
                <CardTitle className="text-white">{panel.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/65">{panel.body}</p>
                <Button variant="outline" className="w-full border-white/15 bg-white/5 text-white/80 hover:bg-white/10">
                  {panel.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-emerald-300" />
            Provider Boundary Health
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-white/70 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">Creator wallet ownership</p>
            <p className="mt-1">thirdweb remains the only primary creator-facing EVM wallet layer.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">Custody isolation</p>
            <p className="mt-1">Crossmint custody is isolated to treasury/operator flows and never replaces creator wallet UX.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
