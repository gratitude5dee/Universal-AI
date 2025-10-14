import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Content } from "@/components/ui/content";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Calendar, Search, FileText, DollarSign } from "lucide-react";

interface BookingAgentLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function BookingAgentLayout({ children, title, subtitle }: BookingAgentLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { value: "gigs", label: "Gigs", path: "/collection/booking-agent/gigs", icon: Calendar },
    { value: "booky", label: "Booky", path: "/collection/booking-agent/booky", icon: Search },
    { value: "contracts", label: "Contracts", path: "/collection/booking-agent/contracts", icon: FileText },
    { value: "payments", label: "Payments", path: "/collection/booking-agent/payments", icon: DollarSign },
  ];

  const currentTab = tabs.find((tab) => location.pathname.startsWith(tab.path))?.value || "gigs";

  return (
    <DashboardLayout>
      <Content className="space-y-6">
        <div className="flex flex-col gap-4">
          {title && (
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
          
          <Tabs value={currentTab} onValueChange={(value) => {
            const tab = tabs.find((t) => t.value === value);
            if (tab) navigate(tab.path);
          }}>
            <TabsList className="glass-card border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="data-[state=active]:bg-studio-accent data-[state=active]:text-white gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
        
        {children}
      </Content>
    </DashboardLayout>
  );
}
