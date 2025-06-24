import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ListChecks, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const WorkflowMetrics = () => {
  const activityData = [
    { day: 'Mon', completedTasks: 12, pendingTasks: 5 },
    { day: 'Tue', completedTasks: 19, pendingTasks: 8 },
    { day: 'Wed', completedTasks: 15, pendingTasks: 9 },
    { day: 'Thu', completedTasks: 21, pendingTasks: 12 },
    { day: 'Fri', completedTasks: 24, pendingTasks: 7 },
    { day: 'Sat', completedTasks: 18, pendingTasks: 5 },
    { day: 'Sun', completedTasks: 14, pendingTasks: 3 },
  ];

  const pieData = [
    { name: 'Completed', value: 72, color: '#10B981' },
    { name: 'In Progress', value: 18, color: '#F59E0B' },
    { name: 'Pending', value: 10, color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-white/70 text-shadow-sm">Completed</p>
            <p className="text-xl font-bold text-white text-shadow-sm">72</p>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-amber-500/20">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-white/70 text-shadow-sm">In Progress</p>
            <p className="text-xl font-bold text-white text-shadow-sm">18</p>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-gray-500/20">
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-xs text-white/70 text-shadow-sm">Pending</p>
            <p className="text-xl font-bold text-white text-shadow-sm">10</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium mb-3 text-white text-shadow-sm">Weekly Activity</h3>
          <div className="h-64 w-full backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" opacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#FFFFFF" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#FFFFFF" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(10px)",
                    color: "#FFFFFF"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completedTasks" 
                  name="Completed Tasks"
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "#10B981", strokeWidth: 1, stroke: "#FFFFFF" }} 
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#FFFFFF" }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pendingTasks" 
                  name="Pending Tasks"
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "#F59E0B", strokeWidth: 1, stroke: "#FFFFFF" }} 
                  activeDot={{ r: 6, fill: "#F59E0B", stroke: "#FFFFFF" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3 text-white text-shadow-sm">Task Distribution</h3>
          <div className="h-64 w-full backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20 shadow-card-glow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "rgba(255, 255, 255, 0.3)", strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tasks`, ""]}
                  contentStyle={{ 
                    borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(10px)",
                    color: "#FFFFFF"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowMetrics;