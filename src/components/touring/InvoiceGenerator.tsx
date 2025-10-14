import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Trash2, Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  id: string;
  description: string;
  amount: number;
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
  const [invoice, setInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: 'Performance Fee', amount: bookingDetails.offerAmount || 2500 },
    { id: '2', description: 'Sound & Lighting', amount: 500 },
    { id: '3', description: 'Travel Expenses', amount: 300 }
  ]);

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

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: {
          bookingId,
          lineItems: lineItems.map(item => ({
            description: item.description,
            amount: item.amount
          }))
        }
      });

      if (error) throw error;

      setInvoice(data);

      toast({
        title: "Invoice created!",
        description: `Invoice ${data.invoiceData.invoiceNumber} has been generated.`,
      });

      // Update booking status
      await supabase
        .from('venue_bookings')
        .update({ 
          status: 'paid',
          workflow_stage: 'invoice'
        })
        .eq('id', bookingId);

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
    const invoiceText = `
INVOICE

Invoice Number: ${invoice.invoiceData.invoiceNumber}
Venue: ${bookingDetails.venueName}
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(invoice.invoiceData.dueDate).toLocaleDateString()}

LINE ITEMS:
${lineItems.map(item => `${item.description}: $${item.amount.toFixed(2)}`).join('\n')}

TOTAL: $${calculateTotal().toFixed(2)}

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

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-primary/30">
                <span className="text-lg font-semibold text-foreground">Total Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
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
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
                  <p className="text-sm font-semibold text-muted-foreground">Description</p>
                  <p className="text-sm font-semibold text-muted-foreground text-right">Amount</p>
                </div>
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-2 gap-4">
                    <p className="text-foreground">{item.description}</p>
                    <p className="font-semibold text-foreground text-right">${item.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6 border-t-2 border-primary/30">
                <span className="text-xl font-bold text-foreground">Total Due</span>
                <span className="text-3xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Payment Terms: Net 30 days from invoice date
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
