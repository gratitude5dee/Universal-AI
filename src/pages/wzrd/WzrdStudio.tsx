import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Palette, ExternalLink, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
const WzrdStudio = () => {
  console.log("Rendering WzrdStudio component");
  return <DashboardLayout>
      <Content title="WZRD.tech Studio" subtitle="Create magical digital experiences with our advanced creative tools">
        <div className="glass-card p-6">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm p-4 rounded-2xl mr-6 border border-white/10">
              <Palette className="h-10 w-10 text-white/90" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">Creative Studio</h2>
              <p className="text-white/70 text-lg">Professional-grade creative wizardry tools</p>
            </div>
          </div>
          
          {/* Side by side cards container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* WZRD.Studio Card */}
            <motion.div 
              className="relative group perspective-1000 cursor-interactive" 
              whileHover={{
                scale: 1.02,
                rotateX: 2,
                rotateY: 2
              }} 
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              <div className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 relative overflow-hidden h-full">
                {/* Enhanced noise texture */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
                
                {/* Floating orb effects */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"></div>
                <div className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/15 to-purple-400/15 blur-lg"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                      <Palette className="h-6 w-6 text-white/90" />
                    </div>
                    <h3 className="text-2xl font-bold ml-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">WZRD.Studio</h3>
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Node-based visual editor for creating stunning images and videos with AI-powered workflows and real-time collaboration.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mr-3"></div>
                      <span>Visual Node Editor</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-pink-400 mr-3"></div>
                      <span>AI-Powered Generation</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                      <span>Real-time Collaboration</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full cursor-interactive bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white transition-all duration-300" 
                    onClick={() => window.open("https://wzrdstudio.lovable.app", "_blank")}
                  >
                    <span>Launch Studio</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Enhanced reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
              </div>
            </motion.div>
            
            {/* WZRD.Work Card */}
            <motion.div 
              className="relative group perspective-1000 cursor-interactive" 
              whileHover={{
                scale: 1.02,
                rotateX: 2,
                rotateY: -2
              }} 
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              <div className="bg-gradient-to-br from-blue-500/15 to-teal-500/15 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 relative overflow-hidden h-full">
                {/* Enhanced noise texture */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
                
                {/* Floating orb effects */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/20 to-teal-400/20 blur-xl"></div>
                <div className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-400/15 blur-lg"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-blue-500/30 to-teal-500/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                      <Briefcase className="h-6 w-6 text-white/90" />
                    </div>
                    <h3 className="text-2xl font-bold ml-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">WZRD.Work</h3>
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Intelligent agents that automate administrative tasks, streamline workflows, and handle business operations for artists and creatives.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                      <span>Smart Automation</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-teal-400 mr-3"></div>
                      <span>Business Management</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3"></div>
                      <span>Workflow Optimization</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full cursor-interactive bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white transition-all duration-300" 
                    onClick={() => window.open("https://work.wzrdtech.xyz", "_blank")}
                  >
                    <span>Launch Work</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Enhanced reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </Content>
    </DashboardLayout>;
};
export default WzrdStudio;