import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  FilePlus, 
  QrCode, 
  UserPlus, 
  FileText, 
  Upload, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Zap,
  BarChart3,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

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

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Clock className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Upcoming Gigs</h3>
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Ready to book</div>
              <div className="text-xs text-blue-lightest/70">Next: No upcoming gigs</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Unpaid Invoices</h3>
              <FileText className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">$0</div>
              <div className="text-sm text-green-400">All clear</div>
              <div className="text-xs text-blue-lightest/70">0 overdue</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Fan Uploads</h3>
              <Upload className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">This week</div>
              <div className="text-xs text-blue-lightest/70">Last 7 days</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Network Growth</h3>
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">New contacts</div>
              <div className="text-xs text-blue-lightest/70">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-center mb-6">
          <Clock className="h-5 w-5 text-white mr-2" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Club Paradise Booking</h3>
                  <p className="text-blue-lightest/70 text-sm">Performance scheduled for next Friday</p>
                  <p className="text-xs text-blue-lightest/50 mt-1">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Invoice #INV-2024-001</h3>
                  <p className="text-blue-lightest/70 text-sm">Payment received from Luna Lounge</p>
                  <p className="text-xs text-blue-lightest/50 mt-1">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-6">
          <CheckCircle className="h-5 w-5 text-white mr-2" />
          <h2 className="text-lg font-semibold text-white">Getting Started</h2>
        </div>
        <div className="space-y-4">
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
        <PerformanceMetrics />
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default EventToolkitDashboard;