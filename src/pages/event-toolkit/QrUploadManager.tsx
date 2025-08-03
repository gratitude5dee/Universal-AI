import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCode, Plus, Copy, Eye, Upload, Users, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const QrUploadManager = () => {
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-foreground">QR Upload Manager</h1>
            <p className="text-muted-foreground">Create QR campaigns for fan content collection</p>
          </div>
          <Button onClick={() => navigate("/event-toolkit/qr-upload/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create QR Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Campaigns"
            value="0"
            icon={QrCode}
          />
          <StatsCard
            title="Total Uploads"
            value="0"
            icon={Upload}
            subtitle="All time"
          />
          <StatsCard
            title="Unique Fans"
            value="0"
            icon={Users}
            subtitle="Contributors"
          />
          <StatsCard
            title="This Month"
            value="0"
            icon={Link2}
            subtitle="New uploads"
          />
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <Input placeholder="Search campaigns..." className="max-w-sm" />
        </Card>

        {/* QR Upload Campaigns */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-6">QR Upload Campaigns</h3>
          
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <QrCode className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">Create your first QR campaign to collect fan content</p>
            <Button onClick={() => navigate("/event-toolkit/qr-upload/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default QrUploadManager;