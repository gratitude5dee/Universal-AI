
import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Palette, ExternalLink, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import FuturisticCursor from "@/components/ui/FuturisticCursor";

const WzrdStudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  return (
    <DashboardLayout>
      <Content title="WZRD.tech Studio" subtitle="Create magical digital experiences with our advanced creative tools">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-2xl mr-4">
              <Palette className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Studio</h2>
              <p className="text-muted-foreground">Advanced creative wizardry tools</p>
            </div>
          </div>
          
          {/* Demonstration of cursor states */}
          <div className="mb-8 p-4 bg-blue-darker/30 backdrop-blur-md rounded-lg border border-blue-primary/20">
            <h3 className="text-lg font-medium mb-4 text-blue-lightest">Interactive Cursor Demo</h3>
            <p className="text-sm text-blue-lighter mb-4">
              Move your cursor over these elements to see different cursor states:
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                variant="default" 
                className="cursor-interactive bg-gradient-to-r from-cyan-600 to-blue-600"
                onClick={simulateLoading}
              >
                Test Loading State
              </Button>
              
              <a 
                href="#" 
                className="cursor-interactive inline-block px-4 py-2 bg-blue-primary/20 hover:bg-blue-primary/30 text-blue-lightest rounded-md transition-colors duration-200 border border-blue-primary/30"
                onClick={(e) => e.preventDefault()}
              >
                Interactive Link
              </a>
              
              <motion.div
                className="cursor-interactive w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center border border-purple-500/40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wand2 className="h-6 w-6 text-purple-300" />
              </motion.div>
              
              <span className="text-blue-lightest px-3 py-1.5 bg-transparent">Non-interactive text</span>
            </div>
          </div>
          
          {/* 3D Hover Card with Glassmorphism */}
          <motion.div className="mt-8 mb-8 relative group perspective-1000 cursor-interactive" whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5
          }} transition={{
            type: "spring",
            stiffness: 300,
            damping: 15
          }}>
            <div className="bg-gradient-to-br from-purple-500/20 to-studio-accent/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden">
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }} />
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-studio-charcoal mb-2">WZRD.tech Creative Studio</h3>
                <p className="text-studio-clay mb-6">Cultivate your creator with our cutting-edge visual development environment.</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-studio-accent"></span>
                    <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
                    <span className="inline-block h-3 w-3 rounded-full bg-studio-clay"></span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="cursor-interactive bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/30 text-studio-charcoal" 
                    onClick={() => window.open("https://wzrdflow.lovable.app", "_blank")}
                  >
                    <span>Visit WZRD.tech</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Light reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="cursor-interactive bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2">Visual Design Tools</h3>
              <p className="text-sm text-studio-clay">Create stunning visuals with AI-powered design tools</p>
            </div>
            <div className="cursor-interactive bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2">Audio Engineering</h3>
              <p className="text-sm text-studio-clay">Craft immersive soundscapes with magical audio tools</p>
            </div>
            <div className="cursor-interactive bg-white p-6 rounded-xl border border-studio-sand/30">
              <h3 className="text-lg font-medium mb-2">Interactive Experiences</h3>
              <p className="text-sm text-studio-clay">Build engaging interactive content with no-code wizardry</p>
            </div>
          </div>
        </div>
      </Content>
      
      {/* Update the FuturisticCursor loading state based on app state */}
      <FuturisticCursor isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default WzrdStudio;
