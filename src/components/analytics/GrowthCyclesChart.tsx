
import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { name: "Jan", growth: 4000, sunshine: 2400, water: 2400 },
  { name: "Feb", growth: 3000, sunshine: 1398, water: 2210 },
  { name: "Mar", growth: 2000, sunshine: 9800, water: 2290 },
  { name: "Apr", growth: 2780, sunshine: 3908, water: 2000 },
  { name: "May", growth: 1890, sunshine: 4800, water: 2181 },
  { name: "Jun", growth: 2390, sunshine: 3800, water: 2500 },
  { name: "Jul", growth: 3490, sunshine: 4300, water: 2100 },
];

const GrowthCyclesChart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2 glass-card p-6"
    >
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-studio-accent" />
        Growth Cycles
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {(containerProps) => (
            <AreaChart data={monthlyData} width={containerProps.width} height={containerProps.height}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8BC34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSunshine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#03A9F4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#03A9F4" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "8px", 
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="growth" 
                stroke="#8BC34A" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorGrowth)" 
                name="Growth"
              />
              <Area 
                type="monotone" 
                dataKey="sunshine" 
                stroke="#FF9800" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSunshine)" 
                name="Sunshine"
              />
              <Area 
                type="monotone" 
                dataKey="water" 
                stroke="#03A9F4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorWater)" 
                name="Water"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GrowthCyclesChart;
