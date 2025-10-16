import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, FileText, DollarSign, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "DJ Performance", quantity: 1, rate: 500, amount: 500 }
  ]);

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with glassmorphic styling */}
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/event-toolkit/invoices")}
            className="group text-foreground/70 hover:text-foreground transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Invoices
          </Button>
          
          <div className="glass-card p-8 border-white/10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Create Invoice</h1>
                <p className="text-foreground/60 text-lg mt-1">Generate a professional invoice for your performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form className="space-y-6">
              {/* Invoice Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="glass-card p-8 border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-purple))]/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[hsl(var(--accent-purple))]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Invoice Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="client" className="text-foreground/80 font-medium">Client</Label>
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add-new">+ Add New Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gig" className="text-foreground/80 font-medium">Related Gig</Label>
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors">
                          <SelectValue placeholder="Select gig" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No related gig</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-number" className="text-foreground/80 font-medium">Invoice Number</Label>
                      <Input id="invoice-number" placeholder="INV-001" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-date" className="text-foreground/80 font-medium">Issue Date</Label>
                      <Input id="issue-date" type="date" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due-date" className="text-foreground/80 font-medium">Due Date</Label>
                      <Input id="due-date" type="date" className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-purple))]/50 transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Line Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-card p-8 border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-blue))]/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-[hsl(var(--accent-blue))]" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Line Items</h3>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addLineItem}
                      className="border-white/20 hover:bg-white/10 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
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
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((item) => (
                          <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                placeholder="Service description"
                                className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                min="1"
                                className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-blue))]/50 transition-colors"
                              />
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-foreground">${item.amount.toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              {lineItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLineItem(item.id)}
                                  className="hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="glass-card p-8 border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-cyan))]/20 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-[hsl(var(--accent-cyan))]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Additional Notes</h3>
                  </div>
                  <Textarea 
                    placeholder="Payment terms, special instructions, etc."
                    rows={4}
                    className="bg-white/5 border-white/10 focus:border-[hsl(var(--accent-cyan))]/50 transition-colors resize-none"
                  />
                </div>
              </motion.div>
            </form>
          </div>

          {/* Right Column - Summary & Preview */}
          <div className="space-y-6">
            {/* Totals Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-[hsl(var(--accent-purple))]/10 to-[hsl(var(--accent-blue))]/10 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[hsl(var(--accent-purple))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Invoice Summary</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-medium text-foreground text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-foreground/70">Tax (10%)</span>
                    <span className="font-medium text-foreground text-lg">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-[hsl(var(--accent-purple))]/20 to-[hsl(var(--accent-blue))]/20 rounded-lg px-4 mt-4">
                    <span className="text-foreground font-semibold text-lg">Total Amount</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2">Invoice Preview</h4>
                  <div className="space-y-2 text-sm text-foreground/60">
                    <p>• {lineItems.length} line item{lineItems.length !== 1 ? 's' : ''}</p>
                    <p>• Status: Draft</p>
                    <p>• Payment due: On receipt</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <motion.div 
          className="flex gap-4 glass-card p-6 border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))] hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--accent-purple))]/30 px-8"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/event-toolkit/invoices")}
            className="border-white/20 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateInvoice;