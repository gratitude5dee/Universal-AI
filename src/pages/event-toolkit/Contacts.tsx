import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  UserPlus, 
  Calendar, 
  Mail,
  Phone,
  Star,
  Zap,
  BarChart3,
  TrendingUp,
  MapPin,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const Contacts = () => {
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
          onClick={() => navigate("/event-toolkit/contacts/create")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <UserPlus className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Add Contact</h3>
              <p className="text-blue-lightest/70 text-sm">Network expansion</p>
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
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Send Email</h3>
              <p className="text-blue-lightest/70 text-sm">Bulk outreach</p>
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
                <Building className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Find Venues</h3>
              <p className="text-blue-lightest/70 text-sm">Discover locations</p>
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
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Analytics</h3>
              <p className="text-blue-lightest/70 text-sm">Network insights</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Network Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Total Contacts</h3>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Network size</div>
              <div className="text-xs text-blue-lightest/70">All contacts</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Venues</h3>
              <Building className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Locations</div>
              <div className="text-xs text-blue-lightest/70">Performance venues</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Promoters</h3>
              <UserPlus className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Event organizers</div>
              <div className="text-xs text-blue-lightest/70">Active promoters</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">New This Month</h3>
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-green-400">Growth</div>
              <div className="text-xs text-blue-lightest/70">Network expansion</div>
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
            <h1 className="text-2xl font-bold text-white">Contacts</h1>
          </div>
          <p className="text-blue-lightest/70">Build and manage your professional network</p>
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
                <Input placeholder="Search contacts..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Select>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Contact Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-darker border-white/20">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="venue">Venues</SelectItem>
                    <SelectItem value="promoter">Promoters</SelectItem>
                    <SelectItem value="artist">Artists</SelectItem>
                    <SelectItem value="manager">Managers</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-darker border-white/20">
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No contacts added yet</h3>
              <p className="text-blue-lightest/70 mb-6">Start building your professional network by adding your first contact</p>
              <Button 
                onClick={() => navigate("/event-toolkit/contacts/create")}
                className="bg-blue-primary hover:bg-blue-primary/80 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Contacts;