import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Music, Wifi, Users, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeyFeature {
  label: string;
  description?: string;
  icon?: string;
}

interface GenerativeKeyFeaturesProps {
  features: (string | KeyFeature)[];
  delay?: number;
}

const iconMap: Record<string, any> = {
  music: Music,
  wifi: Wifi,
  users: Users,
  zap: Zap,
  star: Star,
  check: CheckCircle,
};

export const GenerativeKeyFeatures: React.FC<GenerativeKeyFeaturesProps> = ({
  features,
  delay = 0
}) => {
  const normalizedFeatures = features.map(f => 
    typeof f === 'string' ? { label: f, icon: 'check' } : f
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h4 className="font-semibold text-foreground">Key Features</h4>
      </div>

      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          {normalizedFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon || 'check'] || CheckCircle;
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: (delay / 1000) + (index * 0.1),
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <Icon className="h-3 w-3 mr-1.5 text-primary" />
                      {feature.label}
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                {feature.description && (
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">{feature.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};
