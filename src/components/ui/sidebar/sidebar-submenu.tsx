
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SubmenuProps {
  isOpen: boolean;
  isCollapsed: boolean;
  submenuItems: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  currentPath: string;
  currentTab?: string | null;
  parentName: string;
}

const SidebarSubmenu: React.FC<SubmenuProps> = ({
  isOpen,
  isCollapsed,
  submenuItems,
  currentPath,
  currentTab,
  parentName,
}) => {
  if (!submenuItems.length) return null;

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.03 * i,
        duration: 0.2,
      }
    }),
    exit: { opacity: 0, y: -5, transition: { duration: 0.1 } }
  };

  // Submenu that appears on hover when sidebar is collapsed
  if (isCollapsed) {
    return (
      <div className="absolute left-full top-0 ml-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <motion.div 
          className="glass-card p-2 min-w-48"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs font-medium text-blue-lightest text-glow-blue mb-2 px-2 uppercase tracking-wider">
            {parentName}
          </div>
          <div className="space-y-0.5">
            {submenuItems.map((subItem, index) => {
              const basePathMatch = currentPath.startsWith(subItem.path.split("?")[0]);
              const queryMatch = subItem.path.includes(`tab=${currentTab}`);
              
              const isSubItemActive = basePathMatch && 
                (!subItem.path.includes("?tab=") || (currentTab && queryMatch));
              
              return (
                <motion.div
                  key={subItem.name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={menuItemVariants}
                >
                  <Link 
                    to={subItem.path} 
                    className={`
                      sidebar-submenu-item
                      ${isSubItemActive ? 'sidebar-submenu-item-active' : 'sidebar-submenu-item-inactive'}
                    `}
                  >
                    <subItem.icon className={`h-3.5 w-3.5 mr-2 ${isSubItemActive ? 'text-white' : 'text-blue-lighter'}`} />
                    <span className="text-shadow-sm">{subItem.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Expanded submenu animation for non-collapsed state
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
          animate={{ height: "auto", opacity: 1, overflow: 'visible' }}
          exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mt-0.5 ml-4 space-y-0.5 overflow-hidden"
        >
          {submenuItems.map((subItem, index) => {
            const basePathMatch = currentPath.startsWith(subItem.path.split("?")[0]);
            const queryMatch = subItem.path.includes(`tab=${currentTab}`);
            
            const isSubItemActive = basePathMatch && 
              (!subItem.path.includes("?tab=") || (currentTab && queryMatch));
            
            return (
              <motion.div
                key={subItem.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
              >
                <Link 
                  to={subItem.path} 
                  className={`
                    sidebar-submenu-item
                    ${isSubItemActive ? 'sidebar-submenu-item-active' : 'sidebar-submenu-item-inactive'}
                  `}
                >
                  <subItem.icon className={`h-3.5 w-3.5 mr-2 ${isSubItemActive ? 'text-white' : 'text-blue-lighter'}`} />
                  <span className="text-shadow-sm">{subItem.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarSubmenu;
