import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, MoreVertical, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Booking {
  id: string;
  artistName: string;
  venueName: string;
  location: string;
  date: string;
  price: string;
  status: "new" | "negotiating" | "accepted" | "contracted" | "paid";
  workflowSteps: {
    intro: boolean;
    offer: boolean;
    contract: boolean;
    invoice: boolean;
    payment: boolean;
  };
}

interface BookingTableViewProps {
  bookings: Booking[];
  onAction: (action: string, bookingId: string) => void;
}

const BookingTableView: React.FC<BookingTableViewProps> = ({ bookings, onAction }) => {
  const statusConfig = {
    new: { color: "bg-gray-500/20 text-gray-300 border-gray-500/30", label: "New" },
    negotiating: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Negotiating" },
    accepted: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Accepted" },
    contracted: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Contracted" },
    paid: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Paid" },
  };

  const WorkflowIndicator = ({ steps }: { steps: Booking['workflowSteps'] }) => {
    const stepList = [
      { key: 'intro', label: 'Intro' },
      { key: 'offer', label: 'Offer' },
      { key: 'contract', label: 'Contract' },
      { key: 'invoice', label: 'Invoice' },
      { key: 'payment', label: 'Payment' },
    ];

    return (
      <div className="flex items-center gap-1">
        {stepList.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div
              className={`w-2 h-2 rounded-full ${
                steps[step.key as keyof typeof steps]
                  ? 'bg-green-500'
                  : 'bg-muted-foreground/30'
              }`}
              title={step.label}
            />
            {idx < stepList.length - 1 && (
              <div className={`w-4 h-0.5 ${
                steps[stepList[idx + 1].key as keyof typeof steps]
                  ? 'bg-green-500'
                  : 'bg-muted-foreground/20'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">Artist / Venue</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Location</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Price</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Workflow</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, index) => (
            <motion.tr
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-border hover:bg-accent/50 transition-colors"
            >
              <TableCell>
                <div>
                  <div className="font-semibold text-foreground">{booking.artistName}</div>
                  <div className="text-sm text-muted-foreground">{booking.venueName}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {booking.location}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {booking.date}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  {booking.price}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${statusConfig[booking.status].color} border font-medium`}>
                  {statusConfig[booking.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <WorkflowIndicator steps={booking.workflowSteps} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAction('view', booking.id)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    View
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="hover:bg-accent">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem onClick={() => onAction('edit', booking.id)}>
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction('duplicate', booking.id)}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction('archive', booking.id)} className="text-destructive">
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingTableView;
