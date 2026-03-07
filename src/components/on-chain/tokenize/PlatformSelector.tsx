import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import type { ChainId } from "@/types/on-chain";
import { Check, Coins, Rocket, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onToggle: (platformId: string) => void;
  selectedChains?: ChainId[];
}

interface SupportedLaunchProvider {
  id: "clanker" | "bags" | "bankr";
  name: string;
  description: string;
  role: string;
  chains: ChainId[];
  icon: typeof Coins;
  recommended: string;
  advanced?: boolean;
}

const supportedProviders: SupportedLaunchProvider[] = [
  {
    id: "clanker",
    name: "Clanker",
    description: "Default Base creator-token launch path tied to the creator's thirdweb wallet.",
    role: "Base Launch",
    chains: ["base"],
    icon: Coins,
    recommended: "Recommended for Base creator token launch",
  },
  {
    id: "bags",
    name: "Bags",
    description: "Supported Solana launch flow for creator tokens, fee claims, and swap-aware post-launch tooling.",
    role: "Solana Launch",
    chains: ["solana"],
    icon: Rocket,
    recommended: "Recommended for Solana creator launch",
  },
  {
    id: "bankr",
    name: "Bankr",
    description: "Optional advanced automation, research, and post-launch execution overlay.",
    role: "Advanced Automation",
    chains: ["base", "solana"],
    icon: Sparkles,
    recommended: "Optional advanced mode only",
    advanced: true,
  },
];

export const PlatformSelector = ({
  selectedPlatforms,
  onToggle,
  selectedChains = [],
}: PlatformSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = useMemo(() => {
    return supportedProviders.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedChains.length === 0) return true;
      return provider.chains.some((chain) => selectedChains.includes(chain));
    });
  }, [searchQuery, selectedChains]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Select Supported Launch Providers</h3>
            <p className="text-sm text-white/60">
              UniversalAI supports Clanker for Base launch, Bags for Solana launch, and Bankr for optional advanced automation.
            </p>
          </div>
          {selectedPlatforms.length > 0 && (
            <Badge variant="secondary" className="bg-studio-accent/20 text-studio-accent">
              {selectedPlatforms.length} provider{selectedPlatforms.length === 1 ? "" : "s"} selected
            </Badge>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Search supported providers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProviders.map((provider) => {
          const capability = PROVIDER_CAPABILITIES[provider.id];
          const selected = selectedPlatforms.includes(provider.id);
          const Icon = provider.icon;
          return (
            <motion.button
              key={provider.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggle(provider.id)}
              className={cn(
                "relative overflow-hidden rounded-xl border p-4 text-left transition-all",
                selected
                  ? "border-studio-accent bg-studio-accent/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
              )}
            >
              {selected && (
                <div className="absolute right-3 top-3 rounded-full bg-studio-accent p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-white/10 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ProviderBadge label={capability.label} maturity={capability.maturity} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{provider.name}</h4>
                    {provider.advanced && (
                      <Badge variant="outline" className="border-amber-300/30 text-amber-200">
                        Advanced
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/60">{provider.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {provider.role}
                  </Badge>
                  {provider.chains.map((chain) => (
                    <Badge key={chain} variant="outline" className="border-white/20 text-white/60 capitalize">
                      {chain}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-white/50">{provider.recommended}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filteredProviders.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white">No supported providers match the selected networks.</p>
          <p className="mt-2 text-sm text-white/60">Base maps to Clanker. Solana maps to Bags. Bankr stays optional.</p>
        </div>
      )}

      {selectedPlatforms.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-studio-accent/30 bg-studio-accent/10 p-4">
          <div>
            <p className="text-sm font-medium text-white">Execution boundary set</p>
            <p className="text-xs text-white/60">
              Core launch remains provider-specific and advanced automation stays opt-in.
            </p>
          </div>
          <Button
            onClick={() => selectedPlatforms.forEach((platformId) => onToggle(platformId))}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:bg-white/5"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};
