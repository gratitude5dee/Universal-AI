import { useState } from "react";
import { Bot, BrainCircuit, KeyRound, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUserSecrets } from "@/hooks/useUserSecrets";
import { ProviderCapabilityGuard } from "@/components/providers/ProviderCapabilityGuard";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";
import { createBankrAutomationSession, type BankrAutomationResponse } from "@/lib/provider-actions";

export function AdvancedAutomationPanel() {
  const { toast } = useToast();
  const { getSecret } = useUserSecrets();
  const [response, setResponse] = useState<BankrAutomationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    prompt: "Draft a Base launch automation playbook for a new creator token and outline the risk checks.",
    chain: "base",
    objective: "automation" as "research" | "automation" | "profile",
  });

  const hasBankrKey = Boolean(getSecret("bankr_api_key"));

  const submit = async () => {
    if (!hasBankrKey) {
      toast({
        title: "Bankr API key required",
        description: "Add a Bankr API key in Integrations before enabling advanced automation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createBankrAutomationSession(form);
      setResponse(data);
      toast({
        title: "Automation session ready",
        description: "Bankr advanced automation has been isolated from the core launch path.",
      });
    } catch (error) {
      toast({
        title: "Automation preview failed",
        description: error instanceof Error ? error.message : "Unable to prepare the Bankr automation session.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProviderCapabilityGuard feature="trading_automation" title="Advanced automation boundary">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-amber-300" />
                Optional by design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="Bankr" maturity={PROVIDER_CAPABILITIES.bankr.maturity} />
              <p>Advanced automation is opt-in and never blocks the core Clanker or Bags launch paths.</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <KeyRound className="h-5 w-5 text-sky-300" />
                Access model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <p>API key status: {hasBankrKey ? "configured" : "missing"}</p>
              <p>Keys are stored in `user_secrets` and are never embedded in client code.</p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BrainCircuit className="h-5 w-5 text-emerald-300" />
                Secondary provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <ProviderBadge label="Clanker secondary" maturity={PROVIDER_CAPABILITIES.clanker.maturity} />
              <p>Bankr can automate around Base creator launches, but Clanker remains the default launch primitive.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-amber-300" />
              Advanced Automation Session
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="automation-objective">Objective</Label>
                <Input
                  id="automation-objective"
                  value={form.objective}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      objective: event.target.value as "research" | "automation" | "profile",
                    }))
                  }
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="automation"
                />
              </div>
              <div>
                <Label htmlFor="automation-chain">Chain</Label>
                <Input
                  id="automation-chain"
                  value={form.chain}
                  onChange={(event) => setForm((current) => ({ ...current, chain: event.target.value }))}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="base"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="automation-prompt">Automation prompt</Label>
                <Textarea
                  id="automation-prompt"
                  value={form.prompt}
                  onChange={(event) => setForm((current) => ({ ...current, prompt: event.target.value }))}
                  className="min-h-[160px] border-white/10 bg-white/5 text-white"
                />
              </div>
              <Button onClick={submit} disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
                {isSubmitting ? "Preparing Bankr session..." : "Prepare Bankr Automation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Automation preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <div className="flex flex-wrap gap-2">
                <ProviderBadge label="Bankr" maturity={PROVIDER_CAPABILITIES.bankr.maturity} />
              </div>
              <p>Mode: {response.mode}</p>
              <p>Guidance: {response.guidance}</p>
              <p>Next action: {response.nextAction}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderCapabilityGuard>
  );
}
