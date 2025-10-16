import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Plus, Trash2, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

interface GigInvoiceGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gigId: string;
  gigDetails: {
    title: string;
    guarantee_amount?: number;
  };
}

export const GigInvoiceGenerator: React.FC<GigInvoiceGeneratorProps> = ({
  open,
  onOpenChange,
  gigId,
  gigDetails,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Performance Fee", amount: gigDetails.guarantee_amount || 2500, quantity: 1 },
    { id: "2", description: "Sound & Lighting", amount: 500, quantity: 1 },
  ]);
  const [taxRate, setTaxRate] = useState<number>(0);

  const calculatedTotals = useMemo(() => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total, balanceDue: total };
  }, [lineItems, taxRate]);

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
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "description" ? value : Number(value) || 0,
            }
          : item
      )
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke(
        "generate-invoice",
        {
          body: {
            bookingId: gigId,
            lineItems: lineItems.map((item) => ({
              description: item.description,
              amount: item.amount,
              quantity: item.quantity,
            })),
            taxRate,
          },
        }
      );

      if (error) throw error;
      setInvoice(data);

      toast({
        title: "Invoice Generated!",
        description: `Invoice ${data.invoiceNumber} has been created.`,
      });
    } catch (error: any) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Generation Failed",
        description:
          error.message || "Failed to generate invoice. Please try again.",
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
=======

Invoice Number: ${invoice.invoiceNumber}
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Billed To:
${gigDetails.title}

Line Items:
${invoice.lineItems
  .map(
    (item: any, i: number) =>
      `${i + 1}. ${item.description} - $${item.amount.toFixed(2)} x ${item.quantity || 1}`
  )
  .join("\n")}

Subtotal: $${invoice.totals.subtotal.toFixed(2)}
Tax (${taxRate}%): $${invoice.totals.tax.toFixed(2)}
Total: $${invoice.totals.total.toFixed(2)}
Balance Due: $${invoice.totals.balanceDue.toFixed(2)}
    `.trim();

    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Invoice saved to your downloads folder",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-blue-darker border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Receipt className="h-5 w-5 text-green-400" />
            Invoice Generator
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Create a professional invoice for {gigDetails.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!invoice ? (
            <>
              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white font-semibold">Line Items</Label>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateLineItem(item.id, "amount", e.target.value)
                      }
                      placeholder="Amount"
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(item.id, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      onClick={() => removeLineItem(item.id)}
                      size="icon"
                      variant="ghost"
                      disabled={lineItems.length === 1}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Tax Rate */}
              <div className="space-y-2">
                <Label className="text-white">Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              {/* Totals */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal:</span>
                  <span className="text-white">
                    ${calculatedTotals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax ({taxRate}%):</span>
                  <span className="text-white">
                    ${calculatedTotals.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                  <span>Total:</span>
                  <span>${calculatedTotals.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Receipt className="h-5 w-5 mr-2" />
                    Generate Invoice
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Invoice Summary */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <div className="text-center pb-4 border-b border-white/10">
                  <h3 className="text-2xl font-bold text-white">
                    Invoice {invoice.invoiceNumber}
                  </h3>
                  <p className="text-white/70 mt-1">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  {invoice.lineItems.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between text-white/70"
                    >
                      <span>
                        {item.description} × {item.quantity || 1}
                      </span>
                      <span className="text-white">
                        ${(item.amount * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal:</span>
                    <span className="text-white">
                      ${invoice.totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax:</span>
                    <span className="text-white">
                      ${invoice.totals.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Due:</span>
                    <span>${invoice.totals.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={downloadInvoice}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button
                  onClick={() => setInvoice(null)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Create Another
                </Button>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
