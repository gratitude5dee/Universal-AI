import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCode, Plus, Copy, Eye, Upload, Users, Link2, Scan, Share2, BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const QrUploadManager = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">QR Upload Manager</h1>
              <p className="text-white/70">Create powerful QR campaigns to collect fan content and engage your audience</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate("/event-toolkit/qr-upload/new")}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Plus className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New Campaign</h3>
                  <p className="text-sm text-white/60">Create QR campaign</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <Scan className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">QR Scanner</h3>
                  <p className="text-sm text-white/60">Test campaigns</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics</h3>
                  <p className="text-sm text-white/60">View insights</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <Share2 className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Share Campaign</h3>
                  <p className="text-sm text-white/60">Distribute QR codes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Active Campaigns</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">3</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      +2 new
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Running now</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <QrCode className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Total Uploads</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">247</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      +45 today
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">All time</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Upload className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Unique Fans</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">89</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      +12 this week
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Contributors</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Engagement Rate</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">68%</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                      +8% vs last month
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Conversion rate</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Link2 className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Copy className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-1 p-6 bg-background/10 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <QrCode className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Concert Upload Campaign</p>
                  <p className="text-xs text-white/60">12 new uploads received</p>
                </div>
                <span className="text-xs text-white/40">2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Backstage Access QR</p>
                  <p className="text-xs text-white/60">8 fans participated</p>
                </div>
                <span className="text-xs text-white/40">1 day ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Share2 className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Merch Photo Contest</p>
                  <p className="text-xs text-white/60">Campaign shared 47 times</p>
                </div>
                <span className="text-xs text-white/40">3 days ago</span>
              </div>
            </div>
          </Card>

          {/* Getting Started */}
          <Card className="lg:col-span-2 p-6 bg-background/10 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <QrCode className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Getting Started</h3>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Plus className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Create Your First Campaign</h4>
                      <p className="text-sm text-white/60">Set up a QR code for fan content collection</p>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-white/40" />
                </div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Share2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Share QR Codes</h4>
                      <p className="text-sm text-white/60">Distribute your campaigns to fans</p>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-white/40" />
                </div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Track Performance</h4>
                      <p className="text-sm text-white/60">Monitor uploads and engagement</p>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-white/40" />
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default QrUploadManager;