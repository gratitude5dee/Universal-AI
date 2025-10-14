export interface GenerativeComponent {
  id: string;
  type: 'filter' | 'venue' | 'suggestion' | 'map' | 'reasoning' | 'cost-breakdown' | 'key-features' | 'setup-suggestion' | 'catering-suggestion';
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
    keyFeatures?: Array<string | { label: string; description?: string; icon?: string }>;
    setupSuggestions?: string[];
    cateringSuggestions?: string[];
    costBreakdown?: Array<{ label: string; amount: number }>;
  };
}

export interface SuggestionComponent extends GenerativeComponent {
  type: 'suggestion';
  content: string;
  category: 'pricing' | 'alternative' | 'timing' | 'general';
}

export interface ReasoningComponent extends GenerativeComponent {
  type: 'reasoning';
  reasoning: string;
  matchScore: number;
}

export interface CostBreakdownComponent extends GenerativeComponent {
  type: 'cost-breakdown';
  items: Array<{ label: string; amount: number }>;
}

export interface KeyFeaturesComponent extends GenerativeComponent {
  type: 'key-features';
  features: Array<string | { label: string; description?: string; icon?: string }>;
}

export interface SetupSuggestionComponent extends GenerativeComponent {
  type: 'setup-suggestion';
  suggestions: string[];
}

export interface CateringSuggestionComponent extends GenerativeComponent {
  type: 'catering-suggestion';
  suggestions: string[];
}

export type GeneratedComponent = 
  | FilterComponent 
  | VenueComponent 
  | SuggestionComponent
  | ReasoningComponent
  | CostBreakdownComponent
  | KeyFeaturesComponent
  | SetupSuggestionComponent
  | CateringSuggestionComponent;
