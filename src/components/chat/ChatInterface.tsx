import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  integrations?: string[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "I need to search for current flight information to Denver and then use the available integrations to help with your travel planning:",
      role: "assistant",
      timestamp: new Date(),
      integrations: ["Select Apps"]
    },
    {
      id: "2", 
      content: "Now let me use the available integrations to help with your travel planning. I'll start by creating a calendar event for your potential Denver trip and explore the booking platforms:",
      role: "assistant",
      timestamp: new Date(),
      integrations: ["Begin Configuration Google Calendar Create Event", "Configure Props Google Calendar Create Event Props"]
    },
    {
      id: "3",
      content: "Let me get your available calendars first:",
      role: "assistant", 
      timestamp: new Date(),
      integrations: ["Async Options Google Calendar Create Event CalendarId"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand you'd like help with that. Let me process your request and provide the most relevant assistance.",
        role: "assistant",
        timestamp: new Date(),
        integrations: ["Processing request"]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card border border-white/10 backdrop-blur-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#9b87f5]" />
          <h3 className="font-medium text-studio-charcoal">Artist Assistant</h3>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-studio-clay">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#9b87f5]/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-[#9b87f5]" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#9b87f5] text-white ml-auto'
                      : 'bg-white/5 text-studio-charcoal border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {/* Integrations */}
                {message.integrations && (
                  <div className="mt-2 space-y-1">
                    {message.integrations.map((integration, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-xs text-[#33C3F0] bg-[#33C3F0]/10 p-2 rounded border border-[#33C3F0]/20"
                      >
                        <Check className="h-3 w-3" />
                        <span>{integration}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-studio-clay mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#33C3F0]/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-[#33C3F0]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-[#9b87f5]" />
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="flex-1 bg-white/5 border-white/10 text-studio-charcoal placeholder:text-studio-clay focus:border-[#9b87f5]/50"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-studio-clay mt-2 flex items-center gap-1">
          <span className="inline-block">🔒</span>
          Credentials are encrypted. Revoke anytime.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;