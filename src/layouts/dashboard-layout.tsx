
import React, { ReactNode } from "react";
import Ambient from "@/components/ui/ambient";
import Sidebar from "@/components/ui/sidebar/sidebar";
import MainContent from "@/components/ui/layout/main-content";
import { navItems } from "@/components/ui/navigation/nav-items";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-darker overflow-hidden">
      {/* Place Ambient first so it's behind everything */}
      <Ambient />
      
      <div className="flex flex-1 z-10 relative">
        <Sidebar navItems={navItems} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
