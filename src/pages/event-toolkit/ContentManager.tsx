import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Music, Image, Video, HardDrive, File, FolderOpen, Search, Filter } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const ContentManager = () => {
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
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Content Manager</h1>
              <p className="text-white/70">Ready to organize your creative assets and build your content library</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Upload className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Upload Files</h3>
                  <p className="text-sm text-white/60">Add new content</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <FolderOpen className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New Folder</h3>
                  <p className="text-sm text-white/60">Organize content</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Search className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Search Library</h3>
                  <p className="text-sm text-white/60">Find files fast</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <Filter className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Filter Content</h3>
                  <p className="text-sm text-white/60">Sort and organize</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <HardDrive className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Total Files</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">247</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      +12%
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Ready to share</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <File className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Card>

            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Music Files</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">89</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      +5%
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Audio content</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Music className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Photos</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">134</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      +8%
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">This week</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Image className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Storage Used</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">45.2 GB</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                      +3.1 GB
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">This month</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <HardDrive className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-1 p-6 bg-background/10 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <File className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Upload className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New Song Upload</p>
                  <p className="text-xs text-white/60">Demo_track_v2.mp3 uploaded</p>
                </div>
                <span className="text-xs text-white/40">2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Image className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Album Artwork Added</p>
                  <p className="text-xs text-white/60">cover_art_final.jpg processed</p>
                </div>
                <span className="text-xs text-white/40">1 day ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FolderOpen className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New Folder Created</p>
                  <p className="text-xs text-white/60">Tour 2024 folder organized</p>
                </div>
                <span className="text-xs text-white/40">3 days ago</span>
              </div>
            </div>
          </Card>

          {/* Getting Started */}
          <Card className="lg:col-span-2 p-6 bg-background/10 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Getting Started</h3>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Upload className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Upload Your First Content</h4>
                      <p className="text-sm text-white/60">Start building your content library</p>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-white/40" />
                </div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Organize Your Library</h4>
                      <p className="text-sm text-white/60">Create folders and structure your content</p>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-white/40" />
                </div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Search className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Set Up Search Tags</h4>
                      <p className="text-sm text-white/60">Add metadata to make content discoverable</p>
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

export default ContentManager;