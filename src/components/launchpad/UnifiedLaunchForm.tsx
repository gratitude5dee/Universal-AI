import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { LaunchManagementPanel } from "@/components/launchpad/LaunchManagementPanel";

interface UnifiedLaunchFormProps {
  selectedPlatforms?: string[];
  onLaunchComplete?: () => void;
}

export default function UnifiedLaunchForm({
  selectedPlatforms = [],
  onLaunchComplete,
}: UnifiedLaunchFormProps) {
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      onLaunchComplete?.();
    }
  }, [onLaunchComplete, selectedPlatforms.length]);

  return (
    <div className="space-y-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Unified launch form deprecated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/65">
          <p>
            Launch execution is no longer unified across arbitrary platforms. UniversalAI now routes creator launches through explicit provider-specific flows.
          </p>
          <div className="flex flex-wrap gap-2">
            <ProviderBadge label={PROVIDER_CAPABILITIES.clanker.label} maturity={PROVIDER_CAPABILITIES.clanker.maturity} />
            <ProviderBadge label={PROVIDER_CAPABILITIES.bags.label} maturity={PROVIDER_CAPABILITIES.bags.maturity} />
            <ProviderBadge label={PROVIDER_CAPABILITIES.bankr.label} maturity={PROVIDER_CAPABILITIES.bankr.maturity} />
          </div>
          <p>
            Base creator launch uses thirdweb plus Clanker. Solana creator launch uses a route-scoped wallet plus Bags. Bankr remains optional advanced automation.
          </p>
        </CardContent>
      </Card>

      <LaunchManagementPanel />
    </div>
  );
}
