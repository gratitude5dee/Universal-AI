import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, AlertTriangle, CheckCircle, FileText, Scale } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const AIAssistantSidebar = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Legal Assistant. I can help you with clause generation, risk analysis, and compliance checks. What would you like help with?",
      suggestions: ['Generate force majeure clause', 'Check contract compliance', 'Explain payment terms'],
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "I've analyzed your request. Here's a suggested clause for your contract...",
      suggestions: ['Add to contract', 'Modify clause', 'Get alternative'],
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <Card className="glass-card border-white/20 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Legal Assistant</h3>
            <p className="text-white/60 text-xs">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10 space-y-2">
        <p className="text-white/70 text-xs font-medium mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 text-xs">
            <AlertTriangle size={12} className="mr-1" />
            Risk Scan
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 text-xs">
            <Scale size={12} className="mr-1" />
            Compliance
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 text-xs">
            <FileText size={12} className="mr-1" />
            Add Clause
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 text-xs">
            <CheckCircle size={12} className="mr-1" />
            Verify
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-studio-accent text-white'
                    : 'bg-white/10 border border-white/10 text-white/90'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer border-white/30 text-white/80 hover:bg-white/10 text-xs"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about clauses, compliance..."
            className="bg-white/10 border-white/20 text-white flex-1"
          />
          <Button onClick={sendMessage} size="icon" className="bg-studio-accent hover:bg-studio-accent/90">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistantSidebar;
