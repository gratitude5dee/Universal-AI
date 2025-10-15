import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, AlertCircle, CheckCircle, Clock, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  paid_at?: string;
  gig: {
    title: string;
    venue: {
      name: string;
    };
  };
}

const InvoicesPanel = () => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  // Fetch invoices data
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          gig:gigs(
            title,
            venue:venues(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate stats
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const overdueAmount = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const recentInvoices = invoices.slice(0, 6);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return FileText;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Financial Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Paid invoices"
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          delay={0}
        />
        <StatsCard
          title="Pending Payment"
          value={`$${pendingAmount.toLocaleString()}`}
          description="Awaiting payment"
          icon={Clock}
          delay={1}
        />
        <StatsCard
          title="Overdue Amount"
          value={`$${overdueAmount.toLocaleString()}`}
          description="Requires attention"
          icon={AlertCircle}
          delay={2}
        />
      </motion.div>

      {/* Invoices List */}
      <motion.div variants={itemVariants}>
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices created yet</p>
                <p className="text-sm">Generate your first invoice from a confirmed gig</p>
              </div>
            ) : (
              recentInvoices.map((invoice, index) => {
                const StatusIcon = getStatusIcon(invoice.status);
                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(invoice.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">
                            Invoice #{invoice.invoice_number}
                          </h3>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm">
                          {invoice.gig?.title} • {invoice.gig?.venue?.name}
                        </p>
                        <p className="text-white/50 text-xs">
                          Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                          {invoice.paid_at && (
                            <span className="ml-2">
                              • Paid: {format(new Date(invoice.paid_at), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          View
                        </Button>
                        {invoice.status === 'pending' && (
                          <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80">
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      {invoices.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-studio-accent" />
              <h3 className="text-white font-medium mb-1">Create Invoice</h3>
              <p className="text-white/70 text-sm">Generate from gig</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="text-white font-medium mb-1">Export Data</h3>
              <p className="text-white/70 text-sm">Download reports</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
              <h3 className="text-white font-medium mb-1">Send Reminders</h3>
              <p className="text-white/70 text-sm">Bulk notifications</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <h3 className="text-white font-medium mb-1">Payment Setup</h3>
              <p className="text-white/70 text-sm">Configure methods</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvoicesPanel;