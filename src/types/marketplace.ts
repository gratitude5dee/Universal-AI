export interface MarketplaceListing {
  id: string;
  agentId: string;
  name: string;
  description: string;
  longDescription: string; // Markdown
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string[];
  pricing: {
    model: 'free' | 'freemium' | 'paid' | 'subscription';
    price?: number;
    currency?: string;
  };
  rating: number;
  reviewCount: number;
  installCount: number;
  features: string[];
  screenshots: string[];
  videoUrl?: string;
  dependencies: Dependency[];
  requiredPlugins: string[];
  lastUpdated: Date;
  version: string;
}

export interface Dependency {
  name: string;
  type: 'required' | 'optional';
  installed: boolean;
}

export interface AgentReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface FilterState {
  search: string;
  categories: string[];
  priceModel: ('free' | 'freemium' | 'paid' | 'subscription')[];
  minRating: number;
  sortBy: 'price-low' | 'price-high' | 'rating' | 'popularity' | 'recent' | 'alphabetical';
}
