
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SubmenuProps {
  isOpen: boolean;
  isCollapsed: boolean;
  submenuItems: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string; isGlowing?: boolean; glowColor?: "highlight" | "accent" | "white" }>;
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
          className="bg-gradient-to-br from-blue-darker/90 to-blue-dark/90 backdrop-blur-md p-2 min-w-48 border border-blue-primary/30 rounded-lg shadow-[0_0_20px_rgba(30,64,175,0.3)]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs font-medium text-cyan-400 text-glow-cyan mb-2 px-2 uppercase tracking-wider">
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
                      flex items-center px-2.5 py-1.5 rounded-md text-xs transition-all duration-200
                      ${isSubItemActive 
                        ? 'bg-cyan-500/20 text-white font-medium' 
                        : 'text-blue-lightest hover:bg-cyan-500/10 hover:text-white'}
                    `}
                  >
                    <subItem.icon 
                      className={`h-3.5 w-3.5 mr-2 ${isSubItemActive ? 'text-cyan-400 icon-glow-cyan' : 'text-blue-lighter'}`}
                      isGlowing={isSubItemActive}
                      glowColor="highlight" 
                    />
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
                    flex items-center px-2.5 py-1.5 rounded-md text-xs transition-all duration-200 relative group
                    ${isSubItemActive 
                      ? 'bg-cyan-500/20 text-white font-medium' 
                      : 'text-blue-lightest hover:bg-cyan-500/10 hover:text-white'}
                  `}
                >
                  <subItem.icon 
                    className={`h-3.5 w-3.5 mr-2 ${isSubItemActive ? 'text-cyan-400 icon-glow-cyan' : 'text-blue-lighter group-hover:text-blue-lightest'}`} 
                    isGlowing={isSubItemActive} 
                    glowColor={isSubItemActive ? "highlight" : "highlight"}
                  />
                  <span className="text-shadow-sm">{subItem.name}</span>
                  
                  {/* Subtle active indicator */}
                  {isSubItemActive && (
                    <span className="absolute right-1 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(0,240,255,0.5)]"></span>
                  )}
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
