import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, DollarSign, Clock, AlertCircle, MoreVertical, Copy, Ban, FileText, Download } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StatsCard from "@/components/ui/stats-card";
import { supabase } from "@/integrations/supabase/client";
import { useTouringGigs } from "@/hooks/useTouringWorkspace";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { exportTouringReport, formatMoney } from "@/lib/touring";
import { useToast } from "@/hooks/use-toast";

const GigManagerDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);
  const { data: gigs = [], isLoading } = useTouringGigs();
  const { data: currentUserId } = useCurrentUserId();

  const nextGig = gigs.find((gig) => isAfter(new Date(gig.date), new Date()));
  const upcomingGigs = gigs.filter(
    (gig) => isAfter(new Date(gig.date), new Date()) && isBefore(new Date(gig.date), addDays(new Date(), 30)),
  );
  const monthlyRevenue = gigs
    .filter((gig) => {
      const gigDate = new Date(gig.date);
      const now = new Date();
      return gigDate.getMonth() === now.getMonth() && gigDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, gig) => sum + Number(gig.guarantee_amount ?? 0), 0);
  const pendingActions = gigs.filter((gig) => gig.status === "pending" || gig.status === "tentative").length;

  const refreshTouringQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["gigs"] }),
      queryClient.invalidateQueries({ queryKey: ["touring", "stats"] }),
      queryClient.invalidateQueries({ queryKey: ["touring", "calendar"] }),
      queryClient.invalidateQueries({ queryKey: ["invoices"] }),
    ]);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "tentative":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleSelectGig = (gigId: string) => {
    setSelectedGigs((previous) =>
      previous.includes(gigId) ? previous.filter((id) => id !== gigId) : [...previous, gigId],
    );
  };

  const handleStatusChange = async (gigId: string, status: string) => {
    const { error } = await supabase.from("gigs").update({ status }).eq("id", gigId);
    if (error) {
      toast({ title: "Gig update failed", description: error.message });
      return;
    }

    await supabase
      .from("venue_bookings")
      .update({
        status,
        workflow_stage: status === "confirmed" ? "contract" : status === "cancelled" ? "closed" : "offer",
      } as never)
      .eq("gig_id", gigId);

    await refreshTouringQueries();
    toast({
      title: "Gig updated",
      description: `The gig is now marked as ${status}.`,
    });
  };

  const handleDuplicate = async (gigId: string) => {
    const source = gigs.find((gig) => gig.id === gigId);
    if (!source || !currentUserId) {
      toast({ title: "Unable to duplicate", description: "The gig or current user could not be resolved." });
      return;
    }

    const { error } = await supabase.from("gigs").insert({
      user_id: currentUserId,
      title: `${source.title} (Copy)`,
      date: source.date,
      status: source.status ?? "pending",
      venue_id: source.venue_id ?? null,
      guarantee_amount: source.guarantee_amount ?? 0,
      capacity: source.capacity ?? null,
      contract_url: source.contract_url ?? null,
      notes: source.notes ?? null,
    });

    if (error) {
      toast({ title: "Duplicate failed", description: error.message });
      return;
    }

    await refreshTouringQueries();
    toast({
      title: "Gig duplicated",
      description: "A new copy of the gig has been added to your schedule.",
    });
  };

  const handleExport = async () => {
    try {
      await exportTouringReport();
      toast({
        title: "Touring report exported",
        description: "The current touring report was downloaded as JSON.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "The touring report could not be generated.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Next Gig"
          value={nextGig ? format(new Date(nextGig.date), "MMM dd") : "No gigs"}
          description={nextGig ? `${nextGig.venue?.name ?? "Venue TBD"}, ${nextGig.venue?.city ?? "TBD"}` : "Schedule your next show"}
          icon={Calendar}
          delay={0}
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatMoney(monthlyRevenue)}
          description="Guarantees booked this month"
          icon={DollarSign}
          delay={1}
        />
        <StatsCard title="Upcoming Shows" value={upcomingGigs.length} description="Next 30 days" icon={Clock} delay={2} />
        <StatsCard title="Pending Actions" value={pendingActions} description="Need confirmation or follow-up" icon={AlertCircle} delay={3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Upcoming Gigs</CardTitle>
              <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/gigs/create")}>
                <Plus className="mr-2 h-4 w-4" />
                New Gig
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {gigs.length === 0 ? (
                <div className="py-8 text-center text-white/70">
                  <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No gigs scheduled yet</p>
                  <p className="text-sm">Create your first booking to start the touring workflow.</p>
                </div>
              ) : (
                gigs.map((gig) => (
                  <motion.div
                    key={gig.id}
                    whileHover={{ y: -2 }}
                    className="flex items-center space-x-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
                  >
                    <Checkbox
                      checked={selectedGigs.includes(gig.id)}
                      onCheckedChange={() => handleSelectGig(gig.id)}
                      className="border-white/30 data-[state=checked]:bg-studio-accent"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">{gig.title}</h3>
                        <Badge className={getStatusColor(gig.status)}>{gig.status ?? "pending"}</Badge>
                      </div>
                      <p className="text-sm text-white/70">
                        {gig.venue?.name ?? "Venue TBD"} • {[gig.venue?.city, gig.venue?.state].filter(Boolean).join(", ") || "Location TBD"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                        <span>{format(new Date(gig.date), "PPP p")}</span>
                        <span>{formatMoney(gig.guarantee_amount ?? 0)}</span>
                        {gig.capacity ? <span>{gig.capacity} cap</span> : null}
                        {gig.contract_url ? <span>Contract attached</span> : null}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-white/20 bg-black/90">
                        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => navigate(`/event-toolkit/invoices/create?gigId=${gig.id}`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => handleStatusChange(gig.id, "confirmed")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Mark Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => handleDuplicate(gig.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10" onClick={() => handleStatusChange(gig.id, "cancelled")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Cancel Gig
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-card-glow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-studio-accent text-white hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/gigs/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Book New Gig
              </Button>

              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/touring?tab=calendar")}>
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const targetGigId = selectedGigs[0] ?? nextGig?.id;
                  navigate(targetGigId ? `/event-toolkit/invoices/create?gigId=${targetGigId}` : "/event-toolkit/invoices/create");
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>

              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Touring Report
              </Button>

              {selectedGigs.length > 0 ? (
                <div className="border-t border-white/10 pt-4">
                  <p className="mb-2 text-sm text-white/70">{selectedGigs.length} gig(s) selected</p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => Promise.all(selectedGigs.map((gigId) => handleStatusChange(gigId, "confirmed")))}
                    >
                      Confirm Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        const targetGigId = selectedGigs[0];
                        navigate(`/event-toolkit/invoices/create?gigId=${targetGigId}`);
                      }}
                    >
                      Invoice Selected
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default GigManagerDashboard;
