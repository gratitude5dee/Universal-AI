
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSetupWizard from "@/components/treasury/banking/AccountSetupWizard";
import EmptyState from "@/components/treasury/banking/EmptyState";
import AccountDashboard from "@/components/treasury/banking/AccountDashboard";
import BankingControls from "@/components/treasury/banking/BankingControls";
import ActivityTab from "@/components/treasury/banking/ActivityTab";
import ApiIntegration from "@/components/treasury/banking/ApiIntegration";
import { Landmark, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
import { ProviderBadge } from "@/components/providers/ProviderBadge";
import { PROVIDER_CAPABILITIES } from "@/lib/provider-capabilities";

const AgentBanking: React.FC = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [wizardStep, setWizardStep] = useState(1);
  const [totalSteps] = useState(6);
  
  const startWizard = () => {
    setHasAccount(false);
  };

  const finishWizard = () => {
    setHasAccount(true);
    toast("Agent account created!", {
      description: "Your agent now has a fully functional bank account",
      icon: <Landmark className="h-4 w-4 text-studio-accent" />,
    });
  };

  return (
    <div className="mt-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1 text-shadow-sm">Agent Banking Portal</h2>
        <p className="text-blue-lightest">
          Custodial treasury stays isolated from creator wallets. Crossmint handles custody, thirdweb handles creator EVM UX, and Bankr stays optional for advanced automation.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <Wallet className="h-5 w-5 text-white" />
            <ProviderBadge label={PROVIDER_CAPABILITIES.thirdweb.label} maturity={PROVIDER_CAPABILITIES.thirdweb.maturity} />
          </div>
          <p className="font-medium text-white">Creator funds boundary</p>
          <p className="mt-2 text-sm text-white/60">
            User-facing wallet actions remain on the thirdweb side and do not share custody semantics with this portal.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <ShieldCheck className="h-5 w-5 text-white" />
            <ProviderBadge label={PROVIDER_CAPABILITIES.crossmint.label} maturity={PROVIDER_CAPABILITIES.crossmint.maturity} />
          </div>
          <p className="font-medium text-white">Custodial treasury</p>
          <p className="mt-2 text-sm text-white/60">
            Agent wallets, guarded Solana transfers, and MCP treasury execution stay in the Crossmint custody lane.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <Sparkles className="h-5 w-5 text-white" />
            <ProviderBadge label={PROVIDER_CAPABILITIES.bankr.label} maturity={PROVIDER_CAPABILITIES.bankr.maturity} />
          </div>
          <p className="font-medium text-white">Advanced automation only</p>
          <p className="mt-2 text-sm text-white/60">
            Bankr can automate around treasury intelligence, but it should not replace custody controls or core launch infrastructure.
          </p>
        </div>
      </div>
      
      {!hasAccount ? (
        <AccountSetupWizard 
          wizardStep={wizardStep} 
          totalSteps={totalSteps} 
          setWizardStep={setWizardStep} 
          finishWizard={finishWizard} 
          setHasAccount={setHasAccount}
        />
      ) : (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-6 bg-white/10 backdrop-blur-md border border-blue-primary/30 rounded-xl p-1 shadow-blue-glow">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white data-[state=active]:shadow-blue-glow font-medium text-blue-lightest">
              Account Overview
            </TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white data-[state=active]:shadow-blue-glow font-medium text-blue-lightest">
              Banking Controls
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white data-[state=active]:shadow-blue-glow font-medium text-blue-lightest">
              Transaction Activity
            </TabsTrigger>
            <TabsTrigger value="integration" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white data-[state=active]:shadow-blue-glow font-medium text-blue-lightest">
              API Integration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="outline-none">
            {hasAccount ? <AccountDashboard /> : <EmptyState startWizard={startWizard} />}
          </TabsContent>
          
          <TabsContent value="controls" className="outline-none">
            <BankingControls />
          </TabsContent>
          
          <TabsContent value="activity" className="outline-none">
            <ActivityTab />
          </TabsContent>
          
          <TabsContent value="integration" className="outline-none">
            <ApiIntegration />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AgentBanking;
