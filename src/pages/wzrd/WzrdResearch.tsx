
import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import ResearchInterface from "@/components/research/ResearchInterface";

const WzrdResearch = () => {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <ResearchInterface />
      </div>
    </DashboardLayout>
  );
};

export default WzrdResearch;
