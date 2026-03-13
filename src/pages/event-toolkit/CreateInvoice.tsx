import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, FileText, DollarSign } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTouringGigs } from "@/hooks/useTouringWorkspace";
import { formatMoney, recordInvoicePayment } from "@/lib/touring";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

function createInvoiceNumber() {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`;
}

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { data: gigs = [] } = useTouringGigs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gigId, setGigId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(createInvoiceNumber());
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("10");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Performance Fee", quantity: 1, rate: 0, amount: 0 },
  ]);

  const selectedGig = gigs.find((gig) => gig.id === gigId);

  useEffect(() => {
    const queryGigId = searchParams.get("gigId");
    if (queryGigId) {
      setGigId(queryGigId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedGig) {
      return;
    }

    setLineItems((current) => {
      if (current.length !== 1 || current[0].description !== "Performance Fee" || current[0].rate !== 0) {
        return current;
      }
      const guarantee = Number(selectedGig.guarantee_amount ?? 0);
      return [
        {
          id: current[0].id,
          description: `${selectedGig.title} performance`,
          quantity: 1,
          rate: guarantee,
          amount: guarantee,
        },
      ];
    });
  }, [selectedGig]);

  const subtotal = useMemo(() => lineItems.reduce((sum, item) => sum + item.amount, 0), [lineItems]);
  const taxAmount = useMemo(() => subtotal * (Number(taxRate || 0) / 100), [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const addLineItem = () => {
    setLineItems((current) => [
      ...current,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems((current) => current.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!gigId) {
      toast({
        title: "Missing gig",
        description: "Select a gig before creating an invoice.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        throw authError;
      }
      if (!user) {
        throw new Error("Authentication is required.");
      }

      const invoiceInsert = {
        user_id: user.id,
        gig_id: gigId,
        invoice_number: invoiceNumber.trim() || createInvoiceNumber(),
        amount: total,
        balance_due: status === "paid" ? 0 : total,
        due_date: dueDate || null,
        status,
        currency,
        tax_amount: taxAmount,
        line_items: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        notes: notes.trim() || null,
      };

      const { data: invoice, error: invoiceError } = await supabase.from("invoices").insert(invoiceInsert).select("id").single();
      if (invoiceError || !invoice) {
        throw invoiceError ?? new Error("The invoice could not be created.");
      }

      await supabase.from("venue_bookings").update({ invoice_id: invoice.id } as never).eq("gig_id", gigId);

      const existingSettlement = await supabase
        .from("gig_settlements")
        .select("id")
        .eq("creator_id", user.id)
        .eq("gig_id", gigId)
        .limit(1)
        .maybeSingle();

      if (existingSettlement.data?.id) {
        await supabase
          .from("gig_settlements")
          .update({
            invoice_id: invoice.id,
            gross_amount: total,
            net_amount: total,
            metadata: { source: "create_invoice_form" },
          })
          .eq("id", existingSettlement.data.id);
      } else {
        await supabase.from("gig_settlements").insert({
          creator_id: user.id,
          gig_id: gigId,
          invoice_id: invoice.id,
          gross_amount: total,
          expenses_amount: 0,
          net_amount: total,
          status: "draft",
          metadata: { source: "create_invoice_form" },
        });
      }

      if (status === "paid") {
        await recordInvoicePayment({
          creatorId: user.id,
          invoiceId: invoice.id,
          amount: total,
          paymentMethod: "manual",
          metadata: { source: "create_invoice_form" },
        });
      }

      toast({
        title: "Invoice created",
        description: "The invoice and touring settlement records were saved successfully.",
      });
      navigate("/event-toolkit/invoices");
    } catch (error) {
      toast({
        title: "Invoice creation failed",
        description: error instanceof Error ? error.message : "The invoice could not be created.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div className="mx-auto max-w-6xl space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/event-toolkit/invoices")} className="text-foreground/70 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Create Invoice</h1>
            <p className="text-foreground/60">This creates the invoice and updates the linked booking and settlement records.</p>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-6 lg:grid-cols-3" onSubmit={handleSubmit}>
          <div className="space-y-6 lg:col-span-2">
            <Card className="glass-card border-white/10 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-[hsl(var(--accent-purple))]/20 p-2">
                  <FileText className="h-5 w-5 text-[hsl(var(--accent-purple))]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Invoice Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gig">Related Gig</Label>
                  <Select value={gigId} onValueChange={setGigId}>
                    <SelectTrigger id="gig" className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select gig" />
                    </SelectTrigger>
                    <SelectContent>
                      {gigs.map((gig) => (
                        <SelectItem key={gig.id} value={gig.id}>
                          {gig.title} • {gig.venue?.name ?? "Venue TBD"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input id="invoice-number" value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} className="bg-white/5 border-white/10" />
                </div>
              </div>
            </Card>

            <Card className="glass-card border-white/10 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[hsl(var(--accent-blue))]/20 p-2">
                    <DollarSign className="h-5 w-5 text-[hsl(var(--accent-blue))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Line Items</h3>
                </div>
                <Button type="button" variant="outline" onClick={addLineItem} className="border-white/20 hover:bg-white/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-foreground/80">Description</TableHead>
                      <TableHead className="w-24 text-foreground/80">Quantity</TableHead>
                      <TableHead className="w-32 text-foreground/80">Rate</TableHead>
                      <TableHead className="w-32 text-foreground/80">Amount</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(event) => updateLineItem(item.id, "description", event.target.value)}
                            placeholder="Service description"
                            className="bg-white/5 border-white/10"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => updateLineItem(item.id, "quantity", Number(event.target.value) || 0)}
                            className="bg-white/5 border-white/10"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(event) => updateLineItem(item.id, "rate", Number(event.target.value) || 0)}
                            className="bg-white/5 border-white/10"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">{formatMoney(item.amount, currency)}</span>
                        </TableCell>
                        <TableCell>
                          {lineItems.length > 1 ? (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(item.id)} className="hover:bg-red-500/10 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="glass-card border-white/10 p-8">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Notes</h3>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Payment terms, routing references, licensing notes, or delivery instructions..." className="bg-white/5 border-white/10 resize-none" />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card border-white/10 p-8">
              <h3 className="mb-6 text-lg font-semibold text-foreground">Invoice Summary</h3>
              <div className="space-y-3 text-sm text-foreground/70">
                <div className="flex items-center justify-between">
                  <span>Gig</span>
                  <span className="text-right text-foreground">{selectedGig?.title ?? "Not selected"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="text-foreground">{formatMoney(taxAmount, currency)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatMoney(total, currency)}</span>
                  </div>
                </div>
                <p className="pt-4 text-xs text-foreground/50">
                  If you mark this invoice as paid, an `invoice_payments` entry will be created immediately and rollups will update.
                </p>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/event-toolkit/invoices")}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateInvoice;
