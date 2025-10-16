
import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar/sidebar";
import MainContent from "@/components/ui/layout/main-content";
import { navItems } from "@/components/ui/navigation/nav-items";
import { FuturisticCursor } from "@/components/ui/cursor";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const sidebarWidth = isCollapsed ? (isHovered ? '16rem' : '5rem') : '16rem';

  return (
    <div className="min-h-screen flex flex-col bg-transparent overflow-hidden">
      <div className="flex flex-1 z-10 relative w-full">
        <Sidebar 
          navItems={navItems} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
        <MainContent sidebarWidth={sidebarWidth}>{children}</MainContent>
      </div>
      <FuturisticCursor />
    </div>
  );
};

export default DashboardLayout;
