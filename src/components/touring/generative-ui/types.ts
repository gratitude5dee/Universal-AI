export interface GenerativeComponent {
  id: string;
  type: 'filter' | 'venue' | 'suggestion' | 'map';
  timestamp: number;
  delay?: number;
}

export interface FilterComponent extends GenerativeComponent {
  type: 'filter';
  filter: string;
  value: any;
  confidence: number;
}

export interface VenueComponent extends GenerativeComponent {
  type: 'venue';
  props: {
    id: string;
    venueName: string;
    matchScore: number;
    reasoning: string;
    capacity: number;
    price: number;
    amenities: string[];
    location: string;
    address: string;
    image: string;
  };
}

export interface SuggestionComponent extends GenerativeComponent {
  type: 'suggestion';
  content: string;
  category: 'pricing' | 'alternative' | 'timing' | 'general';
}

export type GeneratedComponent = FilterComponent | VenueComponent | SuggestionComponent;
