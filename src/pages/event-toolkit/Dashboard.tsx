import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, FilePlus, QrCode, UserPlus, FileText, Upload, TrendingUp, Users, Clock, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const EventToolkitDashboard = () => {
  const navigate = useNavigate();

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

  const quickActions = [
    {
      title: "New Gig",
      description: "Schedule performance",
      icon: Plus,
      action: () => navigate("/event-toolkit/gigs/new"),
      gradient: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "New Invoice",
      description: "Create billing",
      icon: FilePlus,
      action: () => navigate("/event-toolkit/invoices/new"),
      gradient: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Generate QR",
      description: "Fan engagement",
      icon: QrCode,
      action: () => navigate("/event-toolkit/qr-upload/new"),
      gradient: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Add Contact",
      description: "Network expansion",
      icon: UserPlus,
      action: () => navigate("/event-toolkit/contacts/new"),
      gradient: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const recentActivities = [
    {
      type: "gig",
      title: "Club Paradise Booking",
      description: "Performance scheduled for next Friday",
      time: "2 hours ago",
      status: "confirmed",
      icon: Calendar
    },
    {
      type: "invoice",
      title: "Invoice #INV-2024-001",
      description: "Payment received from Luna Lounge",
      time: "1 day ago",
      status: "paid",
      icon: FileText
    },
    {
      type: "contact",
      title: "New Contact Added",
      description: "Marcus Chen - Event Promoter",
      time: "3 days ago",
      status: "active",
      icon: UserPlus
    }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemAnimation} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">Ready to create magical experiences for your fans</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemAnimation}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:shadow-card-glow group`}
                  onClick={action.action}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemAnimation}>
              <div className="glass-card p-6 hover:shadow-card-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Upcoming Gigs</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                        Ready to book
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Next: No upcoming gigs</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="glass-card p-6 hover:shadow-card-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Unpaid Invoices</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">$0</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                        All clear
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">0 overdue</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="glass-card p-6 hover:shadow-card-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Fan Uploads</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                        This week
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Upload className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="glass-card p-6 hover:shadow-card-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Network Growth</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500">
                        New contacts
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity & Insights */}
        <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-background/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No recent activity</p>
                  <Button variant="outline" size="sm">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Getting Started
            </h3>
            
            <div className="space-y-4">
              <motion.div 
                className="p-4 bg-primary/5 rounded-xl border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
                whileHover={{ x: 3 }}
                onClick={() => navigate("/event-toolkit/gigs/new")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Create Your First Gig</h4>
                    <p className="text-sm text-muted-foreground">Start tracking your performances</p>
                  </div>
                  <Plus className="h-5 w-5 text-primary" />
                </div>
              </motion.div>

              <motion.div 
                className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 cursor-pointer hover:bg-blue-500/10 transition-colors"
                whileHover={{ x: 3 }}
                onClick={() => navigate("/event-toolkit/contacts/new")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Build Your Network</h4>
                    <p className="text-sm text-muted-foreground">Add venue managers and promoters</p>
                  </div>
                  <UserPlus className="h-5 w-5 text-blue-500" />
                </div>
              </motion.div>

              <motion.div 
                className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 cursor-pointer hover:bg-green-500/10 transition-colors"
                whileHover={{ x: 3 }}
                onClick={() => navigate("/event-toolkit/qr-upload/new")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Engage Your Fans</h4>
                    <p className="text-sm text-muted-foreground">Set up QR content collection</p>
                  </div>
                  <QrCode className="h-5 w-5 text-green-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default EventToolkitDashboard;