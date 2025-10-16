import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Map, Filter, Mic, Loader2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface GigSearchBarProps {
  onSearch: (query: string) => void;
  onMapToggle: () => void;
  showMap: boolean;
  isLoading?: boolean;
}

export const GigSearchBar: React.FC<GigSearchBarProps> = ({
  onSearch,
  onMapToggle,
  showMap,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
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
      <form onSubmit={handleSubmit}>
        <div className="glass-card p-6 bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs, venues, or locations..."
                className="pl-12 pr-32 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg focus:ring-2 focus:ring-blue-primary/50"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`hover:bg-white/10 ${isListening ? 'text-red-500 animate-pulse' : 'text-white/70'}`}
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-blue-primary hover:bg-blue-primary/80"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
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
              <Badge variant="outline" className="bg-blue-primary/10 border-blue-primary/30 text-blue-lightest cursor-pointer hover:bg-blue-primary/20">
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10 text-white/80 border-white/20">
                <Calendar className="h-3 w-3 mr-1" />
                This Month
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10 text-white/80 border-white/20">
                <MapPin className="h-3 w-3 mr-1" />
                All Locations
              </Badge>
            </div>

            <Button
              type="button"
              onClick={onMapToggle}
              variant="outline"
              size="sm"
              className={`${showMap ? 'bg-blue-primary/20 border-blue-primary text-blue-lightest' : 'border-white/20 text-white/80'} hover:bg-blue-primary/10`}
            >
              <Map className="h-4 w-4 mr-2" />
              {showMap ? 'Hide' : 'Show'} Map
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
