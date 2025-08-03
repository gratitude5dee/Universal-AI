import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, MapPin, Calendar, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AIBookingAssistant = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const suggestedActions = [
    {
      title: "Find Venues by Genre",
      description: "Discover venues perfect for your music style",
      icon: MapPin,
      query: "Find jazz venues in New York with capacity 200-500"
    },
    {
      title: "Check Availability",
      description: "See what's available on your tour route",
      icon: Calendar,
      query: "Check venue availability for March 2024 in Los Angeles"
    },
    {
      title: "Optimize Tour Route",
      description: "Get the most efficient touring path",
      icon: TrendingUp,
      query: "Optimize my route from NYC to LA with 5 stops"
    }
  ];

  const mockRecommendations = [
    {
      id: 1,
      name: "The Blue Note",
      city: "New York, NY",
      capacity: 300,
      genre: "Jazz",
      matchScore: 95,
      price: "$2,500",
      availability: "Available March 15-20",
      features: ["Full sound system", "Recording capabilities", "Bar service"]
    },
    {
      id: 2,
      name: "Village Vanguard",
      city: "New York, NY",
      capacity: 178,
      genre: "Jazz",
      matchScore: 92,
      price: "$3,000",
      availability: "Available March 22-25",
      features: ["Historic venue", "Acoustic focus", "Intimate setting"]
    },
    {
      id: 3,
      name: "Smalls Jazz Club",
      city: "New York, NY",
      capacity: 60,
      genre: "Jazz",
      matchScore: 88,
      price: "$1,200",
      availability: "Available March 10-30",
      features: ["Late night sets", "Live streaming", "Jam sessions"]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestedAction = (actionQuery: string) => {
    setQuery(actionQuery);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="space-y-6">
      {/* AI Chat Interface */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-studio-accent/20">
              <Bot className="h-5 w-5 text-studio-accent" />
            </div>
            AI Booking Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find me venues in NYC for March 2024..."
              className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-studio-accent hover:bg-studio-accent/80"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Suggested Actions */}
          <div className="space-y-3">
            <p className="text-sm text-white/70">Suggested Actions:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestedActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedAction(action.query)}
                    className="p-3 text-left rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-studio-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-white">{action.title}</h3>
                        <p className="text-xs text-white/70 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-studio-accent" />
            AI Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow hover:shadow-lg hover:shadow-studio-accent/20 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{venue.name}</CardTitle>
                        <p className="text-sm text-white/70">{venue.city}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-studio-accent/20 text-studio-accent border-studio-accent/30">
                          {venue.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-white/50">Capacity:</span>
                        <p className="text-white font-medium">{venue.capacity}</p>
                      </div>
                      <div>
                        <span className="text-white/50">Genre:</span>
                        <p className="text-white font-medium">{venue.genre}</p>
                      </div>
                      <div>
                        <span className="text-white/50">Price:</span>
                        <p className="text-white font-medium">{venue.price}</p>
                      </div>
                      <div>
                        <span className="text-white/50">Available:</span>
                        <p className="text-white font-medium text-xs">{venue.availability}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-white/50 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {venue.features.map((feature: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/70">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-studio-accent hover:bg-studio-accent/80">
                        Book Now
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block p-4 rounded-full bg-studio-accent/20 mb-4"
          >
            <Bot className="h-8 w-8 text-studio-accent" />
          </motion.div>
          <p className="text-white/70">AI is analyzing venues and generating recommendations...</p>
        </motion.div>
      )}
    </div>
  );
};

export default AIBookingAssistant;