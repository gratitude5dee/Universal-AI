import { KanbanColumn } from "./KanbanColumn";
import { Mail, FileText, FileCheck, Receipt, CheckCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

interface KanbanBoardProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

const workflowStages = [
  {
    id: "intro",
    name: "Initial Contact",
    icon: Mail,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "offer",
    name: "Offer Sent",
    icon: FileText,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "contract",
    name: "Contract",
    icon: FileCheck,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "invoice",
    name: "Invoice",
    icon: Receipt,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "payment",
    name: "Payment",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-500",
  },
];

export const KanbanBoard = ({ bookings, onSelectBooking }: KanbanBoardProps) => {
  const getBookingsByStage = (stageId: string) => {
    return bookings.filter((b) => b.workflow_stage === stageId);
  };

  return (
    <div className="h-full">
      <ScrollArea className="w-full">
        <div className="flex gap-4 p-6 min-h-[calc(100vh-200px)]">
          {workflowStages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              title={stage.name}
              icon={stage.icon}
              bookings={getBookingsByStage(stage.id)}
              color={stage.color}
              onSelectBooking={onSelectBooking}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
