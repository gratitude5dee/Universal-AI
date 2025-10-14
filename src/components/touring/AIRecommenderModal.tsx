import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, TrendingUp, Tag, Calendar, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AIRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommend: (description: string) => Promise<any>;
}

const AIRecommenderModal: React.FC<AIRecommenderModalProps> = ({
  isOpen,
  onClose,
  onRecommend
}) => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await onRecommend(description);
      setRecommendations(results);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mockRecommendation = {
    venueName: "Blue Note Jazz Club",
    matchScore: 95,
    whyPerfect: "This venue perfectly matches your requirements with its intimate atmosphere, world-class acoustics, and strong jazz heritage. The capacity aligns with your audience size, and the venue has excellent relationships with jazz artists.",
    keyFeatures: ["World-class sound system", "Intimate atmosphere", "Strong jazz heritage", "Available March dates", "Full bar service"],
    suggestedSetup: "Recommend a quartet configuration with spotlight on the piano. The venue's natural acoustics will complement your jazz style perfectly.",
    cateringRecommendation: "Premium cocktail service with light appetizers. The venue's signature jazz-themed cocktails would enhance the atmosphere.",
    costBreakdown: {
      venue: 2500,
      catering: 800,
      extras: 200,
      total: 3500
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-card border-border shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <Sparkles className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">AI Venue Recommender</h2>
                      <p className="text-muted-foreground text-sm">
                        Describe your event and get intelligent venue suggestions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-accent"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Input Section */}
                {recommendations.length === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Event Description
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="I'm planning a jazz quartet performance for about 150-200 people in March 2024. Looking for an intimate venue in San Francisco with excellent acoustics and a full bar..."
                        className="min-h-[150px] bg-background border-border resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!description.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-5 w-5 mr-2" />
                          </motion.div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Get AI Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Recommendations Section */}
                {recommendations.length > 0 || isLoading ? (
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="py-12 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="inline-block p-4 rounded-full bg-primary/20 mb-4"
                        >
                          <Sparkles className="h-8 w-8 text-primary" />
                        </motion.div>
                        <p className="text-foreground font-medium">AI is analyzing venues...</p>
                        <p className="text-muted-foreground text-sm mt-2">Finding the perfect matches for your event</p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Demo recommendation - replace with actual data */}
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-foreground">{mockRecommendation.venueName}</h3>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-4 py-2">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              {mockRecommendation.matchScore}% Match
                            </Badge>
                          </div>

                          {/* Why Perfect */}
                          <div className="glass-card p-4">
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Why This Venue is Perfect
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {mockRecommendation.whyPerfect}
                            </p>
                          </div>

                          {/* Key Features */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Tag className="h-4 w-4 text-primary" />
                              Key Features
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {mockRecommendation.keyFeatures.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="bg-accent/50 border-border">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Suggested Setup */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="glass-card p-4">
                              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                Suggested Setup
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {mockRecommendation.suggestedSetup}
                              </p>
                            </div>

                            <div className="glass-card p-4">
                              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Catering Recommendation
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {mockRecommendation.cateringRecommendation}
                              </p>
                            </div>
                          </div>

                          {/* Cost Breakdown */}
                          <div className="glass-card p-6">
                            <h4 className="font-semibold text-foreground mb-4">Complete Cost Breakdown</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Venue Rental</span>
                                <span className="font-semibold text-foreground">
                                  ${mockRecommendation.costBreakdown.venue.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Catering & Bar</span>
                                <span className="font-semibold text-foreground">
                                  ${mockRecommendation.costBreakdown.catering.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Additional Services</span>
                                <span className="font-semibold text-foreground">
                                  ${mockRecommendation.costBreakdown.extras.toLocaleString()}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center text-lg">
                                <span className="font-bold text-foreground">Total Estimated Cost</span>
                                <span className="font-bold text-primary">
                                  ${mockRecommendation.costBreakdown.total.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                              View Venue Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="flex-1 border-border hover:bg-accent">
                              Contact Venue
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIRecommenderModal;
