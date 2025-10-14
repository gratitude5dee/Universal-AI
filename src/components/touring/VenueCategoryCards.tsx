import React from "react";
import { motion } from "framer-motion";
import { Music, Theater, Building2, Landmark, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VenueCategory {
  id: string;
  name: string;
  icon: any;
  gradient: string;
  count?: number;
}

const categories: VenueCategory[] = [
  { 
    id: "concert-hall", 
    name: "Concert Hall", 
    icon: Music, 
    gradient: "from-purple-600 to-pink-600",
    count: 12
  },
  { 
    id: "theater", 
    name: "Theater", 
    icon: Theater, 
    gradient: "from-blue-600 to-cyan-600",
    count: 8
  },
  { 
    id: "music-venue", 
    name: "Music Venue", 
    icon: Users, 
    gradient: "from-orange-600 to-red-600",
    count: 24
  },
  { 
    id: "historic-venue", 
    name: "Historic Venue", 
    icon: Landmark, 
    gradient: "from-green-600 to-emerald-600",
    count: 5
  },
];

interface VenueCategoryCardsProps {
  onCategorySelect?: (categoryId: string) => void;
}

const VenueCategoryCards: React.FC<VenueCategoryCardsProps> = ({ onCategorySelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Browse by Category</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => onCategorySelect?.(category.id)}
                className="glass-card border-border hover:border-primary/50 cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-card-glow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Icon with Gradient Background */}
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      {category.count && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (index * 0.1) + 0.3, type: "spring" }}
                          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg"
                        >
                          {category.count}
                        </motion.div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.count} venues available
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className={`h-1 rounded-full bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VenueCategoryCards;
