import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Map, Filter, Mic, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GenerativeUIRenderer } from "./generative-ui/GenerativeUIRenderer";
import type { GeneratedComponent } from "./generative-ui/types";

interface EnhancedBookingSearchProps {
  onSearch: (query: string) => void;
  onAIRecommend: () => void;
  onMapToggle: () => void;
  showMap: boolean;
}

const EnhancedBookingSearch: React.FC<EnhancedBookingSearchProps> = ({
  onSearch,
  onAIRecommend,
  onMapToggle,
  showMap
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([]);
  const [useGenerativeUI, setUseGenerativeUI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useGenerativeUI) {
      await handleGenerativeSearch();
    } else {
      onSearch(searchQuery);
    }
  };

  const handleGenerativeSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsGenerating(true);
    setGeneratedComponents([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/venue-ai-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error('Search failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                
                // Try to parse JSON objects from the accumulated content
                const jsonMatches = fullContent.match(/\{[^}]+\}/g);
                if (jsonMatches) {
                  for (const jsonStr of jsonMatches) {
                    try {
                      const component = JSON.parse(jsonStr);
                      if (component.type) {
                        setGeneratedComponents(prev => [...prev, {
                          id: crypto.randomUUID(),
                          timestamp: Date.now(),
                          ...component
                        }]);
                      }
                    } catch (e) {
                      // Not a complete JSON object yet
                    }
                  }
                }
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Generative search error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleFilterRemove = (filterId: string) => {
    setGeneratedComponents(prev => prev.filter(c => c.id !== filterId));
  };

  const handleFilterEdit = (filterId: string, newValue: any) => {
    setGeneratedComponents(prev => prev.map(c => 
      c.id === filterId && c.type === 'filter' 
        ? { ...c, value: newValue } 
        : c
    ));
  };

  const handleVenueRefine = (venueId: string, feedback: string) => {
    console.log('Refining venue:', venueId, feedback);
    // Could trigger a new AI search with refinement context
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find me jazz venues in SF with 200-500 capacity..."
                className="pl-12 pr-32 h-14 bg-background/50 border-border text-foreground placeholder:text-muted-foreground text-lg"
                disabled={isGenerating}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`hover:bg-primary/10 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                  disabled={isGenerating}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="hover:bg-primary/10 text-muted-foreground"
                  disabled={isGenerating}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary cursor-pointer hover:bg-primary/20">
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                200-500 capacity
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Jazz venues
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Available March 2024
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={onMapToggle}
                variant="outline"
                size="sm"
                className={`${showMap ? 'bg-primary/20 border-primary' : ''}`}
              >
                <Map className="h-4 w-4 mr-2" />
                {showMap ? 'Hide' : 'Show'} Map
              </Button>
              
              <Button
                type="button"
                onClick={() => setUseGenerativeUI(!useGenerativeUI)}
                size="sm"
                className={`${useGenerativeUI ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'} hover:from-purple-700 hover:to-indigo-700`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {useGenerativeUI ? 'AI Mode ✨' : 'Standard Mode'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Generative UI Results */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
          >
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <p className="text-white/80">AI is analyzing your search and generating results...</p>
          </motion.div>
        )}

        {!isGenerating && generatedComponents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GenerativeUIRenderer
              components={generatedComponents}
              onFilterRemove={handleFilterRemove}
              onFilterEdit={handleFilterEdit}
              onVenueRefine={handleVenueRefine}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedBookingSearch;
