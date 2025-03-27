
import React, { ReactNode } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import MainContent from "@/components/ui/layout/main-content";
import { navItems } from "@/components/ui/navigation/nav-items";
import FuturisticCursor from "@/components/ui/FuturisticCursor";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent overflow-hidden">
      <div className="flex flex-1 z-10 relative">
        <Sidebar navItems={navItems} />
        <MainContent>{children}</MainContent>
      </div>
      <FuturisticCursor />
    </div>
  );
};

export default DashboardLayout;
