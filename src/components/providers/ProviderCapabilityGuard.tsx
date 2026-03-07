import { AlertTriangle, CheckCircle2, LockKeyhole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";
import { getProviderBoundary } from "@/lib/provider-capabilities";
import { ProviderBadge } from "./ProviderBadge";
import { useEvmWallet } from "@/context/EvmWalletContext";
import type { ProviderFeature } from "@/types/provider-boundary";

export function ProviderCapabilityGuard({
  feature,
  children,
  requireConnectedEvmWallet = false,
  title,
  description,
}: {
  feature: ProviderFeature;
  children: React.ReactNode;
  requireConnectedEvmWallet?: boolean;
  title?: string;
  description?: string;
}) {
  const boundary = getProviderBoundary(feature);
  const { address } = useEvmWallet();

  if (requireConnectedEvmWallet && !address) {
    return (
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/15 p-2 text-amber-200">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-white">{title ?? "Wallet Connection Required"}</CardTitle>
              <p className="text-sm text-white/60">
                {description ??
                  `This workflow is owned by ${boundary.primary.label} and requires an external EVM wallet connection.`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ProviderBadge label={boundary.primary.label} maturity={boundary.primary.maturity} />
            {boundary.secondary.map((provider) => (
              <ProviderBadge key={provider.id} label={`${provider.label} optional`} maturity={provider.maturity} />
            ))}
          </div>
          <div className="[&_button]:!w-full [&_button]:!h-11 [&_button]:!rounded-lg">
            <ConnectWalletButton label="Connect thirdweb Wallet" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (boundary.primary.maturity === "backlog") {
    return (
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardContent className="flex items-start gap-3 p-6 text-white/80">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
          <div>
            <p className="font-medium text-white">This workflow is not part of the supported provider boundary.</p>
            <p className="mt-1 text-sm text-white/60">
              The provider matrix currently marks {boundary.primary.label} as backlog-only for this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
        <span>Primary owner: {boundary.primary.label}</span>
        <ProviderBadge label={boundary.primary.maturity} maturity={boundary.primary.maturity} />
        {boundary.secondary.map((provider) => (
          <ProviderBadge key={provider.id} label={`${provider.label} optional`} maturity={provider.maturity} />
        ))}
      </div>
      {children}
    </div>
  );
}
