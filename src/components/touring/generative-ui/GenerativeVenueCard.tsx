import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, DollarSign, Sparkles, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GenerativeReasoningPanel } from "./GenerativeReasoningPanel";
import { GenerativeCostBreakdown } from "./GenerativeCostBreakdown";
import { GenerativeKeyFeatures } from "./GenerativeKeyFeatures";
import type { VenueComponent } from "./types";

interface GenerativeVenueCardProps {
  component: VenueComponent;
  onRefine?: (venueId: string, feedback: string) => void;
}

export const GenerativeVenueCard: React.FC<GenerativeVenueCardProps> = ({ component, onRefine }) => {
  const { props } = component;
  const [showReasoning, setShowReasoning] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the match score
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev >= props.matchScore) {
          clearInterval(interval);
          return props.matchScore;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [props.matchScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: (component.delay || 0) / 1000,
        type: "spring",
        stiffness: 100
      }}
    >
      <Card className="glass-card border-border hover:border-primary/50 hover:shadow-card-glow transition-all duration-300 overflow-hidden group">
        {/* AI Recommended Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Recommended
          </Badge>
        </div>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={props.image} 
            alt={props.venueName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Match Score Badge */}
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
              <span className={`text-lg font-bold ${getScoreColor(animatedScore)}`}>
                {animatedScore}%
              </span>
              <span className="text-white/70 text-sm ml-1">match</span>
            </div>
          </motion.div>

          {/* AI Sparkle Indicator */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-purple-400" />
          </motion.div>

          {/* Venue Name */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{props.venueName}</h3>
            <div className="flex items-center text-white/80 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {props.address}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* AI Reasoning Panel */}
          <GenerativeReasoningPanel
            reasoning={props.reasoning}
            matchScore={props.matchScore}
            delay={400}
          />

          {/* Key Features */}
          {props.keyFeatures && props.keyFeatures.length > 0 && (
            <GenerativeKeyFeatures
              features={props.keyFeatures}
              delay={600}
            />
          )}

          {/* Cost Breakdown */}
          {props.costBreakdown && props.costBreakdown.length > 0 && (
            <GenerativeCostBreakdown
              items={props.costBreakdown}
              delay={800}
            />
          )}

          {/* Setup Suggestions */}
          {props.setupSuggestions && props.setupSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Suggested Setup
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {props.setupSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Catering Recommendations */}
          {props.cateringSuggestions && props.cateringSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                Catering Recommendations
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {props.cateringSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Venue Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-white/80">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm">{props.capacity} capacity</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm">${props.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {props.amenities.slice(0, 4).map((amenity, idx) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80">
                  {amenity}
                </Badge>
              </motion.div>
            ))}
            {props.amenities.length > 4 && (
              <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80">
                +{props.amenities.length - 4} more
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => console.log('View details:', props.id)}
            >
              View Details
            </Button>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => onRefine?.(props.id, "Need more details")}
            >
              Refine
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
