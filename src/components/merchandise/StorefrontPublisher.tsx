import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Store, ExternalLink, ShoppingBag, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StorefrontPublisherProps {
  designId?: string;
  designImageUrl?: string;
  productName?: string;
}

export const StorefrontPublisher: React.FC<StorefrontPublisherProps> = ({
  designId,
  designImageUrl,
  productName = 'Untitled Product',
}) => {
  const [title, setTitle] = useState(productName);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('29.99');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [etsyConnected, setEtsyConnected] = useState(false);
  const [printfulConnected, setPrintfulConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectShopify = () => {
    toast({
      title: 'Connect Shopify',
      description: 'Shopify integration will open in a new window.',
    });
  };

  const handleConnectEtsy = () => {
    toast({
      title: 'Connect Etsy',
      description: 'Etsy integration will open in a new window.',
    });
  };

  const handleConnectPrintful = () => {
    toast({
      title: 'Connect Printful',
      description: 'Printful integration will open in a new window.',
    });
  };

  const handlePublish = () => {
    if (!designImageUrl) {
      toast({
        title: 'No design available',
        description: 'Please create a design first',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Publishing product...',
      description: 'Your product is being published to connected stores.',
    });
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Store className="h-5 w-5" />
          Storefront Publisher
        </CardTitle>
        <CardDescription className="text-white/70">
          Launch your products to online marketplaces
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm">Product Information</h3>
          
          <div className="space-y-2">
            <Label className="text-white text-sm">Product Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Vintage Band Hoodie"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Price ($)</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Available Sizes</Label>
              <div className="flex gap-2 flex-wrap pt-2">
                {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <Badge
                    key={size}
                    variant={sizes.includes(size) ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      sizes.includes(size)
                        ? 'bg-studio-accent hover:bg-studio-accent/90'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    onClick={() => {
                      setSizes(
                        sizes.includes(size)
                          ? sizes.filter((s) => s !== size)
                          : [...sizes, size]
                      );
                    }}
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Stores */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm">Connected Stores</h3>

          {/* Shopify */}
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#96bf48] rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Shopify</p>
                <p className="text-white/60 text-xs">
                  {shopifyConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectShopify}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {shopifyConnected ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Manage
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>

          {/* Etsy */}
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f1641e] rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Etsy</p>
                <p className="text-white/60 text-xs">
                  {etsyConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectEtsy}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {etsyConnected ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Manage
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>

          {/* Printful */}
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#e74c3c] rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Printful</p>
                <p className="text-white/60 text-xs">
                  {printfulConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectPrintful}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {printfulConnected ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Manage
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </div>

        {/* Publish Actions */}
        <div className="space-y-3">
          <Button
            onClick={handlePublish}
            disabled={!designImageUrl}
            className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
          >
            Publish to All Connected Stores
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Save Draft
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Preview Listing
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/70 text-xs">
            💡 <strong>Tip:</strong> Products will automatically sync inventory and orders
            across all connected platforms. Make sure to set competitive pricing based on
            your production costs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};