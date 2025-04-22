
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Coins, Wallet, Receipt } from "lucide-react";

export const RevenueStreams = () => {
  const revenueData = [
    { name: 'Jan', primary: 4000, royalties: 2400, secondary: 1200 },
    { name: 'Feb', primary: 3000, royalties: 1398, secondary: 800 },
    { name: 'Mar', primary: 2000, royalties: 3800, secondary: 1600 },
    { name: 'Apr', primary: 2780, royalties: 3908, secondary: 2000 },
    { name: 'May', primary: 1890, royalties: 4800, secondary: 2100 },
    { name: 'Jun', primary: 2390, royalties: 3800, secondary: 1700 },
    { name: 'Jul', primary: 3490, royalties: 4300, secondary: 2300 },
  ];
  
  const revenueStreams = [
    { name: "Primary Sales", value: "$12,543", change: "+15%", icon: DollarSign, color: "#8B5CF6" },
    { name: "Royalties", value: "$8,721", change: "+24%", icon: Coins, color: "#F97316" },
    { name: "Secondary Market", value: "$3,250", change: "+8%", icon: Wallet, color: "#0EA5E9" },
    { name: "Licensing", value: "$1,810", change: "+12%", icon: Receipt, color: "#10B981" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {revenueStreams.map((stream) => {
          const StreamIcon = stream.icon;
          return (
            <div key={stream.name} className="bg-white p-4 rounded-xl border border-studio-sand/30">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${stream.color}20` }}>
                  <StreamIcon style={{ color: stream.color }} className="h-5 w-5" />
                </div>
                <h3 className="font-medium">{stream.name}</h3>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">{stream.value}</p>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  {stream.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {(containerProps) => (
            <BarChart
              data={revenueData}
              width={containerProps.width}
              height={containerProps.height}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8A8A8A" }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8A8A8A" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, ""]}
                contentStyle={{ 
                  borderRadius: "8px", 
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none"
                }}
              />
              <Legend />
              <Bar dataKey="primary" name="Primary Sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="royalties" name="Royalties" fill="#F97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="secondary" name="Secondary" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
