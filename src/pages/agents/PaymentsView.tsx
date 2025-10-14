import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingAgentLayout from "@/layouts/booking-agent-layout";

interface Payment {
  id: string;
  venue_name: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  due_date: string;
  paid_date?: string;
  invoice_number: string;
}

const PaymentsView = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Mock data for now - replace with actual payment data when table is created
      setPayments([
        {
          id: "1",
          venue_name: "Blue Note Jazz Club",
          amount: 2500,
          status: "paid",
          due_date: "2025-02-01",
          paid_date: "2025-01-28",
          invoice_number: "INV-001"
        },
        {
          id: "2",
          venue_name: "The Apollo Theater",
          amount: 8500,
          status: "pending",
          due_date: "2025-03-15",
          invoice_number: "INV-002"
        },
        {
          id: "3",
          venue_name: "Village Vanguard",
          amount: 3000,
          status: "overdue",
          due_date: "2025-01-10",
          invoice_number: "INV-003"
        }
      ]);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const overdueRevenue = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <BookingAgentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </BookingAgentLayout>
    );
  }

  return (
    <BookingAgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payment Tracking</h2>
          <p className="text-muted-foreground">Monitor invoices and revenue streams</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400/80 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-400/80 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400">${pendingRevenue.toLocaleString()}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400/80 mb-1">Overdue</p>
                  <p className="text-3xl font-bold text-red-400">${overdueRevenue.toLocaleString()}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by venue name or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="glass-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{payment.venue_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{payment.invoice_number}</span>
                        <span>•</span>
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                        {payment.paid_date && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">Paid: {new Date(payment.paid_date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${payment.amount.toLocaleString()}</p>
                    </div>
                    <Badge className={`${getStatusColor(payment.status)} gap-1`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 && (
          <Card className="glass-card border-border">
            <CardContent className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Payments Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "No payment records available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BookingAgentLayout>
  );
};

export default PaymentsView;
