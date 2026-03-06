import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";

const supportedLaunchProviders = [
  PROVIDER_CAPABILITIES.clanker,
  PROVIDER_CAPABILITIES.bags,
  PROVIDER_CAPABILITIES.bankr,
];

export default function PlatformSelector() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Supported launch providers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-white/65">
        <p>
          The legacy multi-platform launcher has been retired. UniversalAI now exposes explicit provider lanes instead of unsupported platform pickers.
        </p>
        <div className="flex flex-wrap gap-2">
          {supportedLaunchProviders.map((provider) => (
            <ProviderBadge key={provider.id} label={provider.label} maturity={provider.maturity} />
          ))}
        </div>
        <p>
          Use Clanker for Base creator launch, Bags for Solana creator launch, and Bankr only for optional advanced automation.
        </p>
      </CardContent>
    </Card>
  );
}
