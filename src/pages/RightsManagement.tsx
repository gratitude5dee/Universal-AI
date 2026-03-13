import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkProvider } from "@/context/NetworkContext";
import { NetworkSwitcher } from "@/components/rights/NetworkSwitcher";
import { WalletStatusPanel } from "@/components/rights/WalletStatusPanel";
import { IPRegistrationWizard } from "@/components/rights/IPRegistrationWizard";
import {
  RightsAgreementsPane,
  RightsAnalyticsPane,
  RightsLicensingPane,
  RightsOverviewPane,
  RightsSettingsPane,
} from "@/components/rights/RightsWorkbench";

const RightsManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRegistrationWizardOpen, setIsRegistrationWizardOpen] = useState(false);

  return (
    <NetworkProvider>
      <DashboardLayout>
        <div className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div>
              <h1 className="text-xl font-medium text-[hsl(var(--text-primary))]">
                UniversalAI / <span className="text-[hsl(var(--text-secondary))]">IP Portal</span>
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Registered assets, agreements, licenses, transfers, and rights analytics now run from the backend ledger.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NetworkSwitcher />
              <WalletStatusPanel />
              <Button className="bg-primary hover:bg-primary/80" onClick={() => setIsRegistrationWizardOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-fit bg-white/5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview">
                <RightsOverviewPane />
              </TabsContent>
              <TabsContent value="agreements">
                <RightsAgreementsPane />
              </TabsContent>
              <TabsContent value="licensing">
                <RightsLicensingPane />
              </TabsContent>
              <TabsContent value="analytics">
                <RightsAnalyticsPane />
              </TabsContent>
              <TabsContent value="settings">
                <RightsSettingsPane />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </DashboardLayout>

      <IPRegistrationWizard isOpen={isRegistrationWizardOpen} onClose={() => setIsRegistrationWizardOpen(false)} />
    </NetworkProvider>
  );
};

export default RightsManagement;
