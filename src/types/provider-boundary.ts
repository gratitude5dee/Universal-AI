export type WalletProvider =
  | "thirdweb_evm"
  | "solana_wallet_standard"
  | "crossmint_custodial";

export type ExecutionProvider =
  | "thirdweb_engine"
  | "crossmint"
  | "bags"
  | "clanker"
  | "bankr";

export type LaunchProvider = "clanker" | "bags" | "bankr";

export type CustodyMode = "external_user" | "delegated_server" | "custodial_agent";

export type ProviderMaturity = "supported" | "advanced" | "backlog" | "server";

export type ProviderFeature =
  | "evm_wallet_connect"
  | "evm_browser_execution"
  | "evm_admin_execution"
  | "base_creator_launch"
  | "solana_creator_launch"
  | "solana_fee_claim"
  | "solana_swap"
  | "custodial_treasury"
  | "custodial_wallet_create"
  | "trading_automation"
  | "market_research"
  | "provider_profile"
  | "base_widget"
  | "observability_indexing";

export interface ProviderCapability {
  id: WalletProvider | ExecutionProvider | LaunchProvider | "thirdweb" | "onchainkit";
  label: string;
  description: string;
  maturity: ProviderMaturity;
  owner: "wallet" | "execution" | "launch" | "ui";
  features: ProviderFeature[];
  chains: string[];
  custodyModes: CustodyMode[];
  notes: string[];
  secretType?: string;
  docsHref?: string;
}

export interface ProviderCapabilityMatrix {
  primary: ProviderCapability;
  secondary: ProviderCapability[];
  forbidden: string[];
}

export interface ProviderConnection {
  id: string;
  userId: string;
  providerId: ProviderCapability["id"];
  status: "pending" | "ready" | "optional" | "connected" | "server_managed" | "error";
  secretType?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalWalletLink {
  id: string;
  userId: string;
  walletProvider: WalletProvider;
  custodyMode: "external_user";
  address: string;
  chain: string;
  linkedAt: string;
  isPrimary: boolean;
}

export interface CustodialWallet {
  id: string;
  ownerId: string;
  walletProvider: Extract<WalletProvider, "crossmint_custodial">;
  custodyMode: "custodial_agent";
  chain: string;
  walletAddress: string;
  walletId?: string | null;
  label?: string | null;
  createdAt: string;
}

export interface LaunchExecutionStep {
  id: string;
  label: string;
  provider: ExecutionProvider | LaunchProvider;
  status: "pending" | "ready" | "submitted" | "confirmed" | "failed";
  details?: string;
  transactionHash?: string | null;
}

export interface CreatorToken {
  id: string;
  creatorId: string;
  launchProvider: LaunchProvider;
  executionProvider: ExecutionProvider;
  chain: string;
  name: string;
  symbol: string;
  contractAddress?: string | null;
  metadataUri?: string | null;
  status: "draft" | "preflight" | "submitted" | "live" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface TokenLaunchJob {
  id: string;
  creatorId: string;
  launchProvider: LaunchProvider;
  executionProvider: ExecutionProvider;
  walletProvider: WalletProvider;
  custodyMode: CustodyMode;
  chain: string;
  name: string;
  symbol: string;
  status: "draft" | "preflight" | "awaiting_signature" | "submitted" | "confirmed" | "failed";
  steps: LaunchExecutionStep[];
  createdAt: string;
  updatedAt: string;
}

export interface FeeClaimJob {
  id: string;
  creatorId: string;
  executionProvider: ExecutionProvider;
  chain: string;
  tokenAddress: string;
  claimableAmount?: string | null;
  status: "ready" | "submitted" | "confirmed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface DistributionCampaign {
  id: string;
  creatorId: string;
  name: string;
  channel: "base" | "solana" | "social" | "email" | "community";
  provider: ExecutionProvider | LaunchProvider | "thirdweb";
  status: "draft" | "scheduled" | "active" | "completed" | "failed";
  startedAt?: string | null;
  endedAt?: string | null;
}

export interface TreasuryTransferRequest {
  id: string;
  creatorId: string;
  executionProvider: ExecutionProvider;
  custodyMode: CustodyMode;
  chain: string;
  fromWallet: string;
  toWallet: string;
  amount: string;
  assetSymbol: string;
  status: "draft" | "submitted" | "confirmed" | "flagged" | "failed";
  createdAt: string;
  updatedAt: string;
}
