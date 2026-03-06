// Central chain metadata for EVM + Story.
// We intentionally keep this file dependency-light: the UI relies on it even if thirdweb chain objects change.

export type ChainKey =
  | "ethereum"
  | "base"
  | "polygon"
  | "sepolia"
  | "baseSepolia"
  | "polygonAmoy"
  | "story"
  | "storyAeneid";

export interface ChainMeta {
  key: ChainKey;
  chainId: number;
  name: string;
  nativeSymbol: string;
  rpcUrl: string;
  explorerBaseUrl: string;
  isTestnet: boolean;
}

export const CHAIN_META: Record<ChainKey, ChainMeta> = {
  ethereum: {
    key: "ethereum",
    chainId: 1,
    name: "Ethereum",
    nativeSymbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    explorerBaseUrl: "https://etherscan.io",
    isTestnet: false,
  },
  base: {
    key: "base",
    chainId: 8453,
    name: "Base",
    nativeSymbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorerBaseUrl: "https://basescan.org",
    isTestnet: false,
  },
  polygon: {
    key: "polygon",
    chainId: 137,
    name: "Polygon",
    nativeSymbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    explorerBaseUrl: "https://polygonscan.com",
    isTestnet: false,
  },
  story: {
    key: "story",
    chainId: 1514,
    name: "Story Mainnet",
    nativeSymbol: "IP",
    rpcUrl: "https://rpc.story.foundation",
    explorerBaseUrl: "https://explorer.story.foundation",
    isTestnet: false,
  },
  sepolia: {
    key: "sepolia",
    chainId: 11155111,
    name: "Sepolia",
    nativeSymbol: "ETH",
    rpcUrl: "https://rpc.sepolia.org",
    explorerBaseUrl: "https://sepolia.etherscan.io",
    isTestnet: true,
  },
  baseSepolia: {
    key: "baseSepolia",
    chainId: 84532,
    name: "Base Sepolia",
    nativeSymbol: "ETH",
    rpcUrl: "https://sepolia.base.org",
    explorerBaseUrl: "https://sepolia.basescan.org",
    isTestnet: true,
  },
  polygonAmoy: {
    key: "polygonAmoy",
    chainId: 80002,
    name: "Polygon Amoy",
    nativeSymbol: "MATIC",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorerBaseUrl: "https://amoy.polygonscan.com",
    isTestnet: true,
  },
  storyAeneid: {
    key: "storyAeneid",
    chainId: 1315,
    name: "Story Aeneid Testnet",
    nativeSymbol: "IP",
    rpcUrl: "https://testnet.rpc.story.foundation",
    explorerBaseUrl: "https://testnet.explorer.story.foundation",
    isTestnet: true,
  },
};

export function getChainMetaByChainId(chainId: number | null | undefined): ChainMeta | null {
  if (!chainId) return null;
  for (const meta of Object.values(CHAIN_META)) {
    if (meta.chainId === chainId) return meta;
  }
  return null;
}

export function toExplorerTxUrl(chainId: number, txHash: string): string | null {
  const meta = getChainMetaByChainId(chainId);
  if (!meta) return null;
  return `${meta.explorerBaseUrl}/tx/${txHash}`;
}

export function toExplorerAddressUrl(chainId: number, address: string): string | null {
  const meta = getChainMetaByChainId(chainId);
  if (!meta) return null;
  return `${meta.explorerBaseUrl}/address/${address}`;
}

