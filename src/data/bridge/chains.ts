import { Chain } from "@/types/bridge";

export const chains: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    icon: "⟠",
    gasToken: "ETH",
    rpcUrl: "https://eth-mainnet.alchemyapi.io/v2/",
    explorer: "https://etherscan.io"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    color: "#14F195",
    icon: "◎",
    gasToken: "SOL",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorer: "https://solscan.io"
  },
  {
    id: "base",
    name: "Base",
    symbol: "ETH",
    color: "#0052FF",
    icon: "🔵",
    gasToken: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org"
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    color: "#8247E5",
    icon: "◆",
    gasToken: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com"
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "ETH",
    color: "#FF0420",
    icon: "🔴",
    gasToken: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io"
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    color: "#28A0F0",
    icon: "🔷",
    gasToken: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io"
  }
];

export const getChainById = (id: string) => chains.find(c => c.id === id);
export const getChainColor = (id: string) => chains.find(c => c.id === id)?.color || "#000000";
