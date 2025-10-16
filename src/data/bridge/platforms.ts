import { Platform } from "@/types/bridge";

export const platforms: Platform[] = [
  {
    id: "opensea",
    name: "OpenSea",
    chains: ["ethereum", "polygon", "arbitrum"],
    icon: "🌊",
    estimatedCost: { ethereum: 2.50, polygon: 0.08, arbitrum: 0.15, solana: 0, base: 0, optimism: 0 },
    estimatedTime: { ethereum: 120, polygon: 30, arbitrum: 45, solana: 0, base: 0, optimism: 0 },
    features: ["Collections", "Lazy Minting", "Offers"],
    description: "World's largest NFT marketplace"
  },
  {
    id: "zora",
    name: "Zora",
    chains: ["base", "optimism", "ethereum"],
    icon: "⚡",
    estimatedCost: { base: 0.08, optimism: 0.10, ethereum: 2.20, solana: 0, polygon: 0, arbitrum: 0 },
    estimatedTime: { base: 30, optimism: 35, ethereum: 110, solana: 0, polygon: 0, arbitrum: 0 },
    features: ["Free Minting", "Editions", "Creator Tools"],
    description: "Creator-first protocol for editions"
  },
  {
    id: "magiceden",
    name: "Magic Eden",
    chains: ["solana"],
    icon: "✨",
    estimatedCost: { solana: 0.05, ethereum: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { solana: 5, ethereum: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Launchpad", "Gaming NFTs", "Rewards"],
    description: "Leading Solana NFT marketplace"
  },
  {
    id: "rarible",
    name: "Rarible",
    chains: ["ethereum", "polygon"],
    icon: "🎨",
    estimatedCost: { ethereum: 1.80, polygon: 0.06, solana: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 100, polygon: 25, solana: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Multi-chain", "Governance", "Aggregator"],
    description: "Community-owned NFT marketplace"
  },
  {
    id: "foundation",
    name: "Foundation",
    chains: ["ethereum"],
    icon: "🏛️",
    estimatedCost: { ethereum: 3.20, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 130, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Curated", "Auctions", "Collections"],
    description: "Curated platform for digital art"
  },
  {
    id: "superrare",
    name: "SuperRare",
    chains: ["ethereum"],
    icon: "💎",
    estimatedCost: { ethereum: 4.50, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 150, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Premium", "1/1 Art", "Curation"],
    description: "Premium 1/1 digital art marketplace"
  },
  {
    id: "blur",
    name: "Blur",
    chains: ["ethereum"],
    icon: "🌪️",
    estimatedCost: { ethereum: 2.20, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 90, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Pro Trading", "Aggregator", "Airdrops"],
    description: "Pro NFT marketplace and aggregator"
  },
  {
    id: "manifold",
    name: "Manifold",
    chains: ["ethereum"],
    icon: "🎭",
    estimatedCost: { ethereum: 0.00, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 45, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Custom Contracts", "Extensions", "Creator Tools"],
    description: "Custom smart contracts for creators"
  },
  {
    id: "looksrare",
    name: "LooksRare",
    chains: ["ethereum"],
    icon: "👀",
    estimatedCost: { ethereum: 1.90, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    estimatedTime: { ethereum: 95, solana: 0, polygon: 0, base: 0, optimism: 0, arbitrum: 0 },
    features: ["Rewards", "Staking", "Trading"],
    description: "Community-first NFT marketplace"
  }
];

export const getPlatformById = (id: string) => platforms.find(p => p.id === id);
export const getPlatformsByChain = (chainId: string) => platforms.filter(p => p.chains.includes(chainId as any));
