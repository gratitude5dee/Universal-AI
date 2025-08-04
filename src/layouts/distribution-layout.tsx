
import React, { ReactNode } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { Content } from "@/components/ui/content";

interface DistributionLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DistributionLayout = ({ children, title, subtitle }: DistributionLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const tabs = [
    { value: "social-media", label: "Social Media WZRD", path: "/distribution/social-media" },
    { value: "on-chain", label: "On-Chain Distribution", path: "/distribution/on-chain" },
    { value: "media-channels", label: "Media Channels", path: "/distribution/media-channels" },
    { value: "independent", label: "Independent Channels", path: "/distribution/independent" },
    { value: "sync-licensing", label: "Sync Licensing", path: "/distribution/sync-licensing" },
  ];

  const currentTab = tabs.find(tab => tab.path === currentPath)?.value || "social-media";

  return (
    <DashboardLayout>
      <Content title={title} subtitle={subtitle}>
        <div className="flex flex-col space-y-6">
          <div className="glass-card p-1 md:p-1.5">
            <Tabs value={currentTab} onValueChange={(value) => {
              const tab = tabs.find(t => t.value === value);
              if (tab) navigate(tab.path);
            }}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="data-[state=active]:bg-studio-accent data-[state=active]:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {children}
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default DistributionLayout;
