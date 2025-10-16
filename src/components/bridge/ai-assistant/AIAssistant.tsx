import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Send, Lightbulb, Code, TrendingUp, Zap } from "lucide-react";
import { AIRecommendations } from "./AIRecommendations";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "👋 Hi! I can help you mint NFTs, recommend platforms, optimize pricing, and more. What would you like to do?"
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChatHistory([
      ...chatHistory,
      { role: "user", content: message },
      { 
        role: "assistant", 
        content: "I understand you want to " + message + ". Let me analyze your portfolio and provide recommendations..." 
      }
    ]);
    setMessage("");
  };

  const quickPrompts = [
    { text: "Help me mint an NFT", icon: Sparkles },
    { text: "Optimize my pricing", icon: TrendingUp },
    { text: "Recommend platforms", icon: Lightbulb },
    { text: "Analyze performance", icon: Zap }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <TabsTrigger value="chat" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            💬 Chat
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            💡 Insights
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            📋 Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="pt-6">
          <Card className="backdrop-blur-md bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20 border border-[#9b87f5]/30 p-8 shadow-card-glow">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#9b87f5]" />
              <div>
                <h2 className="text-2xl font-bold text-white text-shadow-sm">AI Distribution Assistant</h2>
                <p className="text-white/70 text-shadow-sm">Your intelligent helper for on-chain distribution</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {chatHistory.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    msg.role === "assistant" 
                      ? "bg-white/10 border border-white/20" 
                      : "bg-[#9b87f5]/20 border border-[#9b87f5]/30 ml-12"
                  }`}
                >
                  <p className="text-white/90 text-shadow-sm">{msg.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about NFT distribution..."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
              <Button onClick={handleSend} className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMessage(prompt.text)}
                    className="border-white/20 text-white hover:bg-white/10 justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {prompt.text}
                  </Button>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="pt-6">
          <AIRecommendations />
        </TabsContent>

        <TabsContent value="templates" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Beginner Drop", description: "First NFT mint on low-cost chain", platforms: 2 },
              { title: "Multi-Platform Launch", description: "Deploy across 5+ marketplaces", platforms: 6 },
              { title: "Edition Series", description: "Limited edition collection drop", platforms: 3 },
              { title: "High-Value 1/1", description: "Premium single artwork listing", platforms: 2 }
            ].map((template, idx) => (
              <Card key={idx} className="backdrop-blur-md bg-white/10 border border-white/20 p-6 hover:shadow-glow transition-all cursor-pointer">
                <h3 className="font-semibold text-white text-shadow-sm mb-2">{template.title}</h3>
                <p className="text-sm text-white/70 text-shadow-sm mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50">{template.platforms} platforms configured</span>
                  <Button size="sm" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
