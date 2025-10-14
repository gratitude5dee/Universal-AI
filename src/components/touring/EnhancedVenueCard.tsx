import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, DollarSign, Calendar, Music, Wifi, Mic2, Wine, Clock, ArrowRight, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    city: string;
    state: string;
    capacity: number;
    price: string;
    availability: string;
    imageUrl?: string;
    amenities: string[];
    genre: string;
    matchScore?: number;
  };
  status?: "new" | "negotiating" | "accepted" | "contracted" | "paid";
  onAction: (action: string, venueId: string) => void;
}

const EnhancedVenueCard: React.FC<VenueCardProps> = ({ venue, status = "new", onAction }) => {
  const statusConfig = {
    new: { color: "bg-gray-500/20 text-gray-300 border-gray-500/30", label: "New" },
    negotiating: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Negotiating" },
    accepted: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Accepted" },
    contracted: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Contracted" },
    paid: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Paid" },
  };

  const amenityIcons: Record<string, any> = {
    "Sound System": Music,
    "Lighting": Wifi,
    "Stage": Mic2,
    "Bar": Wine,
  };

  const actionButtons = {
    new: { label: "Send Offer", variant: "default" as const },
    negotiating: { label: "Continue Negotiation", variant: "default" as const },
    accepted: { label: "Create Contract", variant: "default" as const },
    contracted: { label: "Send Invoice", variant: "default" as const },
    paid: { label: "View Details", variant: "outline" as const },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 hover:shadow-card-glow transition-all duration-300 h-full flex flex-col">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {venue.imageUrl ? (
            <img 
              src={venue.imageUrl} 
              alt={venue.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-16 w-16 text-muted-foreground opacity-20" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${statusConfig[status].color} border font-semibold`}>
              {statusConfig[status].label}
            </Badge>
          </div>

          {/* Match Score */}
          {venue.matchScore && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-purple-500/90 text-white border-purple-400">
                {venue.matchScore}% match
              </Badge>
            </div>
          )}

          {/* More Options */}
          <div className="absolute bottom-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem onClick={() => onAction('view', venue.id)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('save', venue.id)}>
                  Save to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('share', venue.id)}>
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Venue Info */}
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {venue.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{venue.city}, {venue.state}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium">{venue.capacity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-foreground font-medium">{venue.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">{venue.availability}</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.slice(0, 3).map((amenity, idx) => {
                  const Icon = amenityIcons[amenity] || Clock;
                  return (
                    <Badge key={idx} variant="outline" className="bg-accent/50 border-border">
                      <Icon className="h-3 w-3 mr-1" />
                      {amenity}
                    </Badge>
                  );
                })}
                {venue.amenities.length > 3 && (
                  <Badge variant="outline" className="bg-accent/50 border-border">
                    +{venue.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button
              onClick={() => onAction(actionButtons[status].label.toLowerCase().replace(' ', '-'), venue.id)}
              variant={actionButtons[status].variant}
              className="flex-1"
            >
              {actionButtons[status].label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedVenueCard;
