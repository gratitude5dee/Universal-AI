import { Coins, Layers3, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { BaseLaunchPanel } from "@/components/launchpad/BaseLaunchPanel";
import { SolanaLaunchPanel } from "@/components/launchpad/SolanaLaunchPanel";
import { AdvancedAutomationPanel } from "@/components/launchpad/AdvancedAutomationPanel";
import { LaunchManagementPanel } from "@/components/launchpad/LaunchManagementPanel";

const boundaryHighlights = [
  {
    title: "Creator wallet ownership",
    body: "thirdweb is the only creator-facing EVM wallet and contract UX layer in UniversalAI.",
    provider: PROVIDER_CAPABILITIES.thirdweb,
    icon: ShieldCheck,
  },
  {
    title: "Base launch default",
    body: "Clanker owns creator token launch on Base, with optional Engine escalation for delegated server actions only.",
    provider: PROVIDER_CAPABILITIES.clanker,
    icon: Coins,
  },
  {
    title: "Solana launch route",
    body: "Bags owns Solana launch, swap, and fee flows behind a route-scoped wallet boundary.",
    provider: PROVIDER_CAPABILITIES.bags,
    icon: Rocket,
  },
  {
    title: "Advanced automation",
    body: "Bankr stays opt-in for automation and research. It never replaces the core launch path.",
    provider: PROVIDER_CAPABILITIES.bankr,
    icon: Sparkles,
  },
];

export function LaunchProviderWorkbench() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {boundaryHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-white/10 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ProviderBadge label={item.provider.label} maturity={item.provider.maturity} />
                </div>
                <CardTitle className="text-lg text-white">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/65">{item.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-auto w-full flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-white/15">
            <Layers3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="base" className="gap-2 data-[state=active]:bg-white/15">
            <Coins className="h-4 w-4" />
            Base Launch
          </TabsTrigger>
          <TabsTrigger value="solana" className="gap-2 data-[state=active]:bg-white/15">
            <Rocket className="h-4 w-4" />
            Solana Launch
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2 data-[state=active]:bg-white/15">
            <Sparkles className="h-4 w-4" />
            Advanced Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Provider ownership model</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Supported core</p>
                <p className="mt-2 text-sm text-white/65">
                  thirdweb powers EVM wallet UX, Clanker handles Base launches, Bags handles Solana launches, and Crossmint stays limited to custodial treasury surfaces.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Execution boundary</p>
                <p className="mt-2 text-sm text-white/65">
                  Engine is reserved for delegated EVM admin execution. Bankr is advanced-only. OnchainKit remains optional widget UI and never replaces the root wallet stack.
                </p>
              </div>
            </CardContent>
          </Card>

          <LaunchManagementPanel />
        </TabsContent>

        <TabsContent value="base" className="mt-6">
          <BaseLaunchPanel />
        </TabsContent>

        <TabsContent value="solana" className="mt-6">
          <SolanaLaunchPanel />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedAutomationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
