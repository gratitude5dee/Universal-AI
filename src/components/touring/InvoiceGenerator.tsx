import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  label: string;
  amount: string;
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
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { label: 'Venue Rental', amount: bookingDetails.offerAmount?.toString() || '2500' },
    { label: 'Sound & Lighting', amount: '500' },
    { label: 'Staff (4 hours)', amount: '800' }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { label: '', amount: '' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: {
          bookingId,
          lineItems: lineItems.map(item => ({
            label: item.label,
            amount: parseFloat(item.amount) || 0
          }))
        }
      });

      if (error) throw error;

      toast({
        title: "Invoice created!",
        description: `Invoice ${data.invoiceData.invoiceNumber} has been created for ${bookingDetails.venueName}.`,
      });

      onOpenChange(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Create Invoice
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate an invoice for {bookingDetails.venueName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-semibold">Line Items</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addLineItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Description"
                    value={item.label}
                    onChange={(e) => updateLineItem(index, 'label', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) => updateLineItem(index, 'amount', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                {lineItems.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeLineItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Info */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Invoice will be created with a 30-day payment term and saved to the booking record.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading || lineItems.length === 0 || !lineItems.every(item => item.label && item.amount)}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
