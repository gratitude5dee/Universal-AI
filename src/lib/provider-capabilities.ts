import type {
  ProviderCapability,
  ProviderCapabilityMatrix,
  ProviderFeature,
} from "@/types/provider-boundary";

export const PROVIDER_CAPABILITIES: Record<string, ProviderCapability> = {
  thirdweb: {
    id: "thirdweb",
    label: "thirdweb",
    description: "Primary EVM wallet, contract, NFT, and browser execution layer.",
    maturity: "supported",
    owner: "wallet",
    features: ["evm_wallet_connect", "evm_browser_execution"],
    chains: ["base", "ethereum", "polygon", "arbitrum"],
    custodyModes: ["external_user"],
    notes: [
      "Primary creator-facing EVM wallet stack.",
      "Owns wallet connect, NFT minting, token gating, and user-signed EVM writes.",
    ],
    docsHref: "https://portal.thirdweb.com/",
  },
  thirdweb_engine: {
    id: "thirdweb_engine",
    label: "thirdweb Engine",
    description: "Delegated EVM execution for server-side and admin-owned contract actions.",
    maturity: "server",
    owner: "execution",
    features: ["evm_admin_execution", "observability_indexing"],
    chains: ["base", "ethereum", "polygon", "arbitrum"],
    custodyModes: ["delegated_server"],
    notes: [
      "Do not use browser wallets for platform-owned admin flows.",
      "Not a replacement for Clanker or Bags launch providers.",
    ],
    secretType: "thirdweb_engine_access_token",
    docsHref: "https://portal.thirdweb.com/engine",
  },
  crossmint: {
    id: "crossmint",
    label: "Crossmint",
    description: "Custodial wallet creation and guarded Solana treasury execution.",
    maturity: "supported",
    owner: "execution",
    features: ["custodial_wallet_create", "custodial_treasury"],
    chains: ["solana", "base", "ethereum", "polygon"],
    custodyModes: ["custodial_agent"],
    notes: [
      "Reserved for agent wallets, treasury administration, and MCP automation.",
      "Forbidden as the primary creator wallet or app-wide wallet UX.",
    ],
    secretType: "crossmint_api_key",
    docsHref: "https://docs.crossmint.com/",
  },
  bags: {
    id: "bags",
    label: "Bags",
    description: "Creator-facing Solana launch, fee-claim, and swap flow provider.",
    maturity: "supported",
    owner: "launch",
    features: ["solana_creator_launch", "solana_fee_claim", "solana_swap"],
    chains: ["solana"],
    custodyModes: ["external_user", "delegated_server"],
    notes: [
      "Owns Solana launch metadata, fee-share, claims, and swap quoting.",
      "All web3.js coupling must be isolated behind a route-scoped adapter boundary.",
    ],
    secretType: "bags_api_key",
    docsHref: "https://dev.bags.fm",
  },
  clanker: {
    id: "clanker",
    label: "Clanker",
    description: "Default Base launch provider for creator tokens and reward management.",
    maturity: "supported",
    owner: "launch",
    features: ["base_creator_launch"],
    chains: ["base", "ethereum", "arbitrum", "unichain"],
    custodyModes: ["external_user", "delegated_server"],
    notes: [
      "Default Base creator-token deployment path.",
      "Pairs with thirdweb wallet connect and server preflight.",
    ],
    docsHref: "https://www.npmjs.com/package/clanker-sdk",
  },
  bankr: {
    id: "bankr",
    label: "Bankr",
    description: "Advanced automation, research, trading, and optional alternate launch execution.",
    maturity: "advanced",
    owner: "execution",
    features: ["trading_automation", "market_research", "provider_profile", "base_creator_launch"],
    chains: ["base", "ethereum", "polygon", "solana", "unichain"],
    custodyModes: ["external_user", "delegated_server"],
    notes: [
      "Opt-in advanced automation only.",
      "Should not block core Clanker or Bags launch paths.",
    ],
    secretType: "bankr_api_key",
    docsHref: "https://docs.bankr.bot",
  },
  onchainkit: {
    id: "onchainkit",
    label: "OnchainKit",
    description: "Optional Base UI widgets for identity, checkout, and transaction experiences.",
    maturity: "advanced",
    owner: "ui",
    features: ["base_widget"],
    chains: ["base"],
    custodyModes: ["external_user"],
    notes: [
      "Never the root app wallet or auth provider.",
      "Only use inside isolated Base widgets layered on top of thirdweb.",
    ],
    docsHref: "https://onchainkit.xyz",
  },
};

export const PROVIDER_BOUNDARIES: Record<ProviderFeature, ProviderCapabilityMatrix> = {
  evm_wallet_connect: {
    primary: PROVIDER_CAPABILITIES.thirdweb,
    secondary: [PROVIDER_CAPABILITIES.onchainkit],
    forbidden: ["Crossmint as primary wallet UX"],
  },
  evm_browser_execution: {
    primary: PROVIDER_CAPABILITIES.thirdweb,
    secondary: [],
    forbidden: ["Crossmint browser wallet UX"],
  },
  evm_admin_execution: {
    primary: PROVIDER_CAPABILITIES.thirdweb_engine,
    secondary: [],
    forbidden: ["Browser wallet admin execution"],
  },
  base_creator_launch: {
    primary: PROVIDER_CAPABILITIES.clanker,
    secondary: [PROVIDER_CAPABILITIES.bankr],
    forbidden: ["Crossmint replacing Clanker", "Engine as direct creator launch provider"],
  },
  solana_creator_launch: {
    primary: PROVIDER_CAPABILITIES.bags,
    secondary: [],
    forbidden: ["thirdweb as Solana launch provider", "Crossmint as Solana launch provider", "OnchainKit as launcher"],
  },
  solana_fee_claim: {
    primary: PROVIDER_CAPABILITIES.bags,
    secondary: [],
    forbidden: ["thirdweb Engine for Solana fee claims"],
  },
  solana_swap: {
    primary: PROVIDER_CAPABILITIES.bags,
    secondary: [],
    forbidden: ["EVM wallet providers owning Solana swap flows"],
  },
  custodial_treasury: {
    primary: PROVIDER_CAPABILITIES.crossmint,
    secondary: [],
    forbidden: ["thirdweb as custody backend"],
  },
  custodial_wallet_create: {
    primary: PROVIDER_CAPABILITIES.crossmint,
    secondary: [],
    forbidden: ["App-wide creator wallet creation via Crossmint"],
  },
  trading_automation: {
    primary: PROVIDER_CAPABILITIES.bankr,
    secondary: [PROVIDER_CAPABILITIES.clanker],
    forbidden: ["thirdweb as AI trading layer"],
  },
  market_research: {
    primary: PROVIDER_CAPABILITIES.bankr,
    secondary: [],
    forbidden: ["Launching core features through research-only tooling"],
  },
  provider_profile: {
    primary: PROVIDER_CAPABILITIES.bankr,
    secondary: [],
    forbidden: ["Requiring Bankr for core creator profiles"],
  },
  base_widget: {
    primary: PROVIDER_CAPABILITIES.onchainkit,
    secondary: [PROVIDER_CAPABILITIES.thirdweb],
    forbidden: ["Using OnchainKit as the app root wallet stack"],
  },
  observability_indexing: {
    primary: PROVIDER_CAPABILITIES.thirdweb_engine,
    secondary: [PROVIDER_CAPABILITIES.bags],
    forbidden: ["Direct client polling as the only analytics source"],
  },
};

export function getProviderCapability(id: string): ProviderCapability | null {
  return PROVIDER_CAPABILITIES[id] ?? null;
}

export function getProviderCapabilitiesByMaturity(maturity: ProviderCapability["maturity"]) {
  return Object.values(PROVIDER_CAPABILITIES).filter((provider) => provider.maturity === maturity);
}

export function getProviderBoundary(feature: ProviderFeature): ProviderCapabilityMatrix {
  return PROVIDER_BOUNDARIES[feature];
}

export function supportsProviderFeature(id: string, feature: ProviderFeature) {
  return Boolean(PROVIDER_CAPABILITIES[id]?.features.includes(feature));
}

export function getProvidersForFeature(feature: ProviderFeature) {
  return Object.values(PROVIDER_CAPABILITIES).filter((provider) => provider.features.includes(feature));
}

export function getPreferredProviderForFeature(feature: ProviderFeature) {
  return PROVIDER_BOUNDARIES[feature].primary;
}

export function getProviderSecretType(id: string) {
  return PROVIDER_CAPABILITIES[id]?.secretType ?? null;
}
