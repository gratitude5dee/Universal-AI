
export interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  pricing: "free" | "freemium" | "paid" | "subscription" | "enterprise";
  rating: number;
  reviews: number;
  features: string[];
  languages: string[];
  tags: string[];
  category: string;
  image?: string;
}

export interface IntegrationCategory {
  name: string;
  count: number;
  color: string;
}
