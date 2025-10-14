import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TaskMetrics {
  completed: number;
  inProgress: number;
  pending: number;
}

interface WorkflowAnalyticsProps {
  taskMetrics: TaskMetrics;
  weeklyActivity: Array<{ day: string; creative: number; business: number; technical: number }>;
  taskDistribution: Array<{ name: string; value: number }>;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const WorkflowAnalytics: React.FC<WorkflowAnalyticsProps> = ({
  taskMetrics,
  weeklyActivity,
  taskDistribution
}) => {
  const totalTasks = taskMetrics.completed + taskMetrics.inProgress + taskMetrics.pending;
  const completionRate = totalTasks > 0 ? Math.round((taskMetrics.completed / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Completed: {taskMetrics.completed}</span>
              <span className="text-muted-foreground">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="font-semibold">{taskMetrics.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending</span>
              <span className="font-semibold">{taskMetrics.pending}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="creative" stroke="#8b5cf6" name="Creative Agents" strokeWidth={2} />
              <Line type="monotone" dataKey="business" stroke="#3b82f6" name="Business Agents" strokeWidth={2} />
              <Line type="monotone" dataKey="technical" stroke="#10b981" name="Technical Agents" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowAnalytics;
