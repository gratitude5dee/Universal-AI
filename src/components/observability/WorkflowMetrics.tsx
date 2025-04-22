
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
        <div className="bg-white p-4 rounded-xl border border-studio-sand/30 flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-xl font-bold">72</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-studio-sand/30 flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">In Progress</p>
            <p className="text-xl font-bold">18</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-studio-sand/30 flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-gray-100">
            <AlertCircle className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold">10</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium mb-3">Weekly Activity</h3>
          <div className="h-64 w-full">
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#8A8A8A" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#8A8A8A" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completedTasks" 
                  name="Completed Tasks"
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pendingTasks" 
                  name="Pending Tasks"
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Task Distribution</h3>
          <div className="h-64 w-full">
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
                  labelLine={false}
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
                    border: "none"
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
