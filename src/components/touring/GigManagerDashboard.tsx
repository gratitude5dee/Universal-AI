import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, DollarSign, Clock, AlertCircle, MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StatsCard from "@/components/ui/stats-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, isBefore, addDays } from "date-fns";

interface Gig {
  id: string;
  title: string;
  date: string;
  status: 'confirmed' | 'pending' | 'tentative' | 'cancelled';
  guarantee_amount: number;
  capacity: number;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
}

const GigManagerDashboard = () => {
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);

  // Fetch gigs data
  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          venue:venues(name, city, state)
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate stats
  const nextGig = gigs.find(gig => isAfter(new Date(gig.date), new Date()));
  const upcomingGigs = gigs.filter(gig => 
    isAfter(new Date(gig.date), new Date()) && 
    isBefore(new Date(gig.date), addDays(new Date(), 30))
  );
  
  const monthlyRevenue = gigs
    .filter(gig => {
      const gigDate = new Date(gig.date);
      const now = new Date();
      return gigDate.getMonth() === now.getMonth() && gigDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, gig) => sum + (gig.guarantee_amount || 0), 0);

  const pendingActions = gigs.filter(gig => gig.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'tentative': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSelectGig = (gigId: string) => {
    setSelectedGigs(prev => 
      prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Overview Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Next Gig"
          value={nextGig ? format(new Date(nextGig.date), 'MMM dd') : 'No gigs'}
          description={nextGig ? `${nextGig.venue?.name}, ${nextGig.venue?.city}` : 'Schedule your first show'}
          icon={Calendar}
          delay={0}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          description="This month's earnings"
          icon={DollarSign}
          trend="up"
          trendValue="12%"
          delay={1}
        />
        <StatsCard
          title="Upcoming Shows"
          value={upcomingGigs.length}
          description="Next 30 days"
          icon={Clock}
          delay={2}
        />
        <StatsCard
          title="Pending Actions"
          value={pendingActions}
          description="Require attention"
          icon={AlertCircle}
          delay={3}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gigs List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Upcoming Gigs</CardTitle>
              <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80">
                <Plus className="h-4 w-4 mr-2" />
                New Gig
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {gigs.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No gigs scheduled yet</p>
                  <p className="text-sm">Start by booking your first show</p>
                </div>
              ) : (
                gigs.map((gig) => (
                  <motion.div
                    key={gig.id}
                    whileHover={{ y: -2 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <Checkbox
                      checked={selectedGigs.includes(gig.id)}
                      onCheckedChange={() => handleSelectGig(gig.id)}
                      className="border-white/30 data-[state=checked]:bg-studio-accent"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{gig.title}</h3>
                        <Badge className={getStatusColor(gig.status)}>
                          {gig.status}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">
                        {gig.venue?.name} • {gig.venue?.city}, {gig.venue?.state}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-white/50">
                        <span>{format(new Date(gig.date), 'PPP')}</span>
                        {gig.guarantee_amount && (
                          <span>${gig.guarantee_amount.toLocaleString()}</span>
                        )}
                        {gig.capacity && (
                          <span>{gig.capacity} cap</span>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 border-white/20">
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Panel */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-studio-accent hover:bg-studio-accent/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Book New Gig
              </Button>
              
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                Import Calendar
              </Button>
              
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <DollarSign className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>

              {selectedGigs.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/70 mb-2">
                    {selectedGigs.length} gig(s) selected
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                      Bulk Edit
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                      Export Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GigManagerDashboard;