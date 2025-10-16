import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, Package, FileText, Calculator, Store, TrendingUp } from 'lucide-react';

export const MerchandiseStudioSummary: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Design Assistant',
      description: 'Generate designs with natural language or structured JSON prompts',
      status: 'complete',
    },
    {
      icon: Package,
      title: 'Design Canvas',
      description: 'Professional design tools with Fabric.js integration',
      status: 'complete',
    },
    {
      icon: Package,
      title: '3D Mockup Lab',
      description: 'Interactive 3D product visualization with multiple angles',
      status: 'complete',
    },
    {
      icon: FileText,
      title: 'Tech Pack Generator',
      description: 'Automated manufacturing documentation with BOM',
      status: 'complete',
    },
    {
      icon: Calculator,
      title: 'Production Calculator',
      description: 'Cost estimation and pricing recommendations',
      status: 'complete',
    },
    {
      icon: Store,
      title: 'Storefront Publisher',
      description: 'Shopify, Etsy, and Printful integrations',
      status: 'complete',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track revenue, orders, and performance metrics',
      status: 'complete',
    },
    {
      icon: Package,
      title: 'Order Management',
      description: 'Sample ordering and order tracking system',
      status: 'complete',
    },
  ];

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/20">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            ✨ Merchandise Studio - Complete Platform
          </h2>
          <p className="text-white/70">
            Professional merchandise creation from design to fulfillment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="w-10 h-10 rounded-lg bg-studio-accent/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-studio-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  {feature.status === 'complete' && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
                <p className="text-white/60 text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold text-sm mb-2">🚀 What's Next?</h3>
          <ul className="space-y-1 text-white/70 text-xs">
            <li>• Connect to Printful/Printify API for live fulfillment</li>
            <li>• Add real payment processing with Stripe</li>
            <li>• Implement A/B testing for designs</li>
            <li>• Build AR try-on experience (WebXR)</li>
            <li>• Add collaborative design features</li>
            <li>• Integrate with more marketplaces (Amazon, WooCommerce)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};