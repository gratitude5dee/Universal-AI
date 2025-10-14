import React from "react";
import { AnimatePresence } from "framer-motion";
import { GenerativeVenueCard } from "./GenerativeVenueCard";
import { GenerativeFilterBadge } from "./GenerativeFilterBadge";
import { GenerativeSuggestion } from "./GenerativeSuggestion";
import type { GeneratedComponent, FilterComponent, VenueComponent, SuggestionComponent } from "./types";

interface GenerativeUIRendererProps {
  components: GeneratedComponent[];
  onFilterRemove?: (filterId: string) => void;
  onFilterEdit?: (filterId: string, newValue: any) => void;
  onVenueRefine?: (venueId: string, feedback: string) => void;
}

export const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = ({
  components,
  onFilterRemove,
  onFilterEdit,
  onVenueRefine
}) => {
  const filters = components.filter(c => c.type === 'filter') as FilterComponent[];
  const venues = components.filter(c => c.type === 'venue') as VenueComponent[];
  const suggestions = components.filter(c => c.type === 'suggestion') as SuggestionComponent[];

  return (
    <div className="space-y-6">
      {/* Extracted Filters */}
      {filters.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/70">Extracted from your search:</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {filters.map(filter => (
                <GenerativeFilterBadge
                  key={filter.id}
                  component={filter}
                  onRemove={onFilterRemove}
                  onEdit={onFilterEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* AI-Generated Venues */}
      {venues.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Found {venues.length} matching venues
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {venues.map(venue => (
                <GenerativeVenueCard
                  key={venue.id}
                  component={venue}
                  onRefine={onVenueRefine}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/70">AI Suggestions:</h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {suggestions.map(suggestion => (
                <GenerativeSuggestion
                  key={suggestion.id}
                  component={suggestion}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
