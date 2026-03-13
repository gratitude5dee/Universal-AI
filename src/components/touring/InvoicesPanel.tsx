import { motion } from "framer-motion";
import { DollarSign, FileText, AlertCircle, CheckCircle, Clock, Plus, Download, BellRing } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { useTouringInvoices } from "@/hooks/useTouringWorkspace";
import { downloadInvoicePdf, exportTouringReport, formatMoney, recordInvoicePayment, sendInvoiceReminder } from "@/lib/touring";
import { useToast } from "@/hooks/use-toast";

const InvoicesPanel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: invoices = [], isLoading } = useTouringInvoices();
  const { data: currentUserId } = useCurrentUserId();

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + Number(invoice.amount ?? 0), 0);
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + Number(invoice.balance_due ?? invoice.amount ?? 0), 0);
  const overdueAmount = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + Number(invoice.balance_due ?? invoice.amount ?? 0), 0);

  const refreshInvoices = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["invoices"] }),
      queryClient.invalidateQueries({ queryKey: ["touring", "stats"] }),
    ]);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "draft":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "pending":
        return Clock;
      case "overdue":
        return AlertCircle;
      default:
        return FileText;
    }
  };

  const handleDownload = async (invoiceId: string) => {
    try {
      await downloadInvoicePdf(invoiceId);
      toast({
        title: "Invoice exported",
        description: "The invoice document was downloaded as HTML.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "The invoice document could not be generated.",
      });
    }
  };

  const handleReminder = async (invoiceId: string, recipient?: string | null) => {
    if (!recipient) {
      toast({
        title: "No recipient configured",
        description: "Add a venue contact email before sending reminders.",
      });
      return;
    }

    try {
      await sendInvoiceReminder({
        invoiceId,
        recipient,
        subject: "Invoice reminder",
        messageBody: "Reminder: payment is still outstanding for this performance invoice.",
      });
      await refreshInvoices();
      toast({
        title: "Reminder sent",
        description: `The invoice reminder was queued for ${recipient}.`,
      });
    } catch (error) {
      toast({
        title: "Reminder failed",
        description: error instanceof Error ? error.message : "The reminder could not be sent.",
      });
    }
  };

  const handleMarkPaid = async (invoiceId: string, amount: number) => {
    if (!currentUserId) {
      toast({
        title: "Payment failed",
        description: "The current user could not be resolved.",
      });
      return;
    }

    try {
      await recordInvoicePayment({
        creatorId: currentUserId,
        invoiceId,
        amount,
        paymentMethod: "manual",
        metadata: { source: "touring_invoices_panel" },
      });
      await refreshInvoices();
      toast({
        title: "Payment recorded",
        description: "The invoice was marked as paid and revenue rollups were updated.",
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "The payment could not be recorded.",
      });
    }
  };

  const handleExport = async () => {
    try {
      await exportTouringReport();
      toast({
        title: "Touring report exported",
        description: "The current touring report was downloaded as JSON.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "The report could not be generated.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Total Revenue" value={formatMoney(totalRevenue)} description="Paid invoices" icon={DollarSign} delay={0} />
        <StatsCard title="Pending Payment" value={formatMoney(pendingAmount)} description="Awaiting payment" icon={Clock} delay={1} />
        <StatsCard title="Overdue Amount" value={formatMoney(overdueAmount)} description="Requires attention" icon={AlertCircle} delay={2} />
      </div>

      <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
            <FileText className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/invoices/create")}>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices.length === 0 ? (
            <div className="py-8 text-center text-white/70">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No invoices created yet</p>
              <p className="text-sm">Generate the first invoice from a confirmed gig to start collections.</p>
            </div>
          ) : (
            invoices.slice(0, 8).map((invoice, index) => {
              const StatusIcon = getStatusIcon(invoice.status);
              const balanceDue = Number(invoice.balance_due ?? invoice.amount ?? 0);
              const contactEmail = invoice.gig?.venue?.contact_email ?? null;

              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10 md:flex-row"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-lg p-2 ${getStatusColor(invoice.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-white">Invoice #{invoice.invoice_number ?? invoice.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status ?? "draft"}</Badge>
                      </div>
                      <p className="text-sm text-white/70">
                        {invoice.gig?.title ?? "Performance"} • {invoice.gig?.venue?.name ?? "Venue TBD"}
                      </p>
                      <p className="text-xs text-white/50">
                        {invoice.due_date ? `Due: ${format(new Date(invoice.due_date), "MMM dd, yyyy")}` : "Due date not set"}
                        {invoice.paid_at ? <span className="ml-2">• Paid: {format(new Date(invoice.paid_at), "MMM dd, yyyy")}</span> : null}
                      </p>
                      {contactEmail ? <p className="mt-1 text-xs text-white/50">Reminder recipient: {contactEmail}</p> : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{formatMoney(invoice.amount, invoice.currency ?? "USD")}</p>
                    <p className="text-xs text-white/50">Balance due: {formatMoney(balanceDue, invoice.currency ?? "USD")}</p>
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => handleDownload(invoice.id)}>
                        Download
                      </Button>
                      {invoice.status !== "paid" ? (
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => handleReminder(invoice.id, contactEmail)}>
                          <BellRing className="mr-2 h-4 w-4" />
                          Reminder
                        </Button>
                      ) : null}
                      {invoice.status !== "paid" ? (
                        <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => handleMarkPaid(invoice.id, balanceDue)}>
                          Mark Paid
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoicesPanel;
