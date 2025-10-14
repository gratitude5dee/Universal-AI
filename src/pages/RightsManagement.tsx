import { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkProvider } from "@/context/NetworkContext";
import { NetworkSwitcher } from "@/components/rights/NetworkSwitcher";
import { WalletStatusPanel } from "@/components/rights/WalletStatusPanel";
import { AssetHeaderStrip } from "@/components/rights/AssetHeaderStrip";
import { IPLineagePanel } from "@/components/rights/IPLineagePanel";
import { LicensingAtAGlance } from "@/components/rights/LicensingAtAGlance";
import { NetworkStatusCard } from "@/components/rights/NetworkStatusCard";
import RightsJourney from "@/components/rights/RightsJourney";
import CollaboratorEcosystem from "@/components/rights/CollaboratorEcosystem";
import RevenueJourney from "@/components/rights/RevenueJourney";
import IPAgreementVisualizer from "@/components/rights/IPAgreementVisualizer";
import RightsTransferWizard from "@/components/rights/RightsTransferWizard";
import StoryPortal from "@/components/rights/StoryPortal";
import { Shield } from "lucide-react";
import { IPRegistrationWizard } from "@/components/rights/IPRegistrationWizard";

const RightsManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isStoryPortalOpen, setIsStoryPortalOpen] = useState(false);
  const [isRegistrationWizardOpen, setIsRegistrationWizardOpen] = useState(false);

  return (
    <NetworkProvider>
      <DashboardLayout>
        {/* Top App Bar */}
        <div className="border-b border-white/10 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium text-white">UniversalAI / <span className="text-white/70">IP Portal</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <NetworkSwitcher />
              <WalletStatusPanel />
              <Button 
                className="bg-primary hover:bg-primary/80"
                onClick={() => setIsRegistrationWizardOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass-card mb-6 w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AssetHeaderStrip />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IPLineagePanel />
                <CollaboratorEcosystem />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="glass-card border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      IP Rights Timeline
                    </h3>
                    <RightsJourney />
                  </div>
                </div>
                <NetworkStatusCard />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LicensingAtAGlance />
                <RevenueJourney />
              </div>

              <IPAgreementVisualizer />
            </TabsContent>

            <TabsContent value="agreements">
              <IPAgreementVisualizer />
              <div className="mt-6">
                <RightsTransferWizard />
              </div>
            </TabsContent>

            <TabsContent value="licensing">
              <div className="glass-card border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Licensing Management</h2>
                <p className="text-white/70">License catalog and management tools coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="glass-card border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Analytics & Insights</h2>
                <p className="text-white/70">Analytics dashboard coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="glass-card border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <p className="text-white/70">Payout addresses, operator management, and security settings coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>

      {isStoryPortalOpen && <StoryPortal isOpen={isStoryPortalOpen} onClose={() => setIsStoryPortalOpen(false)} />}
      <IPRegistrationWizard isOpen={isRegistrationWizardOpen} onClose={() => setIsRegistrationWizardOpen(false)} />
    </NetworkProvider>
  );
};

export default RightsManagement;
