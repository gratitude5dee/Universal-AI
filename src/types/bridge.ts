export type BridgeDirection = "digital-to-physical" | "physical-to-digital";
export type ChainId = "solana" | "ethereum" | "base" | "polygon" | "optimism" | "arbitrum";
export type PlatformId = "opensea" | "zora" | "magiceden" | "rarible" | "foundation" | "superrare" | "blur" | "manifold" | "looksrare";
export type SocialPlatformId = "lens" | "farcaster" | "mirror";

export interface BridgeAsset {
  id: string;
  name: string;
  type: "product" | "ticket" | "certificate" | "document";
  status: "pending" | "bridging" | "completed" | "failed";
  createdAt: string;
  direction: BridgeDirection;
  verificationCode?: string;
  icon?: string;
}

export interface VerificationMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  securityLevel: "low" | "medium" | "high";
}

export interface PhysicalProduct {
  id: string;
  name: string;
  description: string;
  status: "verified" | "unverified" | "pending";
  digitalAssetId: string;
  verificationMethods: string[];
}

export interface EventTicket {
  id: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  owner: string;
  status: "issued" | "validated" | "expired";
  validationCode: string;
}

// New types for on-chain distribution

export interface Chain {
  id: ChainId;
  name: string;
  symbol: string;
  color: string;
  icon: string;
  gasToken: string;
  rpcUrl: string;
  explorer: string;
}

export interface Platform {
  id: PlatformId;
  name: string;
  chains: ChainId[];
  icon: string;
  estimatedCost: Record<ChainId, number>;
  estimatedTime: Record<ChainId, number>; // seconds
  features: string[];
  description: string;
}

export interface NFTMetadata {
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  externalUrl?: string;
  properties: { type: string; value: string }[];
  levels: { name: string; value: number; max: number }[];
  stats: { name: string; value: number }[];
  unlockableContent?: string;
}

export interface NFTPricing {
  saleType: "fixed" | "auction" | "bids" | "not-for-sale";
  price?: number;
  currency: "ETH" | "SOL" | "MATIC" | "USD";
  supplyType: "single" | "limited" | "open";
  totalSupply?: number;
  royaltyPercentage: number;
  royaltyRecipients: { address: string; share: number }[];
}

export interface NFTDeployment {
  id: string;
  userId: string;
  metadata: NFTMetadata;
  pricing: NFTPricing;
  assetUrl: string;
  assetType: string;
  selectedPlatforms: PlatformId[];
  selectedChains: ChainId[];
  status: "draft" | "deploying" | "live" | "failed";
  deploymentProgress: PlatformDeploymentStatus[];
  contractAddresses?: Record<PlatformId, string>;
  tokenIds?: Record<PlatformId, string>;
  marketplaceUrls?: Record<PlatformId, string>;
  createdAt: string;
  deployedAt?: string;
}

export interface PlatformDeploymentStatus {
  platform: PlatformId;
  chain: ChainId;
  status: "pending" | "uploading" | "minting" | "confirming" | "complete" | "failed";
  progress: number;
  txHash?: string;
  error?: string;
}

export interface SocialToken {
  id: string;
  platform: SocialPlatformId;
  platformId: string;
  content: string;
  contentType: "post" | "essay" | "cast";
  collectEnabled: boolean;
  collectPrice?: number;
  collectLimit?: number;
  collectCount: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface BridgeTransaction {
  id: string;
  sourceChain: ChainId;
  destChain: ChainId;
  sourceTokenAddress: string;
  destTokenAddress?: string;
  sourceTxHash: string;
  destTxHash?: string;
  bridgeProvider: "wormhole" | "portal" | "allbridge";
  bridgeFee: number;
  status: "pending" | "confirming" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  assetName: string;
  assetType: "nft" | "token" | "native";
}

export interface PlatformConnection {
  id: string;
  platform: PlatformId | SocialPlatformId;
  connected: boolean;
  accessToken?: string;
  platformUserId?: string;
  platformMetadata?: Record<string, any>;
  connectedAt: string;
  lastUsedAt?: string;
  permissions: string[];
}

export interface AnalyticsData {
  totalRevenue: number;
  totalMints: number;
  uniqueOwners: number;
  growthRate: number;
  revenueByPlatform: { platform: string; revenue: number; percentage: number }[];
  revenueByChain: { chain: string; revenue: number; percentage: number }[];
  salesOverTime: { date: string; revenue: number }[];
  topNFTs: { id: string; name: string; revenue: number; sales: number }[];
  insights: string[];
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: AIAction[];
}

export interface AIAction {
  type: "start-minting" | "apply-recommendation" | "deploy-contract" | "use-template";
  label: string;
  data?: Record<string, any>;
}
