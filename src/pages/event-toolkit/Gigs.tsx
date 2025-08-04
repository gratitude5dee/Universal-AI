import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  Star,
  Clock,
  Zap,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  BarChart3,
  Music
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const Gigs = () => {
  const navigate = useNavigate();

  const QuickActions = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Zap className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/event-toolkit/gigs/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Plus className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">New Gig</h3>
              <p className="text-blue-lightest/70 text-sm">Schedule performance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">View Calendar</h3>
              <p className="text-blue-lightest/70 text-sm">Schedule overview</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <BarChart3 className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Performance</h3>
              <p className="text-blue-lightest/70 text-sm">View analytics</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Find Venues</h3>
              <p className="text-blue-lightest/70 text-sm">Explore locations</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Gig Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Upcoming Gigs</h3>
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Ready to book</div>
              <div className="text-xs text-blue-lightest/70">Next 30 days</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Total Revenue</h3>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">$0</div>
              <div className="text-sm text-green-400">This month</div>
              <div className="text-xs text-blue-lightest/70">Confirmed bookings</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Venues Played</h3>
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Unique locations</div>
              <div className="text-xs text-blue-lightest/70">All time</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Attendance</h3>
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Total fans</div>
              <div className="text-xs text-blue-lightest/70">All performances</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Gigs</h1>
          </div>
          <p className="text-blue-lightest/70">Manage your upcoming and past performances</p>
        </div>

        <QuickActions />
        <PerformanceMetrics />

        {/* Filters & Content */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Filters */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Search gigs..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Select>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-darker border-white/20">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-darker border-white/20">
                    <SelectItem value="all">All Venues</SelectItem>
                    <SelectItem value="clubs">Clubs</SelectItem>
                    <SelectItem value="festivals">Festivals</SelectItem>
                    <SelectItem value="private">Private Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No gigs scheduled yet</h3>
              <p className="text-blue-lightest/70 mb-6">Start building your performance calendar by adding your first gig</p>
              <Button 
                onClick={() => navigate("/event-toolkit/gigs/create")}
                className="bg-blue-primary hover:bg-blue-primary/80 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Your First Gig
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Gigs;