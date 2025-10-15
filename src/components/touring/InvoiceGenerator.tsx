import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Trash2, Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableLineItem {
  id: string;
  description: string;
  amount: number;
  quantity?: number;
}

interface CalculatedLineItem {
  description: string;
  amount: number;
  quantity?: number;
}

interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
  balanceDue: number;
}

interface InvoiceResponse {
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  totals: InvoiceTotals;
  dueDate: string;
  lineItems: CalculatedLineItem[];
  currency: string;
}

interface InvoiceGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  bookingDetails: {
    venueName: string;
    offerAmount?: number;
  };
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  open,
  onOpenChange,
  bookingId,
  bookingDetails,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [lineItems, setLineItems] = useState<EditableLineItem[]>([
    { id: "1", description: "Performance Fee", amount: bookingDetails.offerAmount || 2500, quantity: 1 },
    { id: "2", description: "Sound & Lighting", amount: 500, quantity: 1 },
    { id: "3", description: "Travel Expenses", amount: 300, quantity: 1 },
  ]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: "",
        amount: 0,
        quantity: 1,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const updateLineItem = (id: string, field: "description" | "amount" | "quantity", value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "description" ? String(value) : Number(value) || 0,
            }
          : item,
      ),
    );
  };

  const draftTotals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0) * (item.quantity ?? 1), 0);
    return {
      subtotal,
      total: subtotal,
    };
  }, [lineItems]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<InvoiceResponse>("generate-invoice", {
        body: {
          bookingId,
          lineItems: lineItems.map((item) => ({
            description: item.description,
            amount: Number(item.amount || 0),
            quantity: Number(item.quantity || 1),
          })),
        },
      });

      if (error) throw error;

      if (!data) {
        throw new Error('Invoice service returned no data');
      }

      setInvoice(data);

      toast({
        title: "Invoice created!",
        description: `Invoice ${data.invoiceNumber} has been generated.`,
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      const message = error instanceof Error ? error.message : "Failed to create invoice. Please try again.";
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    if (!invoice) return;

    const invoiceText = `
INVOICE

Invoice Number: ${invoice.invoiceNumber}
Venue: ${bookingDetails.venueName}
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

LINE ITEMS:
${invoice.lineItems
  .map((item) => `${item.description} (${item.quantity ?? 1}x): $${item.amount.toFixed(2)}`)
  .join("\n")}

Subtotal: $${invoice.totals.subtotal.toFixed(2)}
Tax: $${invoice.totals.tax.toFixed(2)}
Total Due: $${invoice.totals.total.toFixed(2)}
Balance Due: $${invoice.totals.balanceDue.toFixed(2)}

Payment Terms: Net 30 days
`;

    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Invoice saved to your downloads",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            {invoice ? "Invoice Generated" : "Create Invoice"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {invoice
              ? `Invoice for ${bookingDetails.venueName}`
              : `Generate an invoice for ${bookingDetails.venueName}`}
          </DialogDescription>
        </DialogHeader>

        {!invoice ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">Line Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-start p-3 bg-background/50 rounded-lg border border-border"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Description (e.g., Performance Fee)"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        className="bg-background border-border"
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity ?? 1}
                        onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 1)}
                        min={1}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.amount || ""}
                        onChange={(e) => updateLineItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                        className="bg-background border-border"
                        step="0.01"
                      />
                    </div>
                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-primary/30">
                <span className="text-lg font-semibold text-foreground">Draft Total</span>
                <span className="text-3xl font-bold text-primary">
                  ${draftTotals.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Invoice will be created with a 30-day payment term and saved to the booking record.
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Invoice"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Invoice Details</h3>
                <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium text-foreground">{bookingDetails.venueName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium text-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize text-foreground">{invoice.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium text-foreground">{invoice.currency.toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${invoice.totals.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Line Items
                </h4>
                <Button variant="outline" size="sm" onClick={downloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>
              </div>

              <div className="space-y-3">
                {invoice.lineItems.map((item, index) => (
                  <div
                    key={`${item.description}-${index}`}
                    className="flex justify-between items-center p-3 bg-background/40 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.description}</p>
                      <p className="text-sm text-muted-foreground">Qty {item.quantity ?? 1}</p>
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      ${(item.amount * (item.quantity ?? 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${invoice.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>${invoice.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total Due</span>
                  <span>${invoice.totals.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Balance Outstanding</span>
                  <span>${invoice.totals.balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                Booking has been moved into the invoice stage with payment status set to unpaid. Record payments from your
                finance workflow to mark this invoice as settled.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

