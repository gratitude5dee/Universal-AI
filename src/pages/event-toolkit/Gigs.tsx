import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Plus, 
  Star,
  Zap,
  Users,
  MapPin,
  DollarSign,
  BarChart3,
  Music,
  TrendingUp,
  Mail,
  FileText,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Enhanced Components
import { GigSearchBar } from "@/components/event-toolkit/enhanced-search/GigSearchBar";
import { GigStatusTabs } from "@/components/event-toolkit/workflow/GigStatusTabs";
import { SmartGigCard } from "@/components/event-toolkit/cards/SmartGigCard";
import { GigWorkflowTracker } from "@/components/event-toolkit/workflow/GigWorkflowTracker";
import { VenueMapView } from "@/components/event-toolkit/map/VenueMapView";
import { BulkOperationsModal } from "@/components/event-toolkit/bulk/BulkOperationsModal";
import { BulkActionsBar } from "@/components/event-toolkit/contacts/BulkActionsBar";

const Gigs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [selectedGig, setSelectedGig] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGigs, setSelectedGigs] = useState<Set<string>>(new Set());
  const [bulkOperation, setBulkOperation] = useState<'email' | 'status' | 'contract' | 'invoice' | 'delete' | null>(null);

  // Fetch gigs from database
  const { data: gigs = [], isLoading, refetch } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("gigs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate counts for tabs
  const gigCounts = {
    all: gigs.length,
    upcoming: gigs.filter(g => new Date(g.date) > new Date() && g.status === 'confirmed').length,
    pending: gigs.filter(g => g.status === 'pending').length,
    confirmed: gigs.filter(g => g.status === 'confirmed').length,
    contracted: gigs.filter(g => g.status === 'contracted').length,
    completed: gigs.filter(g => g.status === 'completed').length,
  };

  // Filter gigs based on active tab
  const filteredGigs = gigs.filter(gig => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") {
      return new Date(gig.date) > new Date() && gig.status === 'confirmed';
    }
    return gig.status === activeTab;
  });

  // Handle bulk selection
  const toggleGigSelection = (gigId: string) => {
    const newSelection = new Set(selectedGigs);
    if (newSelection.has(gigId)) {
      newSelection.delete(gigId);
    } else {
      newSelection.add(gigId);
    }
    setSelectedGigs(newSelection);
  };

  const selectAllGigs = () => {
    if (selectedGigs.size === filteredGigs.length) {
      setSelectedGigs(new Set());
    } else {
      setSelectedGigs(new Set(filteredGigs.map(g => g.id)));
    }
  };

  const clearSelection = () => {
    setSelectedGigs(new Set());
  };

  // Handle gig actions
  const handleGigAction = async (action: string, gigId: string) => {
    console.log("Action:", action, "Gig:", gigId);
    
    switch (action) {
      case "confirm":
        await supabase
          .from("gigs")
          .update({ status: "confirmed" })
          .eq("id", gigId);
        refetch();
        toast({
          title: "Gig Confirmed",
          description: "The gig status has been updated to confirmed.",
        });
        break;
      case "edit":
        navigate(`/event-toolkit/gigs/${gigId}/edit`);
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this gig?")) {
          await supabase.from("gigs").delete().eq("id", gigId);
          refetch();
          toast({
            title: "Gig Deleted",
            description: "The gig has been removed from your schedule.",
          });
        }
        break;
      default:
        toast({
          title: "Feature Coming Soon",
          description: `The ${action} feature is currently in development.`,
        });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching:", query);
  };

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
          onClick={() => setShowMap(!showMap)}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Venue Map</h3>
              <p className="text-blue-lightest/70 text-sm">Explore locations</p>
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
              <h3 className="text-white font-medium mb-1">Analytics</h3>
              <p className="text-blue-lightest/70 text-sm">Performance insights</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/event-toolkit/invoices")}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Invoicing</h3>
              <p className="text-blue-lightest/70 text-sm">Track payments</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => {
    const totalRevenue = gigs
      .filter(g => g.guarantee_amount)
      .reduce((sum, g) => sum + (g.guarantee_amount || 0), 0);

    const upcomingCount = gigs.filter(
      g => new Date(g.date) > new Date() && g.status !== 'completed'
    ).length;

    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-5 w-5 text-white mr-2" />
          <h2 className="text-lg font-semibold text-white">Gig Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Upcoming</h3>
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{upcomingCount}</div>
                  <div className="text-sm text-green-400">
                    {upcomingCount > 0 ? 'On schedule' : 'Ready to book'}
                  </div>
                  <div className="text-xs text-blue-lightest/70">Next 30 days</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Total Revenue</h3>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-400">
                    {gigs.length > 0 ? 'From all gigs' : 'No bookings yet'}
                  </div>
                  <div className="text-xs text-blue-lightest/70">Total guaranteed</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Total Gigs</h3>
                  <Music className="h-5 w-5 text-purple-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{gigs.length}</div>
                  <div className="text-sm text-green-400">
                    {gigCounts.completed} completed
                  </div>
                  <div className="text-xs text-blue-lightest/70">All time</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Pipeline</h3>
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">
                    {gigCounts.pending + gigCounts.confirmed}
                  </div>
                  <div className="text-sm text-green-400">Active bookings</div>
                  <div className="text-xs text-blue-lightest/70">
                    {gigCounts.pending} pending
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-white mr-3" />
              <h1 className="text-2xl font-bold text-white">Gig Manager</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedGigs.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkOperation('status')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkOperation('invoice')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoices
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllGigs}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {selectedGigs.size === filteredGigs.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </>
              )}
              <Button
                onClick={() => navigate("/event-toolkit/gigs/create")}
                className="bg-blue-primary hover:bg-blue-primary/80 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Gig
              </Button>
            </div>
          </div>
          <p className="text-blue-lightest/70">Intelligent workflow management for your performances</p>
        </div>

        <QuickActions />
        <PerformanceMetrics />

        {/* Enhanced Search Bar */}
        <GigSearchBar
          onSearch={handleSearch}
          onMapToggle={() => setShowMap(!showMap)}
          showMap={showMap}
          isLoading={isLoading}
        />

        {/* Map View */}
        <AnimatePresence>
          {showMap && (
            <div className="my-6">
              <VenueMapView onClose={() => setShowMap(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Workflow Tracker for Selected Gig */}
        <AnimatePresence>
          {selectedGig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="my-6"
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Booking Progress</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGig(null)}
                      className="text-white/70 hover:text-white"
                    >
                      Close
                    </Button>
                  </div>
                  <GigWorkflowTracker
                    currentStage={
                      gigs.find(g => g.id === selectedGig)?.status as any || "pending"
                    }
                    onStageClick={(stage) => console.log("Clicked stage:", stage)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Tabs & Gigs */}
        <GigStatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={gigCounts}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-md border border-white/10 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-white/5 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map((gig, index) => (
                <div key={gig.id} className="flex gap-2">
                  <Checkbox
                    checked={selectedGigs.has(gig.id)}
                    onCheckedChange={() => toggleGigSelection(gig.id)}
                    className="mt-3 border-white/30 data-[state=checked]:bg-[hsl(var(--accent-blue))] data-[state=checked]:border-[hsl(var(--accent-blue))]"
                  />
                  <div className="flex-1" onClick={() => setSelectedGig(gig.id)}>
                    <SmartGigCard gig={gig} onAction={handleGigAction} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <Music className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No {activeTab !== "all" ? activeTab : ""} gigs found
                </h3>
                <p className="text-blue-lightest/70 mb-6">
                  {gigs.length === 0
                    ? "Start building your performance calendar by adding your first gig"
                    : "Try a different filter or add a new gig"}
                </p>
                <Button
                  onClick={() => navigate("/event-toolkit/gigs/create")}
                  className="bg-blue-primary hover:bg-blue-primary/80 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {gigs.length === 0 ? "Schedule Your First Gig" : "Add New Gig"}
                </Button>
              </CardContent>
            </Card>
          )}
        </GigStatusTabs>

        {/* Bulk Operations Modal */}
        <BulkOperationsModal
          open={bulkOperation !== null}
          onClose={() => setBulkOperation(null)}
          operation={bulkOperation}
          selectedItems={Array.from(selectedGigs).map(id => filteredGigs.find(g => g.id === id)).filter(Boolean)}
          onSuccess={() => {
            clearSelection();
            refetch();
          }}
        />

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedGigs.size}
          onEmailAll={() => setBulkOperation('email')}
          onDeleteAll={() => setBulkOperation('delete')}
          onClearSelection={clearSelection}
        />
      </div>
    </DashboardLayout>
  );
};

export default Gigs;