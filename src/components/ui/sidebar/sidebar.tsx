
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pin, ChevronsLeft, ChevronsRight } from "lucide-react";
import SidebarContent from "./sidebar-content";
import { motion } from "framer-motion";
import CloudShader from "@/components/ui/shaders/CloudShader";

interface SidebarProps {
  navItems: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    hasSubmenu?: boolean;
    submenuItems?: {
      name: string;
      path: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIntent, setHoverIntent] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Check for user preference in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    const savedHiddenState = localStorage.getItem('sidebarHidden');
    const savedPinnedState = localStorage.getItem('sidebarPinned');
    
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
    
    if (savedHiddenState) {
      setIsHidden(savedHiddenState === 'true');
    } else {
      // Default to hidden for new users
      setIsHidden(true);
      localStorage.setItem('sidebarHidden', 'true');
    }
    
    if (savedPinnedState) {
      setPinned(savedPinnedState === 'true');
      if (savedPinnedState === 'true') {
        setIsHidden(false);
      }
    }
  }, []);

  // Hover intent with delay
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (hoverIntent && !pinned) {
      timer = setTimeout(() => {
        setIsHovered(true);
      }, 100); // 100ms delay before expanding
    } else if (!hoverIntent && !pinned) {
      timer = setTimeout(() => {
        setIsHovered(false);
      }, 300); // Slightly longer delay before collapsing for better UX
    }
    return () => clearTimeout(timer);
  }, [hoverIntent, pinned]);

  // Auto-hide when mouse leaves and not pinned
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    if (!hoverIntent && !pinned) {
      hideTimer = setTimeout(() => {
        setIsHidden(true);
        localStorage.setItem('sidebarHidden', 'true');
      }, 500); // Delay before hiding
    }
    return () => clearTimeout(hideTimer);
  }, [hoverIntent, pinned]);

  // Combined toggle function for collapse and hide
  const toggleSidebar = () => {
    if (isHidden) {
      // If sidebar is hidden, show it first
      setIsHidden(false);
      localStorage.setItem('sidebarHidden', 'false');
      return;
    }
    
    // If sidebar is visible, toggle collapse state
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    
    if (newState && !isHidden) {
      // If collapsing and not already hidden, consider hiding
      if (!pinned) { // Only hide if not pinned
        setIsHidden(true);
        localStorage.setItem('sidebarHidden', 'true');
      }
    }
    
    if (!newState) {
      setPinned(false); // Unpin when manually expanded
    }
  };

  const togglePin = () => {
    const newPinState = !pinned;
    setPinned(newPinState);
    localStorage.setItem('sidebarPinned', String(newPinState));
    
    if (newPinState) {
      // When pinning, ensure sidebar is visible
      setIsHidden(false);
      localStorage.setItem('sidebarHidden', 'false');
    }
    
    if (isCollapsed) {
      setIsHovered(newPinState);
    }
  };

  // Determine which button icon to show based on sidebar state
  const getButtonIcon = () => {
    if (isHidden) {
      return <ChevronsRight className="h-4 w-4" />;
    } else if (isCollapsed) {
      return <ChevronRight className="h-4 w-4" />;
    } else {
      return <ChevronsLeft className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Hover detection area along the left edge */}
      {isHidden && !pinned && (
        <div 
          className="fixed left-0 top-0 w-2 h-full z-40 bg-transparent"
          onMouseEnter={() => {
            setHoverIntent(true);
            setIsHidden(false);
          }}
        />
      )}
      
      <motion.aside 
        className="fixed left-0 top-0 h-screen flex flex-col border-r border-blue-primary/40 shadow-blue-glow transition-all duration-300 overflow-hidden z-30"
        initial={false}
        animate={{ 
          width: isCollapsed ? (isHovered || pinned ? '16rem' : '4.5rem') : '16rem',
          x: isHidden && !pinned ? '-100%' : 0,
          opacity: isHidden && !pinned ? 0.8 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseEnter={() => setHoverIntent(true)}
        onMouseLeave={() => setHoverIntent(false)}
      >
        {/* CloudShader for sidebar background */}
        <div className="absolute inset-0 overflow-hidden">
          <CloudShader />
          {/* Overlay to make text more readable on shader background */}
          <div className="absolute inset-0 bg-blue-dark/70 z-1"></div>
        </div>

        <div className="p-5 h-full flex flex-col overflow-hidden relative z-10">
          <SidebarContent 
            navItems={navItems} 
            isCollapsed={isCollapsed && !(isHovered || pinned)} 
          />
        </div>
        
        {/* Pin button - only visible when hovered and collapsed */}
        {isCollapsed && (isHovered || pinned) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={togglePin}
            className={`cursor-interactive absolute right-4 top-5 h-6 w-6 rounded-full transition-all duration-200 z-20 ${pinned ? 'bg-blue-primary text-white shadow-blue-glow' : 'bg-transparent text-white hover:bg-blue-primary/30'}`}
            aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <Pin className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {/* Improved toggle button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar} 
          className="cursor-interactive absolute -left-3 top-24 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 backdrop-blur-md border-cyan-400/40 hover:bg-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.7)] z-20 flex items-center justify-center transition-all duration-200" 
          aria-label={isHidden ? "Show sidebar" : (isCollapsed ? "Expand sidebar" : "Collapse sidebar")}
        >
          {getButtonIcon()}
        </Button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
