import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, DollarSign, Calendar, MapPin } from "lucide-react";
import type { SuggestionComponent } from "./types";

interface GenerativeSuggestionProps {
  component: SuggestionComponent;
}

export const GenerativeSuggestion: React.FC<GenerativeSuggestionProps> = ({ component }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'timing': return <Calendar className="h-4 w-4" />;
      case 'alternative': return <MapPin className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pricing': return "bg-green-500/10 border-green-500/30 text-green-400";
      case 'timing': return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case 'alternative': return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      default: return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`flex items-start gap-3 p-3 rounded-lg border backdrop-blur-sm ${getCategoryColor(component.category)}`}
    >
      <div className="mt-0.5">
        {getCategoryIcon(component.category)}
      </div>
      <p className="text-sm flex-1">{component.content}</p>
    </motion.div>
  );
};
