import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Banknote, CreditCard, FilePieChart, Landmark } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import new financial components
import FinancialOverview from "@/components/treasury/financials/FinancialOverview";
import RevenueStreamsDashboard from "@/components/treasury/financials/RevenueStreamsDashboard";
import ExpenseTracker from "@/components/treasury/financials/ExpenseTracker";
import FinancialReports from "@/components/treasury/financials/FinancialReports";

// Import existing components
import AgentBanking from "@/components/treasury/AgentBanking";

const TreasureVault = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["dashboard", "income", "expenses", "accounting", "banking"].includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("dashboard");
    }
  }, [location.search]);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/treasury?tab=${value}`, { replace: true });
  };

  return (
    <DashboardLayout>
      <Content 
        title="Finances" 
        subtitle="Your complete financial command center for managing a modern creative business."
      >
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1 shadow-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-all duration-200 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:shadow-md">
              <Home className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-all duration-200 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:shadow-md">
              <Banknote className="w-4 h-4" />
              <span className="font-medium">Income</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-all duration-200 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:shadow-md">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="accounting" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-all duration-200 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:shadow-md">
              <FilePieChart className="w-4 h-4" />
              <span className="font-medium">Accounting</span>
            </TabsTrigger>
            <TabsTrigger value="banking" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-all duration-200 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:shadow-md">
              <Landmark className="w-4 h-4" />
              <span className="font-medium">Agent Banking</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard"><FinancialOverview /></TabsContent>
          <TabsContent value="income"><RevenueStreamsDashboard /></TabsContent>
          <TabsContent value="expenses"><ExpenseTracker /></TabsContent>
          <TabsContent value="accounting"><FinancialReports /></TabsContent>
          <TabsContent value="banking"><AgentBanking /></TabsContent>
        </Tabs>
      </Content>
    </DashboardLayout>
  );
};

export default TreasureVault;