import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlatformSelector } from "../PlatformSelector";
import type { ChainId } from "@/types/on-chain";
import { ArrowLeft, ArrowRight, Coins, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemeTokenWizardProps {
  onComplete: (config: any) => void;
  onBack: () => void;
}

const supportedChains: Array<{
  id: ChainId;
  name: string;
  subtitle: string;
  body: string;
  icon: typeof Coins;
  recommendedProvider: string;
}> = [
  {
    id: "base",
    name: "Base",
    subtitle: "Creator token launch",
    body: "Use the creator's thirdweb wallet and route deployment through Clanker. Engine stays server-side only.",
    icon: Coins,
    recommendedProvider: "clanker",
  },
  {
    id: "solana",
    name: "Solana",
    subtitle: "Creator token launch",
    body: "Use a route-scoped Solana wallet connection and route launch, fee claims, and swaps through Bags.",
    icon: Rocket,
    recommendedProvider: "bags",
  },
];

const providerRequirements: Record<string, ChainId[]> = {
  clanker: ["base"],
  bags: ["solana"],
  bankr: ["base", "solana"],
};

export const MemeTokenWizard = ({ onComplete, onBack }: MemeTokenWizardProps) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: "",
    symbol: "",
    description: "",
    totalSupply: 1_000_000,
    selectedChains: [] as ChainId[],
    selectedPlatforms: [] as string[],
  });

  const chainHints = useMemo(() => {
    const hints = new Set<string>();
    if (config.selectedChains.includes("base")) hints.add("clanker");
    if (config.selectedChains.includes("solana")) hints.add("bags");
    return Array.from(hints);
  }, [config.selectedChains]);

  const toggleChain = (chainId: ChainId) => {
    setConfig((current) => {
      const selectedChains = current.selectedChains.includes(chainId)
        ? current.selectedChains.filter((chain) => chain !== chainId)
        : [...current.selectedChains, chainId];

      const selectedPlatforms = current.selectedPlatforms.filter((providerId) => {
        const supportedBy = providerRequirements[providerId];
        if (!supportedBy) return false;
        return selectedChains.some((chain) => supportedBy.includes(chain));
      });

      return {
        ...current,
        selectedChains,
        selectedPlatforms,
      };
    });
  };

  const toggleProvider = (providerId: string) => {
    setConfig((current) => ({
      ...current,
      selectedPlatforms: current.selectedPlatforms.includes(providerId)
        ? current.selectedPlatforms.filter((platform) => platform !== providerId)
        : [...current.selectedPlatforms, providerId],
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const handleDeploy = () => {
    onComplete({
      ...config,
      launchProviders: config.selectedPlatforms,
      executionBoundary: {
        evmWallet: "thirdweb",
        baseLaunch: config.selectedPlatforms.includes("clanker") ? "clanker" : null,
        solanaLaunch: config.selectedPlatforms.includes("bags") ? "bags" : null,
        advancedAutomation: config.selectedPlatforms.includes("bankr"),
      },
    });
  };

  const isStepValid = () => {
    if (step === 1) return Boolean(config.name && config.symbol && config.description);
    if (step === 2) return config.selectedChains.length > 0;
    if (step === 3) {
      if (config.selectedPlatforms.length === 0) return false;
      return config.selectedPlatforms.every((providerId) => {
        const supportedBy = providerRequirements[providerId];
        return supportedBy?.some((chain) => config.selectedChains.includes(chain));
      });
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((currentStep) => (
            <div
              key={currentStep}
              className={cn(
                "h-2 w-12 rounded-full transition-colors",
                currentStep <= step ? "bg-studio-accent" : "bg-white/10",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-white/60">Step {step} of 3</span>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Token Details</h3>
              <p className="text-sm text-white/60">
                Define the token first. The deployment path is chosen separately so provider ownership stays explicit.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(event) => setConfig({ ...config, name: event.target.value })}
                  placeholder="e.g., Universal Creator Coin"
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>

              <div>
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={config.symbol}
                  onChange={(event) => setConfig({ ...config, symbol: event.target.value.toUpperCase() })}
                  placeholder="e.g., UAI"
                  className="border-white/10 bg-white/5 text-white"
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(event) => setConfig({ ...config, description: event.target.value })}
                  placeholder="Tell the community what your token is about..."
                  className="min-h-[100px] border-white/10 bg-white/5 text-white"
                />
              </div>

              <div>
                <Label htmlFor="supply">Total Supply</Label>
                <Input
                  id="supply"
                  type="number"
                  value={config.totalSupply}
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      totalSupply: Number.parseInt(event.target.value || "0", 10),
                    })
                  }
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Select Supported Chains</h3>
              <p className="text-sm text-white/60">
                v1 only supports Base and Solana for creator-token launch. Each chain maps to a specific execution provider.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {supportedChains.map((chain) => {
                const selected = config.selectedChains.includes(chain.id);
                const Icon = chain.icon;
                return (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => toggleChain(chain.id)}
                    className={cn(
                      "rounded-xl border p-5 text-left transition-all",
                      selected
                        ? "border-studio-accent bg-studio-accent/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                    )}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-white/10 p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">{chain.subtitle}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">{chain.name}</h4>
                    <p className="mt-2 text-sm text-white/60">{chain.body}</p>
                    <p className="mt-4 text-xs text-white/45">Recommended provider: {chain.recommendedProvider}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Choose Execution Providers</h3>
              <p className="text-sm text-white/60">
                Provider selection is restricted to supported ownership boundaries. Bankr is optional and does not replace the core launch provider.
              </p>
            </div>

            <PlatformSelector
              selectedChains={config.selectedChains}
              selectedPlatforms={config.selectedPlatforms}
              onToggle={toggleProvider}
            />

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Launch routing summary
              </div>
              <p className="mt-2 text-sm text-white/60">
                Base routes to: {config.selectedChains.includes("base") ? "thirdweb wallet + Clanker" : "not selected"}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Solana routes to: {config.selectedChains.includes("solana") ? "route-scoped wallet + Bags" : "not selected"}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Recommended providers from current chain selection: {chainHints.length > 0 ? chainHints.join(", ") : "none yet"}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between pt-4">
        <Button onClick={handleBack} variant="outline" className="border-white/20 text-white/70">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-studio-accent to-blue-500"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleDeploy}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-studio-accent to-blue-500"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Prepare Token Launch
          </Button>
        )}
      </div>
    </div>
  );
};
