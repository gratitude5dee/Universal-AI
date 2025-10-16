// Core RWA Types
export type RWAAssetType = 
  | 'real-estate'
  | 'financial-instruments'
  | 'art-collectibles'
  | 'commodities'
  | 'business-equity'
  | 'intellectual-property'
  | 'revenue-streams'
  | 'infrastructure';

export type ComplianceType = 'reg-cf' | 'reg-d-506b' | 'reg-d-506c' | 'reg-a-plus';
export type InvestorType = 'accredited' | 'non-accredited' | 'institutional';
export type DistributionFrequency = 'monthly' | 'quarterly' | 'annually' | 'at-maturity';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

// Stablecoin Types
export interface Stablecoin {
  symbol: string;
  name: string;
  type: 'fiat-backed' | 'algorithmic' | 'yield-bearing';
  chains: string[];
  currentYield?: number;
  marketCap: number;
  dailyVolume: number;
  icon: string;
  isNew?: boolean;
}

export interface SwapRoute {
  fromToken: string;
  toToken: string;
  routePath: string[];
  rate: number;
  priceImpact: number;
  gasCost: number;
  platformFee: number;
  estimatedOutput: number;
  executionTime: number;
  dex: string;
}

export interface SwapSettings {
  slippageTolerance: number;
  transactionSpeed: 'standard' | 'fast' | 'instant';
  useMultipleDEXes: boolean;
  allowSplitRoutes: boolean;
  prioritize: 'best-price' | 'fastest' | 'balanced';
  enableMEVProtection: boolean;
}

// RWA Asset Types
export interface RWAAsset {
  id: string;
  userId: string;
  assetType: RWAAssetType;
  tokenSymbol: string;
  tokenName: string;
  blockchain: string;
  contractAddress?: string;
  totalSupply: number;
  tokenizedPercentage: number;
  valuation: number;
  pricePerToken: number;
  metadata: Record<string, any>;
  status: 'draft' | 'pending' | 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyDetails {
  address: string;
  propertyType: 'single-family' | 'multi-family' | 'commercial' | 'land' | 'mixed-use';
  squareFootage: number;
  yearBuilt: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  currentStatus: 'owner-occupied' | 'tenant-occupied' | 'vacant' | 'under-construction';
  monthlyRent?: number;
  occupancyRate?: number;
  annualExpenses?: number;
  noi?: number;
  capRate?: number;
}

export interface FinancialInstrument {
  instrumentType: 'treasury' | 'corporate-bond' | 'private-credit' | 'commodity-backed';
  faceValue: number;
  couponRate: number;
  maturityDate: Date;
  currentYield: number;
  creditRating?: string;
  cusip?: string;
}

export interface MarketplaceListing {
  id: string;
  assetId: string;
  sellerId: string;
  tokenCount: number;
  pricePerToken: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  fundingProgress: number;
  investorCount: number;
  closesAt: Date;
  asset: RWAAsset;
  propertyDetails?: PropertyDetails;
  financialDetails?: FinancialInstrument;
}

export interface RWAHolding {
  id: string;
  userId: string;
  assetId: string;
  tokenCount: number;
  entryPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  yieldEarned: number;
  unrealizedGain: number;
  distributions: Distribution[];
  asset: RWAAsset;
}

export interface Distribution {
  id: string;
  assetId: string;
  date: Date;
  amountPerToken: number;
  totalAmount: number;
  paymentToken: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  transactionHash?: string;
}

// Yield Optimization
export interface YieldOpportunity {
  id: string;
  protocol: string;
  strategyType: 'lending' | 'staking' | 'liquidity-pool' | 'yield-bearing-stable';
  token: string;
  currentAPY: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  minDeposit: number;
  lockupPeriod?: number;
  estimatedGas: number;
}

export interface YieldPosition {
  id: string;
  userId: string;
  protocol: string;
  token: string;
  depositedAmount: number;
  currentValue: number;
  yieldEarned: number;
  apy: number;
  enteredAt: Date;
  autoCompound: boolean;
}

// Compliance
export interface KYCVerification {
  id: string;
  userId: string;
  provider: 'persona' | 'sumsub' | 'securitize';
  verificationId: string;
  status: VerificationStatus;
  verificationLevel: 'basic' | 'advanced' | 'accredited';
  isAccredited: boolean;
  accreditationMethod?: 'income' | 'net-worth' | 'professional';
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceDocument {
  id: string;
  userId: string;
  assetId?: string;
  docType: 'id' | 'proof-of-address' | 'appraisal' | 'title-deed' | 'tax-return' | 'income-verification';
  fileUrl: string;
  fileName: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface TaxDocument {
  id: string;
  userId: string;
  taxYear: number;
  formType: '1099-DIV' | '1099-B' | 'K-1' | '8949';
  totalAmount: number;
  documentUrl: string;
  generatedAt: Date;
}
