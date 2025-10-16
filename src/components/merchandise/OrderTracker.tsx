import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';

export const OrderTracker: React.FC = () => {
  const { orders, isLoading } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'printing':
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'processing':
      case 'printing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-white/70">Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Package className="h-8 w-8 text-white/50 mb-2" />
            <p className="text-white/70">No orders yet</p>
            <p className="text-white/50 text-sm">Place your first sample order to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Tracking
        </CardTitle>
        <CardDescription className="text-white/70">
          Monitor your sample and bulk orders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3"
          >
            {/* Order Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                </div>
                <p className="text-white/60 text-xs mt-1">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">${order.total_cost.toFixed(2)}</p>
                <p className="text-white/60 text-xs">{order.quantity} item(s)</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {order.product_details?.type || 'Product'} - {order.order_type}
                </p>
                <p className="text-white/60 text-xs">
                  {order.product_details?.size && `Size: ${order.product_details.size} • `}
                  {order.product_details?.color && `Color: ${order.product_details.color}`}
                </p>
                {order.fulfillment_provider && (
                  <p className="text-white/50 text-xs mt-1">
                    via {order.fulfillment_provider}
                  </p>
                )}
              </div>
            </div>

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="bg-white/5 rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium">Tracking Number</p>
                    <p className="text-white text-sm font-mono">{order.tracking_number}</p>
                  </div>
                  {order.tracking_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(order.tracking_url, '_blank')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                  )}
                </div>
                {order.estimated_delivery && (
                  <p className="text-white/60 text-xs">
                    Est. delivery: {format(new Date(order.estimated_delivery), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            )}

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="text-white/60 text-xs">
                <p className="font-medium text-white/80">Shipping to:</p>
                <p>{order.shipping_address.name}</p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.zip}
                </p>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="text-white/60 text-xs">
                <p className="font-medium text-white/80">Notes:</p>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};