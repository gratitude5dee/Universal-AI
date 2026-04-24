import { supabase } from "@/integrations/supabase/client";

async function invokeProviderFunction<TInput, TOutput>(
  functionName: string,
  body: TInput,
): Promise<TOutput> {
  const result = await supabase.functions.invoke(functionName, { body });
  if (result.error) {
    throw result.error;
  }
  return result.data as TOutput;
}

export interface ClankerPreflightInput {
  name: string;
  symbol: string;
  description: string;
  walletAddress: string;
  chainId: number;
  imageUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  devBuyEth?: number;
  vestingDays?: number;
}

export interface ClankerPreflightResponse {
  mode: "mock" | "configured";
  launchProvider: "clanker";
  executionProvider: "clanker";
  walletProvider: "thirdweb_evm";
  custodyMode: "external_user";
  preflightId: string;
  chainId: number;
  warnings: string[];
  nextAction: string;
}

export interface BagsLaunchSessionInput {
  name: string;
  symbol: string;
  description: string;
  launchWallet: string;
  imageUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  socialHandle?: string;
  socialProvider?: "twitter" | "farcaster" | "tiktok";
}

export interface BagsLaunchSessionResponse {
  mode: "mock" | "configured";
  launchProvider: "bags";
  executionProvider: "bags";
  walletProvider: "solana_wallet_standard";
  custodyMode: "external_user";
  sessionId: string;
  warnings: string[];
  adapterMode: "route_scoped";
  nextAction: string;
}

export interface BankrAutomationInput {
  prompt: string;
  chain: string;
  objective: "research" | "automation" | "profile";
}

export interface BankrAutomationResponse {
  mode: "mock" | "configured";
  executionProvider: "bankr";
  launchProvider?: "bankr";
  guidance: string;
  nextAction: string;
}

export interface EngineAdminActionInput {
  action: string;
  chainId: number;
  contractAddress: string;
  method: string;
  params?: unknown[];
}

export interface EngineAdminActionResponse {
  mode: "mock" | "configured";
  executionProvider: "thirdweb_engine";
  requestId: string;
  status: "ready" | "submitted";
  nextAction: string;
}

export function createClankerPreflight(input: ClankerPreflightInput) {
  return invokeProviderFunction<ClankerPreflightInput, ClankerPreflightResponse>(
    "launch-clanker-preflight",
    input,
  );
}

export function createBagsLaunchSession(input: BagsLaunchSessionInput) {
  return invokeProviderFunction<BagsLaunchSessionInput, BagsLaunchSessionResponse>(
    "launch-bags-session",
    input,
  );
}

export function createBankrAutomationSession(input: BankrAutomationInput) {
  return invokeProviderFunction<BankrAutomationInput, BankrAutomationResponse>(
    "bankr-automation-session",
    input,
  );
}

export function createEngineAdminAction(input: EngineAdminActionInput) {
  return invokeProviderFunction<EngineAdminActionInput, EngineAdminActionResponse>(
    "engine-admin-execute",
    input,
  );
}
