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
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
            <p className="text-muted-foreground mt-1">Organize and manage your performance content library</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              <span className="text-sm">Upload Files</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FolderOpen className="h-6 w-6 text-primary" />
              <span className="text-sm">Create Folder</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              <span className="text-sm">Search Content</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Filter className="h-6 w-6 text-primary" />
              <span className="text-sm">Filter Files</span>
            </Button>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Files"
            value="247"
            icon={File}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="Music"
            value="89"
            icon={Music}
            subtitle="Audio files"
            trend={{ value: "5%", isPositive: true }}
          />
          <StatsCard
            title="Photos"
            value="134"
            icon={Image}
            subtitle="Image files"
            trend={{ value: "8%", isPositive: true }}
          />
          <StatsCard
            title="Videos"
            value="24"
            icon={Video}
            subtitle="Video files"
            trend={{ value: "15%", isPositive: true }}
          />
          <StatsCard
            title="Storage Used"
            value="45.2 GB"
            icon={HardDrive}
            subtitle="of 100 GB"
            trend={{ value: "3.1 GB", isPositive: true }}
          />
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters & Search */}
          <Card className="lg:col-span-1 p-6 bg-background/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Filters & Search</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Search Content</label>
                <Input placeholder="Search files..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">File Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Content Library */}
          <Card className="lg:col-span-2 p-6 bg-background/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Content Library</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">No content found</h4>
              <p className="text-muted-foreground mb-6 max-w-md">Upload your first file to start building your content library. Supported formats: MP3, MP4, JPG, PNG, PDF, and more.</p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ContentManager;