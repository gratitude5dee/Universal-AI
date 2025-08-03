import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, FilePlus, QrCode, UserPlus, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const EventToolkitDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "New Gig",
      icon: Plus,
      action: () => navigate("/event-toolkit/gigs/new"),
      color: "bg-primary/10 hover:bg-primary/20"
    },
    {
      title: "New Invoice",
      icon: FilePlus,
      action: () => navigate("/event-toolkit/invoices/new"),
      color: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
      title: "Generate QR",
      icon: QrCode,
      action: () => navigate("/event-toolkit/qr-upload/new"),
      color: "bg-green-500/10 hover:bg-green-500/20"
    },
    {
      title: "Add Contact",
      icon: UserPlus,
      action: () => navigate("/event-toolkit/contacts/new"),
      color: "bg-purple-500/10 hover:bg-purple-500/20"
    }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your events and fan engagement from one central hub.</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all hover:scale-105 ${action.color} border-border/50`}
                  onClick={action.action}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <action.icon className="h-8 w-8 text-foreground" />
                    <span className="font-medium text-foreground">{action.title}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Stats Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Upcoming Gigs"
              value="0"
              icon={Calendar}
              subtitle="Next: No upcoming gigs"
            />
            <StatsCard
              title="Unpaid Invoices"
              value="$0"
              icon={FileText}
              subtitle="0 overdue"
            />
            <StatsCard
              title="New Fan Uploads"
              value="0"
              icon={Upload}
              subtitle="Last 7 days"
            />
            <StatsCard
              title="Follow-up Reminders"
              value="0"
              icon={UserPlus}
              subtitle="Due this week"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Gigs */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Gigs</h3>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No recent gigs</p>
                <Button onClick={() => navigate("/event-toolkit/gigs/new")}>
                  + Add Your First Gig
                </Button>
              </div>
            </Card>

            {/* Recent Invoices */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Invoices</h3>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No recent invoices</p>
                <Button onClick={() => navigate("/event-toolkit/invoices/new")}>
                  + Add Your First Invoice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default EventToolkitDashboard;