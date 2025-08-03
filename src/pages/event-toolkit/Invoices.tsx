import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, DollarSign, Clock, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";

const Invoices = () => {
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
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Track your performance payments and billing</p>
          </div>
          <Button onClick={() => navigate("/event-toolkit/invoices/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Invoices"
            value="0"
            icon={FileText}
          />
          <StatsCard
            title="Unpaid Amount"
            value="$0"
            icon={DollarSign}
            subtitle="Awaiting payment"
          />
          <StatsCard
            title="Overdue"
            value="0"
            icon={Clock}
            subtitle="Past due date"
          />
          <StatsCard
            title="Paid This Month"
            value="$0"
            icon={CheckCircle}
            subtitle="Current month"
          />
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search invoices..." className="md:max-w-sm" />
            <Select>
              <SelectTrigger className="md:max-w-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No invoices found</h3>
            <p className="text-muted-foreground mb-6">Create your first invoice to start tracking payments</p>
            <Button onClick={() => navigate("/event-toolkit/invoices/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Invoice
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Invoices;