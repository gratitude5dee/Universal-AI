import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Import new financial components
import FinanceStatCard from "@/components/treasury/financials/FinanceStatCard";
import RoyaltyStatements from "@/components/treasury/financials/RoyaltyStatements";
import SplitSheets from "@/components/treasury/financials/SplitSheets";
import Forecasting from "@/components/treasury/financials/Forecasting";
import FinancialReports from "@/components/treasury/financials/FinancialReports";
import MultiChainDashboard from "@/components/treasury/revenue/MultiChainDashboard";
import AgentBanking from "@/components/treasury/AgentBanking";
import { RWAWizardHub } from "@/components/rwa/RWAWizardHub";

const TreasureVault = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("statements");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = ["statements", "forecasting", "splits", "reports", "multichain", "banking", "rwa-wzrd"];
    if (tab && validTabs.includes(tab)) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("statements");
      navigate(`${location.pathname}?tab=statements`, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/treasury?tab=${value}`, { replace: true });
  };

  return (
    <DashboardLayout>
      <Content 
        title="Finance & Royalties" 
        subtitle="AI-powered financial management and royalty tracking"
      >
        {/* Persistent Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FinanceStatCard title="Total Revenue" value="$29,006.35" subtitle="+12.5% from last quarter" />
            <FinanceStatCard title="Pending Statements" value="0" subtitle="Awaiting processing" />
            <FinanceStatCard title="Discrepancies" value="1" subtitle="Requires attention" attention />
            <FinanceStatCard title="Next Forecast" value="$35,000" subtitle="85% confidence" />
        </div>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white/10 border border-white/20 rounded-lg">
            <TabsTrigger value="statements" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Royalty Statements</TabsTrigger>
            <TabsTrigger value="forecasting" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Forecasting</TabsTrigger>
            <TabsTrigger value="splits" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Split Sheets</TabsTrigger>
            <TabsTrigger value="reports" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Reports</TabsTrigger>
            <TabsTrigger value="multichain" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Multi-Chain Revenue</TabsTrigger>
            <TabsTrigger value="banking" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">Agent Banking</TabsTrigger>
            <TabsTrigger value="rwa-wzrd" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">🏛️ RWA WZRD</TabsTrigger>
          </TabsList>
          
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <TabsContent value="statements"><RoyaltyStatements /></TabsContent>
            <TabsContent value="forecasting"><Forecasting /></TabsContent>
            <TabsContent value="splits"><SplitSheets /></TabsContent>
            <TabsContent value="reports"><FinancialReports /></TabsContent>
            <TabsContent value="multichain"><MultiChainDashboard /></TabsContent>
            <TabsContent value="banking"><AgentBanking /></TabsContent>
            <TabsContent value="rwa-wzrd"><RWAWizardHub /></TabsContent>
          </motion.div>
        </Tabs>
      </Content>
    </DashboardLayout>
  );
};

export default TreasureVault;