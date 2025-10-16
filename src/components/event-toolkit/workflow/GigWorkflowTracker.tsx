import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, FileSignature, DollarSign, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GigWorkflowTrackerProps {
  currentStage: "pending" | "confirmed" | "contracted" | "paid" | "completed";
  onStageClick?: (stage: string) => void;
}

export const GigWorkflowTracker: React.FC<GigWorkflowTrackerProps> = ({
  currentStage,
  onStageClick
}) => {
  const stages = [
    { id: "pending", label: "Pending", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    { id: "confirmed", label: "Confirmed", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20" },
    { id: "contracted", label: "Contracted", icon: FileSignature, color: "text-cyan-400", bg: "bg-cyan-500/20" },
    { id: "paid", label: "Paid", icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/20" },
    { id: "completed", label: "Completed", icon: Star, color: "text-purple-400", bg: "bg-purple-500/20" },
  ];

  const currentIndex = stages.findIndex(s => s.id === currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-primary via-cyan-400 to-purple-400"
        />
      </div>

      {/* Stages */}
      <div className="grid grid-cols-5 gap-2">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = stage.id === currentStage;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={stage.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStageClick?.(stage.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer
                transition-all duration-300
                ${isActive ? 'bg-white/10 border-2 border-blue-primary' : 'bg-white/5 border border-white/10 hover:bg-white/8'}
              `}
            >
              <div className={`
                relative p-3 rounded-lg
                ${isActive ? stage.bg : 'bg-white/5'}
              `}>
                <Icon className={`h-5 w-5 ${isActive ? stage.color : 'text-white/50'}`} />
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </div>
              
              <div className="text-center">
                <p className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {stage.label}
                </p>
              </div>

              {isCurrent && (
                <Badge variant="default" className="mt-1 bg-blue-primary/20 text-blue-lightest border-blue-primary/30 text-xs">
                  Current
                </Badge>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
