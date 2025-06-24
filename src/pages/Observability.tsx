import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherKingdom } from "@/components/observability/WeatherKingdom";
import { GuardianAlerts } from "@/components/observability/GuardianAlerts";
import { ResourceCycles } from "@/components/observability/ResourceCycles";
import { LivingEcosystem } from "@/components/observability/LivingEcosystem";
import { MagicalDashboard } from "@/components/observability/MagicalDashboard";
import { SecurityGarden } from "@/components/observability/SecurityGarden";
import { ResourceCapacity } from "@/components/observability/ResourceCapacity";
import { BackupSanctuary } from "@/components/observability/BackupSanctuary";
import { AuditScroll } from "@/components/observability/AuditScroll";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Shield, Droplets, Leaf, Layout, LockKeyhole, HardDrive, Save, ClipboardList } from "lucide-react";
import { Content } from "@/components/ui/content";
import { toast } from "sonner";

const Observability = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "observatory">("dashboard");

  const handleQuickAction = (action: string) => {
    toast.success(`${action} completed successfully`, {
      description: "Your system is now more secure and stable.",
    });
  };

  return (
    <DashboardLayout>
      <Content title="Magical Observatory" subtitle="Monitor your digital realm with mindful guardianship">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <Button 
                variant={activeView === "dashboard" ? "default" : "outline"} 
                onClick={() => setActiveView("dashboard")}
                className="gap-2"
              >
                <Layout size={18} />
                Command Center
              </Button>
              <Button 
                variant={activeView === "observatory" ? "default" : "outline"} 
                onClick={() => setActiveView("observatory")}
                className="gap-2"
              >
                <Eye size={18} />
                Observatory View
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleQuickAction("Health check")}>
                Run Health Check
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAction("Security scan")}>
                Security Scan
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAction("Backup")}>
                Create Backup
              </Button>
            </div>
          </div>

          {activeView === "dashboard" ? (
            <MagicalDashboard />
          ) : (
            <Tabs defaultValue="weather" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-4xl">
                <TabsTrigger value="weather" className="flex items-center gap-2">
                  <BarChart3 size={16} /> System Health
                </TabsTrigger>
                <TabsTrigger value="guardians" className="flex items-center gap-2">
                  <Shield size={16} /> Security
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <HardDrive size={16} /> Resources
                </TabsTrigger>
                <TabsTrigger value="backup" className="flex items-center gap-2">
                  <Save size={16} /> Backups
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <ClipboardList size={16} /> Audit Logs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="weather" className="pt-4">
                <WeatherKingdom />
              </TabsContent>
              <TabsContent value="guardians" className="pt-4">
                <SecurityGarden />
              </TabsContent>
              <TabsContent value="resources" className="pt-4">
                <ResourceCapacity />
              </TabsContent>
              <TabsContent value="backup" className="pt-4">
                <BackupSanctuary />
              </TabsContent>
              <TabsContent value="audit" className="pt-4">
                <AuditScroll />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Observability;