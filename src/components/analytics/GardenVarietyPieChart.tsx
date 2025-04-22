
import React from "react";
import { motion } from "framer-motion";
import { Flower, TreeDeciduous, Sprout, Leaf } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const agentTypes = [
  { name: "Storytellers", value: 40, icon: TreeDeciduous, color: "#8BC34A" },
  { name: "Performers", value: 25, icon: Flower, color: "#FF9800" },
  { name: "Creators", value: 20, icon: Sprout, color: "#03A9F4" },
  { name: "Guides", value: 15, icon: Leaf, color: "#E91E63" },
];

const COLORS = ["#8BC34A", "#FF9800", "#03A9F4", "#E91E63"];

const GardenVarietyPieChart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <Flower className="h-5 w-5 text-studio-accent" />
        Garden Variety
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={agentTypes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {agentTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, "Proportion"]}
              contentStyle={{ 
                borderRadius: "8px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {agentTypes.map((type, index) => {
          const TypeIcon = type.icon;
          return (
            <div key={type.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{type.name}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GardenVarietyPieChart;
