import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookingAgentLayout from "@/layouts/booking-agent-layout";
import { WorkflowSidebar } from "@/components/touring/WorkflowSidebar";
import { AIAssistantPanel } from "@/components/touring/AIAssistantPanel";
import BookingWorkflowTracker from "@/components/touring/BookingWorkflowTracker";
import { KanbanBoard } from "@/components/touring/KanbanBoard";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailComposer } from "@/components/touring/EmailComposer";
import { ContractGenerator } from "@/components/touring/ContractGenerator";
import { InvoiceGenerator } from "@/components/touring/InvoiceGenerator";
import { EventAssetsGenerator } from "@/components/touring/EventAssetsGenerator";
import { Calendar, DollarSign, MapPin, Clock, Mail, FileText, Image, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Booking {
  id: string;
  venue_name: string;
  venue_location: string;
  venue_city: string;
  venue_state: string;
  venue_contact_email: string;
  event_date: string;
  event_time: string;
  offer_amount: number;
  status: string;
  workflow_stage: string;
  created_at: string;
  notes?: string;
  ai_match_score?: number;
  ai_reasoning?: string;
}

const BookingAgent = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeDialog, setActiveDialog] = useState<"email" | "contract" | "invoice" | "assets" | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('venue_bookings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'venue_bookings'
      }, () => {
        fetchBookings();
      })
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
    } finally {
      setLoading(false);
    }
  };

  const getNextAction = (booking: Booking) => {
    switch (booking.workflow_stage) {
      case "intro": return { label: "Send Offer", action: "email", icon: Mail };
      case "offer": return { label: "Send Contract", action: "contract", icon: FileText };
      case "contract": return { label: "Send Invoice", action: "invoice", icon: DollarSign };
      case "invoice": return { label: "Generate Assets", action: "assets", icon: Image };
      default: return { label: "Contact Venue", action: "email", icon: Mail };
    }
  };

  const handleAction = (booking: Booking, action: string) => {
    setSelectedBooking(booking);
    setActiveDialog(action as any);
  };

  if (loading) {
    return (
      <BookingAgentLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </BookingAgentLayout>
    );
  }

  return (
    <BookingAgentLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar - Workflow Pipeline (hidden in Kanban view) */}
        {viewMode === "list" && (
          <motion.div 
            className="w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WorkflowSidebar
              bookings={bookings}
              selectedStage={selectedStage}
              onStageSelect={setSelectedStage}
              onBookingSelect={(booking) => setSelectedBooking(booking)}
              selectedBookingId={selectedBooking?.id || null}
            />
          </motion.div>
        )}

        {/* Center Workspace */}
        <motion.div 
          className="flex-1 overflow-auto bg-background/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* View Toggle Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {viewMode === "kanban" ? "Booking Pipeline" : "Booking Details"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {viewMode === "kanban" 
                    ? `${bookings.length} total bookings across all stages` 
                    : "Manage your venue bookings"}
                </p>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "kanban")}>
                <TabsList className="glass-card border-white/10 p-1 bg-background/50 backdrop-blur-xl">
                  <TabsTrigger 
                    value="list" 
                    className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kanban" 
                    className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Kanban
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className={viewMode === "kanban" ? "" : "p-6"}>
            {viewMode === "kanban" ? (
              <KanbanBoard 
                bookings={bookings} 
                onSelectBooking={(booking) => {
                  setSelectedBooking(booking);
                  setViewMode("list");
                }}
              />
            ) : selectedBooking ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Workflow Tracker */}
                <BookingWorkflowTracker
                  currentStage={selectedBooking.workflow_stage as "intro" | "offer" | "contract" | "invoice" | "payment"}
                  onStageClick={(stage) => console.log("Stage clicked:", stage)}
                />

                {/* Booking Details Card */}
                <Card className="glass-card border-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
                            {selectedBooking.venue_name}
                          </h2>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedBooking.venue_location}</span>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-lg px-4 py-1">
                          {selectedBooking.status}
                        </Badge>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div 
                          className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                          whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.3)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Calendar className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="text-xs text-muted-foreground">Event Date</p>
                            <p className="text-sm font-semibold text-foreground">
                              {new Date(selectedBooking.event_date).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                          whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.3)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Clock className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-xs text-muted-foreground">Event Time</p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedBooking.event_time}
                            </p>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 backdrop-blur-sm"
                          whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.5)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <DollarSign className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-xs text-green-400/80">Offer Amount</p>
                            <p className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ${selectedBooking.offer_amount.toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        {(() => {
                          const nextAction = getNextAction(selectedBooking);
                          const ActionIcon = nextAction.icon;
                          return (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleAction(selectedBooking, nextAction.action)}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/20"
                              >
                                <ActionIcon className="h-4 w-4" />
                                {nextAction.label}
                              </Button>
                            </motion.div>
                          );
                        })()}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
                          >
                            <Mail className="h-4 w-4" />
                            Send Email
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center justify-center h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/5 max-w-md">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Calendar className="h-16 w-16 text-purple-400/50 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      Select a Booking
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a booking from the pipeline to view details and take action
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right Sidebar - AI Assistant (hidden in Kanban view) */}
        {viewMode === "list" && (
          <motion.div 
            className="w-96 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AIAssistantPanel selectedBooking={selectedBooking} />
          </motion.div>
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
              venueContactEmail: selectedBooking.venue_contact_email
            }}
          />

          <ContractGenerator
            open={activeDialog === "contract"}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            bookingId={selectedBooking.id}
            bookingDetails={{
              venueName: selectedBooking.venue_name,
              venueAddress: selectedBooking.venue_location,
              venueContactEmail: selectedBooking.venue_contact_email,
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
    </BookingAgentLayout>
  );
};

export default BookingAgent;
