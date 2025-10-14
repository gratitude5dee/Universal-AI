import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KanbanCard } from "./KanbanCard";
import { LucideIcon } from "lucide-react";

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

interface KanbanColumnProps {
  title: string;
  icon: LucideIcon;
  bookings: Booking[];
  color: string;
  onSelectBooking: (booking: Booking) => void;
}

export const KanbanColumn = ({
  title,
  icon: Icon,
  bookings,
  color,
  onSelectBooking,
}: KanbanColumnProps) => {
  const totalValue = bookings.reduce(
    (sum, b) => sum + b.offer_amount,
    0
  );

  return (
    <Card className="flex flex-col h-full min-w-[320px] glass-card border-white/10 backdrop-blur-xl shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${color} backdrop-blur-sm`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Badge className="text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            ${(totalValue / 1000).toFixed(0)}k
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-4 px-4">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="pr-4">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Icon className="h-8 w-8 text-[hsl(var(--text-tertiary))] mb-2" />
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                  No bookings in this stage
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <KanbanCard
                  key={booking.id}
                  booking={booking}
                  onSelect={onSelectBooking}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
