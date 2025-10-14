import React from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare, FileSignature, Receipt, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookingWorkflowTrackerProps {
  currentStage: "intro" | "offer" | "contract" | "invoice" | "payment";
  onStageClick?: (stage: string) => void;
}

const BookingWorkflowTracker: React.FC<BookingWorkflowTrackerProps> = ({
  currentStage,
  onStageClick
}) => {
  const stages = [
    { id: "intro", label: "Intro", icon: FileText },
    { id: "offer", label: "Offer", icon: MessageSquare },
    { id: "contract", label: "Contract", icon: FileSignature },
    { id: "invoice", label: "Invoice", icon: Receipt },
    { id: "payment", label: "Payment", icon: CheckCircle },
  ];

  const currentIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-green-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <motion.div
                key={stage.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onStageClick?.(stage.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Icon Circle */}
                <div
                  className={`
                    relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300 border-2
                    ${isCompleted ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' : ''}
                    ${isCurrent ? 'bg-primary border-primary shadow-lg shadow-primary/50 animate-pulse' : ''}
                    ${isPending ? 'bg-muted border-border' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <Icon className={`h-5 w-5 ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p className={`
                    text-sm font-medium transition-colors
                    ${isCompleted ? 'text-green-400' : ''}
                    ${isCurrent ? 'text-primary' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}>
                    {stage.label}
                  </p>
                  
                  {/* Status Badge */}
                  <div className="mt-1">
                    {isCompleted && (
                      <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 text-xs">
                        Complete
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs">
                        In Progress
                      </Badge>
                    )}
                    {isPending && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingWorkflowTracker;
