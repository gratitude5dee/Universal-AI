import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

interface SampleOrderDialogProps {
  designId?: string;
  designImageUrl?: string;
  productTemplateId?: string;
  productType?: string;
}

export const SampleOrderDialog: React.FC<SampleOrderDialogProps> = ({
  designId,
  designImageUrl,
  productTemplateId,
  productType = 'hoodie',
}) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('black');
  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('US');
  const [notes, setNotes] = useState('');
  
  const { createOrder } = useOrders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!designImageUrl) {
      return;
    }

    const shippingAddress = {
      name,
      line1: addressLine1,
      line2: addressLine2,
      city,
      state,
      zip: zipCode,
      country,
    };

    const productDetails = {
      type: productType,
      size,
      color,
      designUrl: designImageUrl,
    };

    await createOrder.mutateAsync({
      design_id: designId,
      product_template_id: productTemplateId,
      order_type: 'sample',
      quantity: 1,
      unit_price: 15.00, // Sample pricing
      total_cost: 25.00, // Including shipping
      shipping_cost: 10.00,
      tax_amount: 0,
      shipping_address: shippingAddress,
      product_details: productDetails,
      notes,
      fulfillment_provider: 'printful',
    } as any);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Package className="h-4 w-4 mr-2" />
          Order Sample
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Order Sample Product</DialogTitle>
          <DialogDescription className="text-white/70">
            Get a physical sample before placing bulk orders
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="navy">Navy</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm">Shipping Address</h3>
            
            <div className="space-y-2">
              <Label className="text-white text-sm">Full Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Address Line 1</Label>
              <Input
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="123 Main St"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Address Line 2 (Optional)</Label>
              <Input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apt 4B"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">City</Label>
                <Input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">State</Label>
                <Input
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Zip Code</Label>
                <Input
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Special Instructions (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Pricing Summary */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-sm text-white/80">
              <span>Sample Product</span>
              <span>$15.00</span>
            </div>
            <div className="flex justify-between text-sm text-white/80">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="h-px bg-white/20 my-2" />
            <div className="flex justify-between text-white font-semibold">
              <span>Total</span>
              <span>$25.00</span>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={createOrder.isPending}
            className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Place Sample Order
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};