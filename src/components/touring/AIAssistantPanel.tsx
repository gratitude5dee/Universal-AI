import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Mic, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

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

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantPanelProps {
  selectedBooking?: Booking | null;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ selectedBooking }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    let assistantMessage = "";
    
    try {
      const response = await fetch(
        `https://ixkkrousepsiorwlaycp.supabase.co/functions/v1/booking-ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4a2tyb3VzZXBzaW9yd2xheWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzI1MjcsImV4cCI6MjA1NTkwODUyN30.eX_P7bJam2IZ20GEghfjfr-pNwMynsdVb3Rrfipgls4`,
          },
          body: JSON.stringify({
            messages: newMessages,
            bookingContext: selectedBooking || null,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Payment Required",
            description: "Please add credits to your Lovable workspace.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (e) {
            // Incomplete JSON, continue
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (const line of buffer.split("\n")) {
          if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (e) {
            // Ignore
          }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;
    streamChat(message);
  };

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case "draft":
        prompt = "Draft a professional email for this booking venue";
        break;
      case "suggest":
        prompt = "Suggest an optimal offer amount and negotiation strategy";
        break;
      case "review":
        prompt = "Review the current booking status and suggest next steps";
        break;
      case "next":
        prompt = "What are the recommended next steps for this booking?";
        break;
    }
    setMessage(prompt);
    streamChat(prompt);
  };

  const quickActions = [
    { label: "Draft Email", icon: Send, color: "text-blue-400", action: "draft" },
    { label: "Suggest Offer", icon: TrendingUp, color: "text-green-400", action: "suggest" },
    { label: "Review Contract", icon: CheckCircle2, color: "text-purple-400", action: "review" },
    { label: "Next Steps", icon: Lightbulb, color: "text-yellow-400", action: "next" },
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
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-3 mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground">CONVERSATION</h3>
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 border border-primary/20 ml-4"
                        : "bg-muted/50 border border-border mr-4"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === "assistant" && (
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-xs text-foreground whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground p-3"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">AI is thinking...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

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
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isLoading || !selectedBooking}
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
          {!selectedBooking && messages.length === 0 && (
            <Card className="bg-background/50 border-border">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-foreground mb-1">AI Assistant Ready</h3>
                <p className="text-xs text-muted-foreground">
                  Select a booking to get AI-powered insights, or ask me anything about your bookings
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
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Ask AI anything..."
            disabled={isLoading}
            className="flex-1 bg-background border-border text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsListening(!isListening)}
            className={isListening ? "text-red-500 animate-pulse" : ""}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
