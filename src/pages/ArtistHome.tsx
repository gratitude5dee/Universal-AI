import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Content } from "@/components/ui/content";
import Greeting from "@/components/ui/greeting";
import Siri from "@/components/vapi/Siri";
import SuggestedActions from "@/components/home/SuggestedActions";
import VinylBookshelf from "@/components/library/VinylBookshelf";
import LiquidGlassModal from "@/components/library/LiquidGlassModal";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Activity, ListChecks, TrendingUp, Users, Music, Mic2, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <Content>
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-studio-charcoal mb-2">Artist Dashboard</h1>
            <p className="text-studio-clay">Your creative journey at a glance</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                variants={itemAnimation}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Greeting />
              </motion.div>
              
              {/* Financial Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <TrendingUp className="text-[#9b87f5]" size={20} />
                    Financial Overview
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border border-studio-sand/30 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-[#9b87f5] mr-2" />
                        <span className="text-2xl font-bold text-studio-charcoal">$12.4k</span>
                      </div>
                      <p className="text-sm text-studio-clay">Monthly Revenue</p>
                    </div>
                    <div className="p-4 border border-studio-sand/30 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-5 w-5 text-[#33C3F0] mr-2" />
                        <span className="text-2xl font-bold text-studio-charcoal">45.2k</span>
                      </div>
                      <p className="text-sm text-studio-clay">Monthly Listeners</p>
                    </div>
                    <div className="p-4 border border-studio-sand/30 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Music className="h-5 w-5 text-[#F97316] mr-2" />
                        <span className="text-2xl font-bold text-studio-charcoal">23</span>
                      </div>
                      <p className="text-sm text-studio-clay">Active Releases</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-studio-sand/30">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        <Activity size={14} className="text-[#9b87f5]" />
                        Streaming Analytics
                      </h3>
                      <span className="text-xs text-green-500">↗ +12.3%</span>
                    </div>
                    <div className="p-4 bg-[#F1F0FB] rounded-lg">
                      <div className="flex items-end h-16 gap-1">
                        {[45, 52, 38, 61, 73, 67, 81].map((value, index) => (
                          <div key={index} className="flex-1 bg-gradient-to-t from-[#9b87f5]/60 to-[#9b87f5]/20 rounded-t" 
                               style={{ height: `${(value / 81) * 100}%` }}>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-studio-clay mt-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Library Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <Music className="text-[#9b87f5]" size={20} />
                    Recent Creations
                  </h2>
                  <VinylBookshelf onRecordSelect={handleRecordSelect} title="" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SuggestedActions />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Voice Assistant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <Mic2 className="text-[#9b87f5]" size={20} />
                    Artist Voice Assistant
                  </h2>
                  <div className="min-h-[200px]">
                    <Siri theme="ios9" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-studio-sand/30">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Headphones size={14} className="text-[#9b87f5]" />
                      Active Integrations
                    </h3>
                    <div className="space-y-2">
                      <motion.div 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-[#F1F0FB] text-sm"
                        whileHover={{ x: 3 }}
                      >
                        <span>✓ Google Calendar</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </motion.div>
                      <motion.div 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-[#F1F0FB] text-sm"
                        whileHover={{ x: 3 }}
                      >
                        <span>✓ Travel Apps</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </motion.div>
                      <motion.div 
                        className="w-full text-left p-3 flex items-center justify-between rounded-lg bg-[#F1F0FB] text-sm"
                        whileHover={{ x: 3 }}
                      >
                        <span>✓ Social Media</span>
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Schedule & Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                    <Calendar className="text-[#9b87f5]" size={20} />
                    Schedule & Calendar
                  </h2>
                  <Tabs defaultValue="schedule">
                    <TabsList className="grid w-full grid-cols-2 bg-[#F1F0FB]">
                      <TabsTrigger value="schedule" className="data-[state=active]:bg-white">Schedule</TabsTrigger>
                      <TabsTrigger value="calendar" className="data-[state=active]:bg-white">Calendar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="schedule">
                      <div className="mt-4 space-y-3">
                        <motion.div 
                          className="flex items-center p-3 border border-studio-sand/30 rounded-lg hover:bg-[#F1F0FB]"
                          whileHover={{ x: 3 }}
                        >
                          <Calendar className="h-4 w-4 text-[#33C3F0] mr-3" />
                          <div>
                            <p className="text-sm font-medium text-studio-charcoal">Studio Session</p>
                            <p className="text-xs text-studio-clay">2:00 PM - 5:00 PM</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center p-3 border border-studio-sand/30 rounded-lg hover:bg-[#F1F0FB]"
                          whileHover={{ x: 3 }}
                        >
                          <Calendar className="h-4 w-4 text-green-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-studio-charcoal">Travel to Denver</p>
                            <p className="text-xs text-studio-clay">Next Week</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center p-3 border border-studio-sand/30 rounded-lg hover:bg-[#F1F0FB]"
                          whileHover={{ x: 3 }}
                        >
                          <Calendar className="h-4 w-4 text-[#9b87f5] mr-3" />
                          <div>
                            <p className="text-sm font-medium text-studio-charcoal">Album Review</p>
                            <p className="text-xs text-studio-clay">Friday 3:00 PM</p>
                          </div>
                        </motion.div>
                      </div>
                    </TabsContent>
                    <TabsContent value="calendar">
                       <div className="mt-4 p-8 bg-[#F1F0FB] rounded-lg text-center">
                         <Calendar className="h-12 w-12 text-studio-clay mx-auto mb-4" />
                         <p className="text-sm text-studio-clay">Interactive calendar widget goes here</p>
                       </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <LiquidGlassModal 
          isOpen={!!selectedAsset}
          asset={selectedAsset}
          onClose={handleCloseModal}
        />
      </Content>
    </DashboardLayout>
  );
};

export default Home;