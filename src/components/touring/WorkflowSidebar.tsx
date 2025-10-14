import React from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkflowStage {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Booking {
  id: string;
  venue_name: string;
  venue_location: string;
  venue_city: string;
  venue_state: string;
  venue_contact_email: string;
  status: string;
  workflow_stage: string;
  offer_amount: number;
  event_date: string;
  event_time: string;
  created_at: string;
  notes?: string;
  ai_match_score?: number;
  ai_reasoning?: string;
}

interface WorkflowSidebarProps {
  bookings: Booking[];
  selectedStage: string | null;
  onStageSelect: (stageId: string) => void;
  onBookingSelect: (booking: Booking) => void;
  selectedBookingId: string | null;
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  bookings,
  selectedStage,
  onStageSelect,
  onBookingSelect,
  selectedBookingId
}) => {
  const stages: WorkflowStage[] = [
    { id: "all", name: "All Bookings", count: bookings.length, icon: TrendingUp, color: "text-foreground" },
    { id: "intro", name: "Initial Contact", count: bookings.filter(b => b.workflow_stage === "intro").length, icon: Clock, color: "text-blue-400" },
    { id: "offer", name: "Offer Sent", count: bookings.filter(b => b.workflow_stage === "offer").length, icon: FileText, color: "text-yellow-400" },
    { id: "contract", name: "Contract Stage", count: bookings.filter(b => b.workflow_stage === "contract").length, icon: FileText, color: "text-orange-400" },
    { id: "invoice", name: "Invoice Sent", count: bookings.filter(b => b.workflow_stage === "invoice").length, icon: DollarSign, color: "text-purple-400" },
    { id: "payment", name: "Payment Received", count: bookings.filter(b => b.workflow_stage === "payment").length, icon: CheckCircle2, color: "text-green-400" },
  ];

  const filteredBookings = selectedStage === "all" || !selectedStage
    ? bookings
    : bookings.filter(b => b.workflow_stage === selectedStage);

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Booking Pipeline</h2>
        <p className="text-xs text-muted-foreground mt-1">Track your deals through each stage</p>
      </div>

      {/* Workflow Stages */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {stages.map((stage) => {
            const StageIcon = stage.icon;
            const isActive = selectedStage === stage.id;
            
            return (
              <motion.button
                key={stage.id}
                onClick={() => onStageSelect(stage.id)}
                className={`w-full text-left transition-all ${
                  isActive 
                    ? 'bg-primary/20 border-primary/50' 
                    : 'bg-background/50 border-border hover:bg-background/80 hover:border-primary/30'
                } border rounded-lg p-3`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StageIcon className={`h-4 w-4 ${stage.color}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.name}
                    </span>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                    {stage.count}
                  </Badge>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Mini Booking List */}
        {selectedStage && (
          <div className="p-3 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
              BOOKINGS IN THIS STAGE
            </h3>
            <div className="space-y-2">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No bookings in this stage</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <motion.button
                    key={booking.id}
                    onClick={() => onBookingSelect(booking)}
                    className={`w-full text-left transition-all ${
                      selectedBookingId === booking.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background/30 border-border hover:bg-background/60'
                    } border rounded-md p-2`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          {booking.venue_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(booking.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-green-400 whitespace-nowrap">
                        ${booking.offer_amount.toLocaleString()}
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Pipeline Stats */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total Pipeline</span>
            <span className="text-sm font-bold text-foreground">
              ${bookings.reduce((sum, b) => sum + b.offer_amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Conversion Rate</span>
            <span className="text-sm font-bold text-green-400">
              {bookings.length > 0 
                ? Math.round((bookings.filter(b => b.workflow_stage === "payment").length / bookings.length) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
