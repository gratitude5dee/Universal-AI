import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const Gigs = () => {
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
            <h1 className="text-3xl font-bold text-foreground">Gigs</h1>
            <p className="text-muted-foreground">Manage your upcoming and past performances</p>
          </div>
          <Button onClick={() => navigate("/event-toolkit/gigs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Gig
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Search gigs..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No gigs yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first gig to track your performances</p>
            <Button onClick={() => navigate("/event-toolkit/gigs/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Gig
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Gigs;