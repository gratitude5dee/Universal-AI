
import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Droplets, Wind, Leaf } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine
} from "recharts";

export const ResourceCycles = () => {
  const hourlyData = [
    { time: "00:00", cpu: 12, memory: 45, network: 10, disk: 30 },
    { time: "04:00", cpu: 8, memory: 40, network: 5, disk: 30 },
    { time: "08:00", cpu: 25, memory: 55, network: 30, disk: 32 },
    { time: "12:00", cpu: 60, memory: 70, network: 50, disk: 35 },
    { time: "16:00", cpu: 85, memory: 80, network: 65, disk: 40 },
    { time: "20:00", cpu: 40, memory: 60, network: 30, disk: 38 },
    { time: "24:00", cpu: 15, memory: 50, network: 12, disk: 30 },
  ];

  const dailyData = [
    { day: "Mon", sunshine: 70, rainfall: 10, harvest: 50 },
    { day: "Tue", sunshine: 65, rainfall: 5, harvest: 60 },
    { day: "Wed", sunshine: 50, rainfall: 40, harvest: 40 },
    { day: "Thu", sunshine: 80, rainfall: 0, harvest: 70 },
    { day: "Fri", sunshine: 75, rainfall: 5, harvest: 80 },
    { day: "Sat", sunshine: 60, rainfall: 30, harvest: 55 },
    { day: "Sun", sunshine: 90, rainfall: 0, harvest: 65 },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Leaf className="h-5 w-5 text-studio-accent" />
          <h2 className="text-xl font-medium">Natural Resource Cycles</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Your system resources follow natural patterns, just like the cycles of day and night,
          growth and rest. Monitor the ebb and flow of your digital ecosystem.
        </p>
        
        <div className="h-[300px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB766" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFB766" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884D8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884D8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "8px", 
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none"
                }}
                formatter={(value) => [`${value}%`, ""]}
              />
              
              <ReferenceLine 
                y={75} 
                stroke="#FF9800" 
                strokeDasharray="3 3"
                label={{ value: "High", position: "right", fill: "#FF9800" }}
              />
              
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#FFB766" 
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                name="CPU (Sunshine)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="#8884D8" 
                fillOpacity={1} 
                fill="url(#colorMemory)" 
                name="Memory (Moonlight)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResourceCard 
            title="CPU" 
            value="32%" 
            icon={Sun} 
            description="Sunshine Energy"
            trend="down"
          />
          <ResourceCard 
            title="Memory" 
            value="58%" 
            icon={Moon} 
            description="Moonlight Essence"
            trend="stable"
          />
          <ResourceCard 
            title="Network" 
            value="24.6 MB/s" 
            icon={Wind} 
            description="Wind Currents"
            trend="up"
          />
          <ResourceCard 
            title="Disk" 
            value="35%" 
            icon={Droplets} 
            description="Water Reserves"
            trend="stable"
          />
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Weekly Harvest Cycle</h2>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "8px", 
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none"
                }}
                formatter={(value) => [`${value}%`, ""]}
              />
              <Line 
                type="monotone" 
                dataKey="sunshine" 
                stroke="#FFB766" 
                strokeWidth={2}
                dot={{ stroke: '#FFB766', strokeWidth: 2, r: 4, fill: '#fff' }}
                activeDot={{ r: 6 }}
                name="Sunshine"
              />
              <Line 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#54B4D3" 
                strokeWidth={2}
                dot={{ stroke: '#54B4D3', strokeWidth: 2, r: 4, fill: '#fff' }}
                activeDot={{ r: 6 }}
                name="Rainfall"
              />
              <Line 
                type="monotone" 
                dataKey="harvest" 
                stroke="#4CAF50" 
                strokeWidth={2}
                dot={{ stroke: '#4CAF50', strokeWidth: 2, r: 4, fill: '#fff' }}
                activeDot={{ r: 6 }}
                name="Harvest"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFB766]"></div>
            <span className="text-sm">Sunshine (CPU)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#54B4D3]"></div>
            <span className="text-sm">Rainfall (Memory)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
            <span className="text-sm">Harvest (Throughput)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ title, value, icon: Icon, description, trend }: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  trend: "up" | "down" | "stable";
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      case "stable": return "→";
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-amber-500";
      case "down": return "text-green-500";
      case "stable": return "text-blue-500";
    }
  };
  
  return (
    <div className="bg-white/80 p-4 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-studio-accent" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className={`text-xs ${getTrendColor()}`}>{getTrendIcon()}</span>
      </div>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};
