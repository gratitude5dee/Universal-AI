import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Map, Filter, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
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
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`hover:bg-primary/10 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="hover:bg-primary/10 text-muted-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
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
                onClick={onAIRecommend}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Recommender
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EnhancedBookingSearch;
