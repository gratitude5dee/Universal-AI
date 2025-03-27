
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSubmenu from "./sidebar-submenu";
import { motion } from "framer-motion";

interface SidebarContentProps {
  navItems: {
    name: string;
    path: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
    hasSubmenu?: boolean;
    submenuItems?: {
      name: string;
      path: string;
      icon: React.ComponentType<{
        className?: string;
      }>;
    }[];
  }[];
  isCollapsed: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navItems,
  isCollapsed
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab");

  // Initialize state for each submenu with empty object
  const [openSubmenus, setOpenSubmenus] = useState<{
    [key: string]: boolean;
  }>({});

  // Logo animation variants
  const logoVariants = {
    collapsed: {
      opacity: 1
    },
    expanded: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const textVariants = {
    collapsed: {
      opacity: 0,
      x: -10
    },
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05,
        duration: 0.2
      }
    }
  };

  // Close all submenus when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setOpenSubmenus({});
    } else {
      // When expanding, auto-open submenus that contain active items
      const updatedOpenSubmenus: {
        [key: string]: boolean;
      } = {};
      navItems.forEach(item => {
        if (item.hasSubmenu && hasActiveSubmenuItem(item.submenuItems)) {
          updatedOpenSubmenus[item.name] = true;
        }
      });
      setOpenSubmenus(prev => ({
        ...prev,
        ...updatedOpenSubmenus
      }));
    }
  }, [isCollapsed, navItems, currentPath, currentTab]);
  
  const toggleSubmenu = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isCollapsed) {
      setOpenSubmenus(prev => ({
        ...prev,
        [name]: !prev[name]
      }));
    }
  };

  // Function to check if a path is active
  const isPathActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && path !== "#" && currentPath.startsWith(path)) return true;
    return false;
  };

  // Function to check if a submenu has an active item
  const hasActiveSubmenuItem = (submenuItems?: Array<{
    path: string;
  }>) => {
    if (!submenuItems) return false;
    return submenuItems.some(subItem => {
      const basePath = subItem.path.split("?")[0];
      const hasTabParam = subItem.path.includes("?tab=");
      const matchesTab = subItem.path.includes(`tab=${currentTab}`);
      return currentPath.startsWith(basePath) && (!hasTabParam || currentTab && matchesTab);
    });
  };

  return <>
      <div className={`mb-6 mt-2 ${isCollapsed ? 'justify-center' : 'px-2'} flex items-center transition-all duration-300`}>
        <motion.div initial={false} animate={isCollapsed ? "collapsed" : "expanded"} variants={logoVariants} className="flex items-center">
          <span className="bg-blue-primary/30 w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-all duration-300 shadow-blue-glow">
            <span className="text-blue-lightest font-semibold text-glow-blue">5</span>
          </span>

          {!isCollapsed && <motion.div className="flex flex-col" variants={textVariants}>
              <span className="text-blue-lightest font-medium leading-tight text-xl text-shadow-sm text-glow-blue">UniversalAI</span>
            </motion.div>}
        </motion.div>
      </div>
          
      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin py-1 pr-1">
        {navItems.map(item => {
          const isActive = item.path === "/" ? currentPath === "/" : item.path !== "#" && isPathActive(item.path) || item.hasSubmenu && hasActiveSubmenuItem(item.submenuItems);
          const isSubMenuActive = item.hasSubmenu && hasActiveSubmenuItem(item.submenuItems);

          // Determine if submenu should be open based on user toggle or active status
          const isSubmenuOpen = !isCollapsed && (openSubmenus[item.name] || isSubMenuActive && openSubmenus[item.name] !== false);
          return <div key={item.name} className="relative group">
                <SidebarNavItem 
                  item={item} 
                  isActive={isActive} 
                  isSubMenuActive={isSubMenuActive} 
                  isCollapsed={isCollapsed} 
                  submenuOpen={isSubmenuOpen} 
                  toggleSubmenu={e => toggleSubmenu(item.name, e)} 
                />
                
                {/* Submenu */}
                {item.hasSubmenu && <SidebarSubmenu 
                  isOpen={isSubmenuOpen} 
                  isCollapsed={isCollapsed} 
                  submenuItems={item.submenuItems || []} 
                  currentPath={currentPath} 
                  currentTab={currentTab} 
                  parentName={item.name} 
                />}
              </div>;
        })}
      </nav>
        
      <div className="mt-auto pt-2 border-t border-blue-primary/30">
        {/* Log Out button */}
        <Link to="/logout" className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2.5 text-sm text-blue-lightest hover:bg-blue-primary/30 hover:text-white rounded-lg transition-all duration-200`} title={isCollapsed ? "Log Out" : ""}>
          <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-blue-lighter`} />
          {!isCollapsed && <motion.span initial="collapsed" animate="expanded" variants={textVariants} className="text-[13px] font-medium text-shadow-sm">
              Log Out
            </motion.span>}
        </Link>
      </div>
    </>;
};

export default SidebarContent;
