import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  QrCode, 
  UserPlus, 
  FileText, 
  Users, 
  CheckCircle, 
  Star,
  Zap,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { RevenueChart } from "@/components/event-toolkit/analytics/RevenueChart";
import { PipelineHealth } from "@/components/event-toolkit/analytics/PipelineHealth";
import { InsightsPanel } from "@/components/event-toolkit/analytics/InsightsPanel";
import { UpcomingGigsTimeline } from "@/components/event-toolkit/analytics/UpcomingGigsTimeline";

const EventToolkitDashboard = () => {
  const navigate = useNavigate();

  const QuickActions = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/event-toolkit/gigs/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Plus className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">New Gig</h3>
              <p className="text-blue-lightest/70 text-sm">Schedule performance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/event-toolkit/invoices/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">New Invoice</h3>
              <p className="text-blue-lightest/70 text-sm">Create billing</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/event-toolkit/qr-upload/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <QrCode className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Generate QR</h3>
              <p className="text-blue-lightest/70 text-sm">Fan engagement</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/event-toolkit/contacts/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <UserPlus className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Add Contact</h3>
              <p className="text-blue-lightest/70 text-sm">Network expansion</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const EnhancedAnalytics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Intelligence Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueChart />
        <PipelineHealth />
        <UpcomingGigsTimeline />
        <InsightsPanel />
      </div>
    </div>
  );

  const GettingStarted = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3">

        <div className="flex items-center mb-6">
          <CheckCircle className="h-5 w-5 text-white mr-2" />
          <h2 className="text-lg font-semibold text-white">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Create Your First Gig</h3>
                <Plus className="h-5 w-5 text-white" />
              </div>
              <p className="text-blue-lightest/70 text-sm mb-4">Start tracking your performances</p>
              <Button 
                className="w-full bg-blue-primary hover:bg-blue-primary/80 text-white"
                onClick={() => navigate("/event-toolkit/gigs/create")}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Build Your Network</h3>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-blue-lightest/70 text-sm mb-4">Add venues, promoters, and collaborators</p>
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/event-toolkit/contacts")}
              >
                Manage Contacts
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Track Earnings</h3>
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-blue-lightest/70 text-sm mb-4">Monitor your performance income</p>
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/event-toolkit/invoices")}
              >
                View Invoices
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          </div>
          <p className="text-blue-lightest/70">Ready to create magical experiences for your fans</p>
        </div>

        <QuickActions />
        <EnhancedAnalytics />
        <GettingStarted />
      </div>
    </DashboardLayout>
  );
};

export default EventToolkitDashboard;