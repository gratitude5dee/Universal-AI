import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Mail,
  FileText,
  MoreVertical,
  CheckCircle,
  Edit,
  Trash2,
  Receipt,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GigEmailComposer } from "../generators/GigEmailComposer";
import { GigContractGenerator } from "../generators/GigContractGenerator";
import { GigInvoiceGenerator } from "../generators/GigInvoiceGenerator";

interface SmartGigCardProps {
  gig: {
    id: string;
    title: string;
    venue_id?: string;
    date: string;
    status: string;
    capacity?: number;
    guarantee_amount?: number;
    notes?: string;
  };
  onAction: (action: string, gigId: string) => void;
}

export const SmartGigCard: React.FC<SmartGigCardProps> = ({ gig, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [contractGeneratorOpen, setContractGeneratorOpen] = useState(false);
  const [invoiceGeneratorOpen, setInvoiceGeneratorOpen] = useState(false);

  const statusConfig = {
    pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending", icon: Clock },
    confirmed: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Confirmed", icon: CheckCircle },
    contracted: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", label: "Contracted", icon: FileText },
    completed: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Completed", icon: CheckCircle },
  };

  const config = statusConfig[gig.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleLocalAction = (action: string) => {
    switch (action) {
      case "email":
        setEmailComposerOpen(true);
        break;
      case "contract":
        setContractGeneratorOpen(true);
        break;
      case "invoice":
        setInvoiceGeneratorOpen(true);
        break;
      default:
        onAction(action, gig.id);
    }
  };

  const getQuickActions = () => {
    switch (gig.status) {
      case "pending":
        return [
          { label: "Confirm Gig", icon: CheckCircle, action: "confirm" },
          { label: "Send Email", icon: Mail, action: "email" },
        ];
      case "confirmed":
        return [
          { label: "Generate Contract", icon: FileText, action: "contract" },
          { label: "Send Email", icon: Mail, action: "email" },
        ];
      case "contracted":
        return [
          { label: "Create Invoice", icon: Receipt, action: "invoice" },
          { label: "Send Email", icon: Mail, action: "email" },
        ];
      case "completed":
        return [
          { label: "View Details", icon: FileText, action: "viewDetails" },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-primary/50 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-lightest transition-colors">
                {gig.title}
              </h3>
              <Badge variant="outline" className={`${config.color} text-xs`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-blue-darker border-white/20">
                <DropdownMenuItem 
                  onClick={() => onAction("edit", gig.id)}
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Gig
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => onAction("delete", gig.id)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Gig
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-white/70">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-sm">{new Date(gig.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>

            {gig.capacity && (
              <div className="flex items-center text-white/70">
                <Users className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-sm">Capacity: {gig.capacity}</span>
              </div>
            )}

            {gig.guarantee_amount && (
              <div className="flex items-center text-white/70">
                <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-sm font-medium">${gig.guarantee_amount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLocalAction(action.action)}
                    className="flex-1 border-white/20 text-white/80 hover:bg-blue-primary/20 hover:text-white hover:border-blue-primary/50"
                  >
                    <ActionIcon className="h-3 w-3 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Generation Modals */}
      <GigEmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        gigId={gig.id}
        gigDetails={gig}
      />

      <GigContractGenerator
        open={contractGeneratorOpen}
        onOpenChange={setContractGeneratorOpen}
        gigId={gig.id}
        gigDetails={gig}
      />

      <GigInvoiceGenerator
        open={invoiceGeneratorOpen}
        onOpenChange={setInvoiceGeneratorOpen}
        gigId={gig.id}
        gigDetails={gig}
      />
    </motion.div>
  );
};