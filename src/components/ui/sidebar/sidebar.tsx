
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pin } from "lucide-react";
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

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    if (!newState) {
      setPinned(false); // Unpin when manually expanded
    }
  };

  const toggleHidden = () => {
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState);
    localStorage.setItem('sidebarHidden', String(newHiddenState));
    if (newHiddenState) {
      setPinned(false); // Unpin when hiding
      localStorage.setItem('sidebarPinned', 'false');
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
            className={`absolute right-4 top-5 h-6 w-6 rounded-full transition-all duration-200 z-20 ${pinned ? 'bg-blue-primary text-white shadow-blue-glow' : 'bg-transparent text-white hover:bg-blue-primary/30'}`}
            aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <Pin className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {/* Toggle collapse button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar} 
          className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-blue-dark border-blue-primary/50 text-white shadow-blue-glow z-20" 
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
        
        {/* Hide/Show button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleHidden}
          className="absolute -right-3 top-36 h-6 w-6 rounded-full bg-blue-dark border-blue-primary/50 text-white shadow-blue-glow z-20" 
          aria-label={isHidden ? "Show sidebar" : "Hide sidebar"}
        >
          {isHidden ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
