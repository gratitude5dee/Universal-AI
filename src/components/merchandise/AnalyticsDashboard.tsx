import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Package, Eye, ShoppingCart } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  // Mock data - in production, this would come from your analytics API
  const stats = {
    totalRevenue: 12450.00,
    revenueChange: 23.5,
    totalOrders: 89,
    ordersChange: 12.3,
    totalViews: 3542,
    viewsChange: 45.2,
    conversionRate: 2.5,
    conversionChange: 0.8,
    topProducts: [
      { name: 'Vintage Band Hoodie', sales: 45, revenue: 1575.00 },
      { name: 'Retro T-Shirt', sales: 38, revenue: 912.00 },
      { name: 'Abstract Poster', sales: 24, revenue: 432.00 },
    ],
    recentOrders: [
      { id: 'ORD-1234', product: 'Vintage Band Hoodie', amount: 35.00, status: 'shipped' },
      { id: 'ORD-1233', product: 'Retro T-Shirt', amount: 24.00, status: 'processing' },
      { id: 'ORD-1232', product: 'Abstract Poster', amount: 18.00, status: 'delivered' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-400 mt-1">
              +{stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-400" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-blue-400 mt-1">
              +{stats.ordersChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-400" />
              Product Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-purple-400 mt-1">
              +{stats.viewsChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-orange-400 mt-1">
              +{stats.conversionChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
          <CardDescription className="text-white/70">
            Best performing products this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{product.name}</p>
                    <p className="text-white/60 text-xs">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${product.revenue.toFixed(2)}</p>
                  <p className="text-white/60 text-xs">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="backdrop-blur-md bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription className="text-white/70">
            Latest customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium text-sm">{order.id}</p>
                  <p className="text-white/60 text-xs">{order.product}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold">${order.amount.toFixed(2)}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'shipped'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};