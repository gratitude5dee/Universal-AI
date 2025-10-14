import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, DollarSign, Mail, FileText, Image, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailComposer } from "./EmailComposer";
import { ContractGenerator } from "./ContractGenerator";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { EventAssetsGenerator } from "./EventAssetsGenerator";

interface Booking {
  id: string;
  venue_name: string;
  venue_location: string;
  event_date: string;
  event_time: string;
  offer_amount: number;
  status: string;
  workflow_stage: string;
  created_at: string;
  notes?: string;
}

type BookingStatus = "pending" | "accepted" | "rejected" | "contracted" | "paid" | "completed";

export const BookingDashboard: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeDialog, setActiveDialog] = useState<"email" | "contract" | "invoice" | "assets" | null>(null);

  useEffect(() => {
    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('venue_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'venue_bookings'
        },
        (payload) => {
          console.log('Booking change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(b => 
              b.id === payload.new.id ? payload.new as Booking : b
            ));
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id));
          }
          
          toast({
            title: "Booking updated",
            description: "Your bookings have been refreshed",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("venue_bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error loading bookings",
        description: "Failed to fetch your bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.venue_location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock, label: "Pending" },
    accepted: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2, label: "Accepted" },
    rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle, label: "Rejected" },
    contracted: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: FileText, label: "Contracted" },
    paid: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: DollarSign, label: "Paid" },
    completed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2, label: "Completed" }
  };

  const getNextAction = (booking: Booking) => {
    switch (booking.workflow_stage) {
      case "offer": return { label: "Follow Up", action: "email", icon: Mail };
      case "negotiation": return { label: "Send Contract", action: "contract", icon: FileText };
      case "contract": return { label: "Send Invoice", action: "invoice", icon: DollarSign };
      case "invoice": return { label: "Generate Assets", action: "assets", icon: Image };
      default: return { label: "Send Email", action: "email", icon: Mail };
    }
  };

  const handleAction = (booking: Booking, action: string) => {
    setSelectedBooking(booking);
    setActiveDialog(action as any);
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    contracted: bookings.filter(b => b.status === "contracted").length,
    revenue: bookings
      .filter(b => b.status === "paid" || b.status === "completed")
      .reduce((sum, b) => sum + b.offer_amount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">{stats.contracted}</div>
            <div className="text-sm text-muted-foreground">Contracted</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-400">${stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
              <TabsList className="bg-background border-border">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="contracted">Contracted</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            const nextAction = getNextAction(booking);
            const ActionIcon = nextAction.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Card className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{booking.venue_name}</h3>
                            <p className="text-sm text-muted-foreground">{booking.venue_location}</p>
                          </div>
                          <Badge className={`${status.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-foreground">
                              {new Date(booking.event_date).toLocaleDateString()} at {booking.event_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-foreground font-semibold">
                              ${booking.offer_amount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {booking.notes && (
                          <p className="text-sm text-muted-foreground italic">{booking.notes}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAction(booking, nextAction.action)}
                          className="flex items-center gap-2"
                        >
                          <ActionIcon className="h-4 w-4" />
                          {nextAction.label}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {selectedBooking && (
        <>
          <EmailComposer
            open={activeDialog === "email"}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            bookingId={selectedBooking.id}
            bookingDetails={{
              venueName: selectedBooking.venue_name,
              venueContactEmail: `contact@${selectedBooking.venue_name.toLowerCase().replace(/\s+/g, '')}.com`
            }}
          />

          <ContractGenerator
            open={activeDialog === "contract"}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            bookingId={selectedBooking.id}
            bookingDetails={{
              venueName: selectedBooking.venue_name,
              venueAddress: selectedBooking.venue_location,
              venueContactEmail: `contact@${selectedBooking.venue_name.toLowerCase().replace(/\s+/g, '')}.com`,
              eventDate: selectedBooking.event_date,
              eventTime: selectedBooking.event_time,
              offerAmount: selectedBooking.offer_amount
            }}
          />

          <InvoiceGenerator
            open={activeDialog === "invoice"}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            bookingId={selectedBooking.id}
            bookingDetails={{
              venueName: selectedBooking.venue_name,
              offerAmount: selectedBooking.offer_amount
            }}
          />

          <EventAssetsGenerator
            open={activeDialog === "assets"}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            bookingId={selectedBooking.id}
            eventDetails={{
              artistName: 'Your Artist Name',
              venueName: selectedBooking.venue_name,
              eventDate: selectedBooking.event_date,
              eventTime: selectedBooking.event_time,
              genre: 'Music'
            }}
          />
        </>
      )}
    </div>
  );
};
