import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import DashboardFlow from "@/components/dashboard/DashboardFlow";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <DashboardLayout>
      <Content>
        <motion.div 
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-studio-charcoal mb-2">Artist Dashboard</h1>
            <p className="text-studio-clay">Drag, drop, and resize your dashboard components</p>
          </div>
          
          <div className="h-[calc(100vh-200px)] w-full">
            <DashboardFlow />
          </div>
        </motion.div>
      </Content>
    </DashboardLayout>
  );
};

export default Home;