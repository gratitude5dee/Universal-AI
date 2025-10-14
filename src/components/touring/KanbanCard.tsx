import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

interface KanbanCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}

export const KanbanCard = ({ booking, onSelect }: KanbanCardProps) => {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
      negotiating: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return statusColors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        interactive
        className="mb-3 cursor-pointer hover:border-primary/50"
        onClick={() => onSelect(booking)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-[hsl(var(--text-primary))] line-clamp-1">
                {booking.venue_name}
              </h4>
              {booking.ai_match_score && (
                <Badge variant="outline" className="shrink-0 text-xs">
                  {Math.round(booking.ai_match_score)}% match
                </Badge>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {booking.venue_city}, {booking.venue_state}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))]">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{format(new Date(booking.event_date), "MMM d, yyyy")}</span>
              <Clock className="h-3.5 w-3.5 shrink-0 ml-1" />
              <span>{booking.event_time}</span>
            </div>

            {/* Offer Amount */}
            <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-primary))]">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-green-500" />
              <span>
                ${(booking.offer_amount / 1000).toFixed(1)}k
              </span>
            </div>

            {/* Status Badge */}
            <div className="pt-1">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
