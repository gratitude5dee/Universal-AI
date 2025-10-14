import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Calendar, Search, FileText, DollarSign, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      {/* Premium App Bar - IP Portal Style */}
      <div className="border-b border-white/10 bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium text-foreground">
              UniversalAI / <span className="text-muted-foreground">Booking Agent</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-white/5"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Premium Tabs */}
        <div className="px-6 pb-3">
          <Tabs value={currentTab} onValueChange={(value) => {
            const tab = tabs.find((t) => t.value === value);
            if (tab) navigate(tab.path);
          }}>
            <TabsList className="glass-card border border-white/10 p-1 h-auto bg-background/50 backdrop-blur-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.value;
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
