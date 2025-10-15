import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Globe, 
  Database, 
  Sparkles, 
  Send, 
  Plus,
  Clock,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;

interface ResearchMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  tokensUsed?: number;
  model?: string;
}

interface ResearchHistoryMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  sources?: string[] | null;
  tokens_used?: number | null;
  model?: string | null;
  created_at: string;
}

interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'loading';
  icon: React.ReactNode;
  description: string;
}

const ResearchInterface = () => {
  const [messages, setMessages] = useState<ResearchMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getAccessToken = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.access_token) {
      throw new Error('User session not available');
    }
    return session.access_token;
  }, []);

  const [integrations] = useState<IntegrationStatus[]>([
    {
      id: 'cerebras',
      name: 'Cerebras AI',
      status: 'connected',
      icon: <Brain className="w-4 h-4" />,
      description: 'Advanced AI reasoning'
    },
    {
      id: 'web',
      name: 'Web Search',
      status: 'connected',
      icon: <Globe className="w-4 h-4" />,
      description: 'Real-time web data'
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      status: 'connected',
      icon: <Database className="w-4 h-4" />,
      description: 'Personal data archive'
    }
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const refreshSessionHistory = useCallback(async (activeSessionId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('User session not found');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/research-sessions?sessionId=${encodeURIComponent(activeSessionId)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to load research history');
      }

      const payload = await response.json();
      const history = (payload.messages || []).map((message: any) => ({
        id: message.id,
        content: message.content,
        role: message.role,
        timestamp: new Date(message.created_at),
        sources: message.sources ?? undefined,
        tokensUsed: message.tokens_used ?? undefined,
        model: message.model ?? undefined,
      }));

      setMessages(history);
    } catch (err) {
      console.error('Unexpected error loading research history:', err);
      toast({
        title: 'History Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred while loading messages.',
        variant: 'destructive'
      });
    }
  }, [getAccessToken, scrollToBottom, toast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedSessionId = window.localStorage.getItem('researchSessionId');
    const activeSessionId = storedSessionId || `research_${Date.now()}`;

    if (!storedSessionId) {
      window.localStorage.setItem('researchSessionId', activeSessionId);
    }

    setSessionId(activeSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    refreshSessionHistory(sessionId);
  }, [sessionId, refreshSessionHistory]);

  const handleResearch = async () => {
    if (!inputValue.trim() || isResearching) return;
    if (!sessionId) {
      toast({
        title: 'Session Not Ready',
        description: 'Please wait while we prepare your research session.',
        variant: 'destructive'
      });
      return;
    }

    const userMessage: ResearchMessage = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsResearching(true);

    try {
      console.log('Starting research request...');
      
      const token = await getAccessToken();

      const { data, error } = await supabase.functions.invoke('cerebras-research', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          query: inputValue,
          context: 'Deep research session',
          sources: ['Cerebras AI', 'Knowledge Base'],
          sessionId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Research response received:', data);

      if (data?.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('researchSessionId', data.sessionId);
        }
      }

      const assistantMessage: ResearchMessage = {
        id: `msg_${Date.now()}`,
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
        tokensUsed: data.tokensUsed,
        model: data.model
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data?.sessionId) {
        await refreshSessionHistory(data.sessionId);
      } else if (sessionId) {
        await refreshSessionHistory(sessionId);
      }

      toast({
        title: "Research Complete",
        description: `Generated ${data.tokensUsed || 0} tokens with ${data.model}`,
      });

    } catch (error) {
      console.error('Research error:', error);
      
      const errorMessage: ResearchMessage = {
        id: `msg_${Date.now()}`,
        content: `Research failed: ${error.message || 'Unknown error occurred'}. Please check your Cerebras API configuration.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Research Error",
        description: error.message || 'Failed to complete research',
        variant: "destructive",
      });
    } finally {
      setIsResearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResearch();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-darker/80 via-purple-900/60 to-blue-dark/90 relative overflow-hidden">
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(155,135,245,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(139,92,246,0.08),transparent_40%,rgba(59,130,246,0.06),transparent_80%)]" />
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
      
      {/* Floating Glass Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/10 to-blue-500/10 backdrop-blur-sm animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/8 to-purple-500/8 backdrop-blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Header */}
      <motion.div 
        className="flex-shrink-0 p-6 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Music Industry DeepResearch
              </h1>
              <p className="text-white/60 text-sm">Expert AI research for music professionals, artists & industry leaders</p>
            </div>
          </div>
          
          {/* Integration Status */}
          <div className="flex gap-2">
            {integrations.map((integration) => (
              <motion.div
                key={integration.id}
                className="glass-card p-3 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                title={integration.description}
              >
                {integration.icon}
                <div className={`w-2 h-2 rounded-full ${
                  integration.status === 'connected' ? 'bg-green-400' :
                  integration.status === 'loading' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 mb-6">
                  <Search className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Start Your Music Research</h3>
                  <p className="text-white/60 max-w-md">
                    Ask any music industry question and I'll research across streaming data, market trends, artist insights, and industry intelligence to provide expert analysis.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                  {[
                    { icon: <Target className="w-5 h-5" />, title: "Market Trends", desc: "Analyze streaming trends and genre popularity across platforms" },
                    { icon: <BookOpen className="w-5 h-5" />, title: "Artist Intelligence", desc: "Research artist careers, collaborations, and industry positioning" },
                    { icon: <Zap className="w-5 h-5" />, title: "Industry Analytics", desc: "Deep dive into label strategies, revenue streams, and emerging markets" }
                  ].map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      className="glass-card p-4 cursor-pointer group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setInputValue(suggestion.desc)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:text-purple-200 transition-colors">
                          {suggestion.icon}
                        </div>
                        <h4 className="font-medium text-white">{suggestion.title}</h4>
                      </div>
                      <p className="text-white/60 text-sm">{suggestion.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-4xl ${message.role === 'user' ? 'ml-16' : 'mr-16'}`}>
                      <Card className={`p-4 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30' 
                          : 'glass-card'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            message.role === 'user' 
                              ? 'bg-purple-500/30 text-purple-200' 
                              : 'bg-blue-500/30 text-blue-200'
                          }`}>
                            {message.role === 'user' ? 
                              <Search className="w-4 h-4" /> : 
                              <Brain className="w-4 h-4" />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="prose prose-invert max-w-none">
                              <div className="whitespace-pre-wrap text-white/90">
                                {message.content}
                              </div>
                            </div>
                            
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                  <Clock className="w-3 h-3" />
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                                {message.sources && (
                                  <div className="flex gap-1">
                                    {message.sources.map((source, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/60">
                                        {source}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {message.tokensUsed && (
                                  <div className="text-xs text-white/50">
                                    {message.tokensUsed} tokens • {message.model}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                ))}
                
                {isResearching && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="max-w-4xl mr-16">
                      <Card className="glass-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/30 text-blue-200">
                            <Brain className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                  />
                                ))}
                              </div>
                              <span className="text-white/70 text-sm">Researching across all sources...</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div 
        className="flex-shrink-0 p-6 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about music trends, artist strategies, industry insights, streaming data..."
            className="min-h-[60px] pr-16 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-purple-400/20 resize-none"
            disabled={isResearching}
          />
          <Button
            onClick={handleResearch}
            disabled={!inputValue.trim() || isResearching}
            size="sm"
            className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
          >
            {isResearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-white/50">
          <div className="flex items-center gap-4">
            <span>Session: {sessionId}</span>
            <span>{messages.length} messages</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Cerebras AI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResearchInterface;