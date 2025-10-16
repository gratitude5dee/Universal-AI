// On-Chain Distribution Type Definitions

export type ChainId = 'solana' | 'ethereum' | 'base' | 'polygon' | 'arbitrum' | 'optimism' | 'bnb' | 'avalanche';

export type AssetType = 
  | 'social-content'
  | 'music'
  | 'visual-art'
  | 'meme-token'
  | 'gaming-items'
  | 'ip-licenses'
  | 'physical-assets'
  | 'ai-generated'
  | 'event-access'
  | 'collectibles'
  | 'securities'
  | 'memberships';

export type PlatformCategory = 'meme-launchpads' | 'dao-community' | 'ip-rwa' | 'general-ido' | 'nft-marketplaces';

export interface Chain {
  id: ChainId;
  name: string;
  symbol: string;
  color: string;
  icon: string;
  gasToken: string;
  avgGasPrice?: number; // in USD
  congestionLevel?: 'low' | 'medium' | 'high';
  ecosystemFit?: number; // 0-100 score
}

export interface Platform {
  id: string;
  name: string;
  category: PlatformCategory;
  chains: ChainId[];
  icon: string;
  description: string;
  features: string[];
  fees?: {
    deployment?: string;
    transaction?: string;
    listing?: string;
  };
  volume?: string;
  stats?: {
    users?: string;
    volume?: string;
    launches?: string;
  };
  assetTypes?: AssetType[];
  url?: string;
}

export interface AssetTypeConfig {
  id: AssetType;
  name: string;
  icon: string;
  description: string;
  bestFor: string;
  complexity: 'low' | 'medium' | 'high';
  complianceRequired: boolean;
  recommendedChains: ChainId[];
  estimatedCost: string;
  examples: string[];
}

export interface TokenizationConfig {
  assetType: AssetType;
  name: string;
  symbol: string;
  description: string;
  totalSupply?: number;
  selectedChains: ChainId[];
  selectedPlatforms: string[];
  metadata: Record<string, any>;
  files?: File[];
}

export interface DeploymentResult {
  success: boolean;
  platform: string;
  chain: ChainId;
  tokenAddress?: string;
  transactionHash?: string;
  listingUrl?: string;
  error?: string;
}

export interface PortfolioAsset {
  id: string;
  type: 'fungible' | 'nft' | 'lp-token' | 'rwa';
  name: string;
  symbol: string;
  chain: ChainId;
  balance: number;
  value: number; // USD
  change24h?: number; // percentage
  icon?: string;
}

export interface LiquidityPosition {
  id: string;
  protocol: string;
  chain: ChainId;
  pool: string;
  tokens: { symbol: string; amount: number }[];
  value: number;
  poolShare: number;
  apy: number;
  dailyEarnings: number;
  unclaimedRewards: number;
}

export interface LiquidityOpportunity {
  id: string;
  protocol: string;
  chain: ChainId;
  pool: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  matchScore: number; // 0-100
  compatibleAssets: string[];
}

export interface TradingAgent {
  id: string;
  name: string;
  strategy: 'trend-following' | 'dca' | 'grid-trading' | 'arbitrage' | 'mean-reversion' | 'yield-optimizer';
  status: 'active' | 'paused' | 'stopped';
  chain: ChainId;
  managedAssets: string[];
  portfolioValue: number;
  performance24h: number;
  performanceAllTime: number;
  trades24h: number;
  successRate: number;
  createdAt: string;
}

export interface AgentStrategy {
  id: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  bestFor: string;
  icon: string;
}
