import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Trash2, Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  quantity?: number;
}

type InvoiceRow = Database['public']['Tables']['invoices']['Row'];

interface InvoiceLineItemSummary {
  description: string;
  amount: number;
  quantity?: number;
}

interface GeneratedInvoiceResponse {
  invoice: InvoiceRow;
  invoiceData: {
    invoiceNumber: string;
    lineItems: InvoiceLineItemSummary[];
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    balanceDue: number;
    dueDate: string;
  };
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
  bookingDetails
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<GeneratedInvoiceResponse | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: 'Performance Fee', amount: bookingDetails.offerAmount || 2500 },
    { id: '2', description: 'Sound & Lighting', amount: 500 },
    { id: '3', description: 'Travel Expenses', amount: 300 }
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState('USD');

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: Date.now().toString(), 
      description: '', 
      amount: 0 
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const calculateTax = () => Number((calculateSubtotal() * taxRate).toFixed(2));
  const calculateTotal = () => Number((calculateSubtotal() + calculateTax()).toFixed(2));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<GeneratedInvoiceResponse>('generate-invoice', {
        body: {
          bookingId,
          lineItems: lineItems.map(item => ({
            description: item.description,
            amount: item.amount,
            quantity: 1
          })),
          taxRate,
          currency,
        }
      });

      if (error) throw error;

      setInvoice(data);

      toast({
        title: "Invoice created!",
        description: `Invoice ${data.invoiceData.invoiceNumber} has been generated.`,
      });

    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    const invoiceLines = invoice.invoiceData.lineItems
      .map((item) => `${item.description}${item.quantity && item.quantity > 1 ? ` (${item.quantity}x)` : ''}: $${(Number(item.amount) * (item.quantity ?? 1)).toFixed(2)}`)
      .join('\n');

    const invoiceText = `
INVOICE

Invoice Number: ${invoice.invoiceData.invoiceNumber}
Venue: ${bookingDetails.venueName}
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(invoice.invoiceData.dueDate).toLocaleDateString()}

LINE ITEMS:
${invoiceLines}

Subtotal: $${invoice.invoiceData.subtotal.toFixed(2)}
Tax: $${invoice.invoiceData.tax.toFixed(2)}
TOTAL (${invoice.invoiceData.currency}): $${invoice.invoiceData.total.toFixed(2)}
Balance Due: $${invoice.invoiceData.balanceDue.toFixed(2)}

Payment Terms: Net 30 days
`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceData.invoiceNumber}.txt`;
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
            {invoice ? 'Invoice Generated' : 'Create Invoice'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {invoice ? `Invoice for ${bookingDetails.venueName}` : `Generate an invoice for ${bookingDetails.venueName}`}
          </DialogDescription>
        </DialogHeader>

        {!invoice ? (
          <div className="space-y-6 py-4">
            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">Line Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {lineItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start p-3 bg-background/50 rounded-lg border border-border">
                    <div className="flex-1">
                      <Input
                        placeholder="Description (e.g., Performance Fee)"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.amount || ''}
                        onChange={(e) => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
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

            {/* Invoice Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Tax Rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={(taxRate * 100).toString()}
                  onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Currency</Label>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  className="mt-1 bg-background border-border uppercase"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t-2 border-primary/30 pt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Tax ({(taxRate * 100).toFixed(2)}%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            </div>

            {/* Info */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Invoice will be created with a 30-day payment term and saved to the booking record.
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || lineItems.some(item => !item.description || item.amount <= 0)}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Invoice Preview */}
            <div className="bg-gradient-to-br from-background to-accent/5 rounded-xl border-2 border-primary/20 p-8 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">INVOICE</h3>
                  <p className="text-lg text-primary font-mono">#{invoice.invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                  <p className="font-semibold text-foreground">{new Date().toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Due Date</p>
                  <p className="font-semibold text-primary">{new Date(invoice.invoiceData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Venue Info */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bill To:</p>
                <p className="text-lg font-semibold text-foreground">{bookingDetails.venueName}</p>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border">
                  <p className="text-sm font-semibold text-muted-foreground col-span-2">Description</p>
                  <p className="text-sm font-semibold text-muted-foreground text-right">Amount</p>
                </div>
                {invoice.invoiceData.lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <p className="text-foreground col-span-2">
                      {item.description}
                      {item.quantity && item.quantity > 1 ? ` (${item.quantity}×)` : ''}
                    </p>
                    <p className="font-semibold text-foreground text-right">
                      ${(Number(item.amount) * (item.quantity ?? 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-2 pt-6 border-t-2 border-primary/30">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${invoice.invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>${invoice.invoiceData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-foreground">Total Due ({invoice.invoiceData.currency})</span>
                  <span className="text-3xl font-bold text-primary">${invoice.invoiceData.total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Payment Terms: Net 30 days from invoice date. Balance due: ${invoice.invoiceData.balanceDue.toFixed(2)} {invoice.invoiceData.currency}.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setInvoice(null);
                  setLineItems([
                    { id: '1', description: 'Performance Fee', amount: bookingDetails.offerAmount || 2500 },
                    { id: '2', description: 'Sound & Lighting', amount: 500 },
                    { id: '3', description: 'Travel Expenses', amount: 300 }
                  ]);
                  setTaxRate(0);
                  setCurrency('USD');
                }}
                className="flex-1"
              >
                Create New Invoice
              </Button>
              <Button
                onClick={downloadInvoice}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
