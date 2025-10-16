import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { Package, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface BulkOrderDialogProps {
  designImageUrl?: string;
  productTemplateId?: string;
}

export const BulkOrderDialog = ({ designImageUrl, productTemplateId }: BulkOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const [sizes, setSizes] = useState({ S: 20, M: 30, L: 30, XL: 20 });
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { createOrder } = useOrders();

  const unitPrice = 12.99;
  const bulkDiscount = quantity >= 100 ? 0.15 : quantity >= 50 ? 0.10 : 0;
  const discountedPrice = unitPrice * (1 - bulkDiscount);
  const totalCost = discountedPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!designImageUrl) {
      toast({
        title: "Design Required",
        description: "Please generate or select a design first",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder.mutateAsync({
        product_template_id: productTemplateId,
        order_type: 'bulk',
        status: 'pending',
        quantity,
        unit_price: discountedPrice,
        total_cost: totalCost,
        shipping_cost: 0,
        tax_amount: totalCost * 0.1,
        shipping_address: JSON.parse(shippingAddress || '{}'),
        product_details: {
          design_url: designImageUrl,
          sizes,
        },
        notes,
      });

      setOpen(false);
      toast({
        title: "Bulk Order Submitted",
        description: `Your order for ${quantity} units has been placed successfully.`,
      });
    } catch (error) {
      console.error('Bulk order error:', error);
    }
  };

  const handleSizeChange = (size: string, value: number) => {
    setSizes(prev => ({ ...prev, [size]: value }));
    const newTotal = Object.values({ ...sizes, [size]: value }).reduce((sum, val) => sum + val, 0);
    setQuantity(newTotal);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
          <Package className="mr-2 h-4 w-4" />
          Bulk Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl backdrop-blur-md bg-background/95 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Bulk Production Order</DialogTitle>
          <DialogDescription className="text-white/70">
            Order large quantities with volume discounts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size-s" className="text-white">Small (S)</Label>
              <Input
                id="size-s"
                type="number"
                min="0"
                value={sizes.S}
                onChange={(e) => handleSizeChange('S', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size-m" className="text-white">Medium (M)</Label>
              <Input
                id="size-m"
                type="number"
                min="0"
                value={sizes.M}
                onChange={(e) => handleSizeChange('M', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size-l" className="text-white">Large (L)</Label>
              <Input
                id="size-l"
                type="number"
                min="0"
                value={sizes.L}
                onChange={(e) => handleSizeChange('L', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size-xl" className="text-white">X-Large (XL)</Label>
              <Input
                id="size-xl"
                type="number"
                min="0"
                value={sizes.XL}
                onChange={(e) => handleSizeChange('XL', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Total Quantity:</span>
              <span className="text-white font-semibold">{quantity} units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Unit Price:</span>
              <span className="text-white">${discountedPrice.toFixed(2)}</span>
            </div>
            {bulkDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Bulk Discount:</span>
                <span className="text-green-400">-{(bulkDiscount * 100).toFixed(0)}%</span>
              </div>
            )}
            <div className="flex justify-between text-lg border-t border-white/20 pt-2">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-white font-bold">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping" className="text-white">Shipping Address (JSON)</Label>
            <Textarea
              id="shipping"
              placeholder='{"name": "Your Name", "street": "123 Main St", "city": "City", "zip": "12345"}'
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Special Instructions</Label>
            <Textarea
              id="notes"
              placeholder="Add any special requirements or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Button
            type="submit"
            disabled={createOrder.isPending || !designImageUrl}
            className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Submit Bulk Order
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
