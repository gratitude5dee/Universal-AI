import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import { Palette, ExternalLink, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import wzrdStudioInterface from "@/assets/wzrd-studio-mockup.jpg";
import wzrdWorkInterface from "@/assets/wzrd-work-interface.png";
const WzrdStudio = () => {
  console.log("Rendering WzrdStudio component");
  return <DashboardLayout>
      <Content title="WZRD.tech Studio" subtitle="Create magical digital experiences with our advanced creative tools">
        <div className="glass-card p-6">
          <div className="flex flex-col items-center text-center mb-12 max-w-3xl mx-auto">
            <motion.div 
              className="relative mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
                <Palette className="h-12 w-12 text-white/90" />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3 tracking-tight">Creative Studio</h2>
              <p className="text-white/70 text-xl leading-relaxed">Professional-grade creative wizardry tools</p>
            </motion.div>
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
                {/* Hero Image with glassmorphism */}
                <div className="absolute top-4 left-4 right-4 h-32 rounded-xl overflow-hidden group-hover:h-36 transition-all duration-500 ease-out">
                  <div className="relative w-full h-full">
                    <img 
                      src={wzrdStudioInterface} 
                      alt="WZRD Studio Interface" 
                      className="w-full h-full object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-black/40 rounded-xl"></div>
                    <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5 rounded-xl border border-white/10"></div>
                  </div>
                </div>
                
                {/* Floating orb effects */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"></div>
                <div className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/15 to-purple-400/15 blur-lg"></div>
                
                <div className="relative z-10 mt-36 group-hover:mt-40 transition-all duration-500">
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
                    onClick={() => window.open("https://studio.universal-ai.xyz", "_blank")}
                  >
                    <span>Launch Studio</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* WZRD Studio Interface Image */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <img 
                    src={wzrdStudioInterface} 
                    alt="WZRD Studio Interface Preview" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 rounded-2xl"></div>
                </div>
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
                {/* Hero Image with glassmorphism */}
                <div className="absolute top-4 left-4 right-4 h-32 rounded-xl overflow-hidden group-hover:h-36 transition-all duration-500 ease-out">
                  <div className="relative w-full h-full">
                    <img 
                      src={wzrdWorkInterface} 
                      alt="WZRD Work Interface" 
                      className="w-full h-full object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-black/40 rounded-xl"></div>
                    <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5 rounded-xl border border-white/10"></div>
                  </div>
                </div>
                
                {/* Floating orb effects */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/20 to-teal-400/20 blur-xl"></div>
                <div className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-400/15 blur-lg"></div>
                
                <div className="relative z-10 mt-36 group-hover:mt-40 transition-all duration-500">
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
                    onClick={() => window.open("https://wrk.wzrdtech.xyz", "_blank")}
                  >
                    <span>Launch Work</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* WZRD Work Interface Image */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <img 
                    src={wzrdWorkInterface} 
                    alt="WZRD Work Interface Preview" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-teal-500/20 rounded-2xl"></div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </Content>
    </DashboardLayout>;
};
export default WzrdStudio;