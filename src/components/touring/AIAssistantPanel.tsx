import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Mic, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Booking {
  id: string;
  venue_name: string;
  venue_location: string;
  venue_city: string;
  venue_state: string;
  venue_contact_email: string;
  status: string;
  workflow_stage: string;
  offer_amount: number;
  event_date: string;
  event_time: string;
  created_at: string;
  notes?: string;
  ai_match_score?: number;
  ai_reasoning?: string;
}

interface AIAssistantPanelProps {
  selectedBooking?: Booking | null;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ selectedBooking }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement AI chat functionality
    setMessage("");
  };

  const quickActions = [
    { label: "Draft Email", icon: Send, color: "text-blue-400" },
    { label: "Suggest Offer", icon: TrendingUp, color: "text-green-400" },
    { label: "Review Contract", icon: CheckCircle2, color: "text-purple-400" },
    { label: "Next Steps", icon: Lightbulb, color: "text-yellow-400" },
  ];

  const insights = selectedBooking ? [
    {
      type: "success",
      icon: CheckCircle2,
      title: "Strong Match",
      description: `${selectedBooking.ai_match_score || 90}% compatibility with your tour profile`,
      color: "bg-green-500/10 border-green-500/30 text-green-400"
    },
    {
      type: "info",
      icon: TrendingUp,
      title: "Optimal Timing",
      description: "Best time to follow up is within 24 hours",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-400"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Action Needed",
      description: getNextActionMessage(selectedBooking.workflow_stage),
      color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
    }
  ] : [];

  function getNextActionMessage(stage: string): string {
    switch (stage) {
      case "intro": return "Send initial offer to move forward";
      case "offer": return "Follow up on pending offer";
      case "contract": return "Generate and send contract";
      case "invoice": return "Issue invoice for payment";
      case "payment": return "Generate event assets";
      default: return "Review booking details";
    }
  }

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-l border-border">
      {/* Header */}
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Get intelligent recommendations and insights
        </p>
      </CardHeader>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">QUICK ACTIONS</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary/50"
                  >
                    <ActionIcon className={`h-4 w-4 ${action.color}`} />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          {selectedBooking && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">AI INSIGHTS</h3>
              <div className="space-y-2">
                {insights.map((insight, idx) => {
                  const InsightIcon = insight.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className={`${insight.color} border`}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <InsightIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold mb-1">{insight.title}</h4>
                              <p className="text-xs opacity-90">{insight.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* AI Reasoning */}
                {selectedBooking.ai_reasoning && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3">
                      <h4 className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Analysis
                      </h4>
                      <p className="text-xs text-muted-foreground">{selectedBooking.ai_reasoning}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Placeholder when no booking selected */}
          {!selectedBooking && (
            <Card className="bg-background/50 border-border">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-foreground mb-1">Select a Booking</h3>
                <p className="text-xs text-muted-foreground">
                  Choose a booking from the pipeline to see AI-powered insights and recommendations
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask AI anything..."
            className="flex-1 bg-background border-border text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsListening(!isListening)}
            className={isListening ? "text-red-500 animate-pulse" : ""}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
