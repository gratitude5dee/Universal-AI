
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { AgentIcon, BrainIcon, WalletIcon, DashboardIcon } from "@/components/ui/icons";
import Ambient from "@/components/ui/ambient";

export default function Index() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      // Check if login function exists (it will be undefined if Crossmint isn't properly configured)
      if (login) {
        await login();
      } else {
        // If Crossmint is not available, just navigate to home
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const featureIcons = [
    { Icon: BrainIcon, label: "AI Agents", color: "var(--color-highlight-interactive)" },
    { Icon: DashboardIcon, label: "Dashboard", color: "var(--color-accent-primary)" },
    { Icon: WalletIcon, label: "Treasury", color: "var(--color-highlight-interactive-lighter)" },
    { Icon: AgentIcon, label: "Assistants", color: "var(--color-accent-primary-lighter)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative"
    >
      {/* WebGL Background */}
      <Ambient showAsciiStreams={true} />
      
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-xl border border-white/10 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 highlight-text">WZRD Studio</h1>
          <p className="text-lg cool-gray-text mb-8">Sign in to access your creative workspace</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-futuristic-accent hover:bg-futuristic-accentLighter accent-glow"
            onClick={handleLogin}
          >
            {login ? "Sign in with Crossmint" : "Continue to App"}
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 cool-gray-text bg-futuristic-base">or continue with</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={() => navigate("/wzrd/studio")}
          >
            Enter as Guest
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-6">
          {featureIcons.map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-2">
                <item.Icon 
                  className="h-6 w-6" 
                  isGlowing={true} 
                  glowColor="highlight" 
                  style={{ color: item.color }} 
                />
              </div>
              <span className="text-xs cool-gray-text">{item.label}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center text-xs cool-gray-text mt-6">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </motion.div>
  );
};
