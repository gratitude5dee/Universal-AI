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
import { Calendar, DollarSign, Activity, ListChecks, TrendingUp, Users, Music } from "lucide-react";

const Home = () => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const handleRecordSelect = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  return (
    <DashboardLayout>
      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Greeting />
            
            {/* Financial Overview */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Financial Overview</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-2xl font-bold text-white">$12.4k</span>
                  </div>
                  <p className="text-sm text-white/70">Monthly Revenue</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-white">45.2k</span>
                  </div>
                  <p className="text-sm text-white/70">Monthly Listeners</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Music className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-2xl font-bold text-white">23</span>
                  </div>
                  <p className="text-sm text-white/70">Active Releases</p>
                </div>
              </div>
              <div className="h-32 bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/70">Streaming Analytics (Last 7 Days)</span>
                  <span className="text-xs text-green-400">↗ +12.3%</span>
                </div>
                <div className="flex items-end h-16 gap-1">
                  {[45, 52, 38, 61, 73, 67, 81].map((value, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t" 
                         style={{ height: `${(value / 81) * 100}%` }}>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </Card>

            {/* Content Library Preview */}
            <Card className="glass-card p-6">
              <VinylBookshelf onRecordSelect={handleRecordSelect} title="Recent Creations" />
            </Card>

            <SuggestedActions />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Voice Assistant */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Artist Voice Assistant</h3>
              <div className="min-h-[200px]">
                <Siri theme="ios9" />
              </div>
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-white/70 mb-2">Recent Integrations:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">✓ Google Calendar</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">✓ Travel Apps</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">✓ Social Media</span>
                </div>
              </div>
            </Card>

            {/* Schedule & Calendar */}
            <Card className="glass-card p-6">
              <Tabs defaultValue="schedule">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="schedule" className="text-white data-[state=active]:bg-white/20">Schedule</TabsTrigger>
                  <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-white/20">Calendar</TabsTrigger>
                </TabsList>
                <TabsContent value="schedule">
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-white">Studio Session</p>
                        <p className="text-xs text-white/70">2:00 PM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-white">Travel to Denver</p>
                        <p className="text-xs text-white/70">Next Week</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-white">Album Review</p>
                        <p className="text-xs text-white/70">Friday 3:00 PM</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="calendar">
                   <div className="mt-4 p-8 bg-white/5 rounded-lg text-center">
                     <Calendar className="h-12 w-12 text-white/50 mx-auto mb-4" />
                     <p className="text-sm text-white/70">Interactive calendar widget goes here</p>
                   </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
        
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