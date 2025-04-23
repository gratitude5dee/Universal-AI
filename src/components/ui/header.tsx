
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import { WalletInfo } from "./WalletInfo";
import { Settings } from "./Settings";

const Header: React.FC = () => {
  const location = useLocation();
  const {
    user
  } = useAuth();

  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;

    // Extract the last part of the path
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    const lastPart = parts[parts.length - 1];

    // Convert kebab-case to Title Case
    return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <motion.header 
      className="px-4 py-2 flex items-center justify-between bg-transparent z-10" 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.3
      }}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-4">
          <div className="text-lg font-semibold tracking-tight">
            UniversalAI<span className="text-studio-accent"></span>
          </div>
        </Link>
        
        <div className="text-lg font-medium">{getPageTitle()}</div>
      </div>
      
      <div className="flex items-center space-x-3">
        {user && <WalletInfo />}
        <Settings />
      </div>
    </motion.header>
  );
};

export default Header;
