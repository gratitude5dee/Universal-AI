
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, PartyPopper } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";

const RevenueJourney = () => {
  const [celebrated, setCelebrated] = useState(false);
  
  const revenueData = [
    { month: 'Jun', revenue: 120 },
    { month: 'Jul', revenue: 260 },
    { month: 'Aug', revenue: 180 },
    { month: 'Sep', revenue: 350 },
    { month: 'Oct', revenue: 410 },
    { month: 'Nov', revenue: 490 },
    { month: 'Dec', revenue: 580 },
  ];
  
  const milestones = [
    { value: 250, label: "First $250" },
    { value: 500, label: "Halfway to $1K" },
    { value: 1000, label: "Major milestone: $1K" },
  ];
  
  const celebrateMilestone = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[180px] mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCA" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#D2B48C' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#D2B48C' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
              contentStyle={{ 
                background: 'rgba(255, 248, 240, 0.9)',
                border: '1px solid #E8DCCA',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#D98F64" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#D98F64', strokeWidth: 2, stroke: '#FFF8F0' }}
              activeDot={{ r: 6, fill: '#D98F64', strokeWidth: 2, stroke: '#FFF8F0' }}
            />
            
            {/* Milestone lines */}
            {milestones.map((milestone, index) => (
              <line 
                key={index}
                x1="0%" 
                y1={100 - (milestone.value / 600) * 100 + "%"} 
                x2="100%" 
                y2={100 - (milestone.value / 600) * 100 + "%"} 
                stroke="#D2B48C" 
                strokeWidth={1} 
                strokeDasharray="4 4" 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Milestone markers */}
        {milestones.map((milestone, index) => (
          <div 
            key={index}
            className="absolute right-0 text-xs text-studio-clay flex items-center"
            style={{
              top: `${100 - (milestone.value / 600) * 100}%`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="w-2 h-2 rounded-full bg-studio-clay mr-1"></div>
            {milestone.label}
          </div>
        ))}
        
        {/* Celebration animation */}
        {celebrated && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <PartyPopper className="h-12 w-12 text-studio-accent mb-2" />
              <p className="text-studio-accent font-semibold text-lg">Milestone Reached!</p>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-studio-accent" />
            <span className="font-semibold text-lg">$580</span>
          </div>
          <div className="flex items-center text-xs text-studio-clay gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>18% increase this month</span>
          </div>
        </div>
        
        <motion.button 
          className="text-sm flex items-center gap-1 text-studio-accent"
          whileHover={{ scale: 1.05 }}
          onClick={celebrateMilestone}
        >
          <PartyPopper className="h-4 w-4" />
          Celebrate milestones
        </motion.button>
      </div>
    </div>
  );
};

export default RevenueJourney;
