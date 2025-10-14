import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Edit2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { FilterComponent } from "./types";

interface GenerativeFilterBadgeProps {
  component: FilterComponent;
  onRemove?: (filterId: string) => void;
  onEdit?: (filterId: string, newValue: any) => void;
}

export const GenerativeFilterBadge: React.FC<GenerativeFilterBadgeProps> = ({ 
  component, 
  onRemove, 
  onEdit 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    typeof component.value === 'object' 
      ? `${component.value.min}-${component.value.max}` 
      : component.value
  );

  const getFilterIcon = (filterType: string) => {
    const icons: Record<string, string> = {
      location: "📍",
      capacity: "👥",
      genre: "🎵",
      date: "📅",
      price: "💰",
      amenities: "✨"
    };
    return icons[filterType] || "🔖";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "border-green-500/40 bg-green-500/10";
    if (confidence >= 0.75) return "border-yellow-500/40 bg-yellow-500/10";
    return "border-orange-500/40 bg-orange-500/10";
  };

  const handleSave = () => {
    onEdit?.(component.id, editValue);
    setIsEditing(false);
  };

  const formatValue = (value: any) => {
    if (typeof value === 'object' && value.min && value.max) {
      return `${value.min}-${value.max}`;
    }
    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {isEditing ? (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-sm">{getFilterIcon(component.filter)}</span>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 w-32 bg-white/10 border-white/20 text-white text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <button
            onClick={handleSave}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <Check className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <Badge 
          className={`px-3 py-1.5 text-sm font-medium border ${getConfidenceColor(component.confidence)} text-white cursor-pointer group relative`}
          onClick={() => setIsEditing(true)}
        >
          <span className="mr-1">{getFilterIcon(component.filter)}</span>
          <span className="mr-2">{formatValue(component.value)}</span>
          
          {/* Confidence indicator */}
          <motion.span 
            className="text-xs text-white/50 mr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(component.confidence * 100)}%
          </motion.span>

          {/* Hover actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(component.id);
              }}
              className="text-white/70 hover:text-red-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </Badge>
      )}
    </motion.div>
  );
};
