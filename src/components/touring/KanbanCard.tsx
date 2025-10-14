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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="mb-3 cursor-pointer glass-card border-white/10 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
        onClick={() => onSelect(booking)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent line-clamp-1">
                {booking.venue_name}
              </h4>
              {booking.ai_match_score && (
                <Badge className="shrink-0 text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
                  {Math.round(booking.ai_match_score)}% match
                </Badge>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-purple-400" />
              <span className="line-clamp-1">
                {booking.venue_city}, {booking.venue_state}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span>{format(new Date(booking.event_date), "MMM d, yyyy")}</span>
              <Clock className="h-3.5 w-3.5 shrink-0 ml-1 text-blue-400" />
              <span>{booking.event_time}</span>
            </div>

            {/* Offer Amount */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ${(booking.offer_amount / 1000).toFixed(1)}k
              </span>
            </div>

            {/* Status Badge */}
            <div className="pt-1">
              <Badge className={`${getStatusColor(booking.status)} backdrop-blur-sm`}>
                {booking.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
