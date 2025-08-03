import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Music, Image, Video, HardDrive, File } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
            <p className="text-muted-foreground">Organize and manage your performance content library</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Files"
            value="0"
            icon={File}
          />
          <StatsCard
            title="Music"
            value="0"
            icon={Music}
            subtitle="Audio files"
          />
          <StatsCard
            title="Photos"
            value="0"
            icon={Image}
            subtitle="Image files"
          />
          <StatsCard
            title="Videos"
            value="0"
            icon={Video}
            subtitle="Video files"
          />
          <StatsCard
            title="Storage Used"
            value="0 GB"
            icon={HardDrive}
            subtitle="of 100 GB"
          />
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search content..." className="md:max-w-sm" />
            <Select>
              <SelectTrigger className="md:max-w-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Upload className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No content found</h3>
            <p className="text-muted-foreground mb-6">Upload your first file to start building your content library</p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First File
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default ContentManager;