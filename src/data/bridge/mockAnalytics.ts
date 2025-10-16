import { AnalyticsData } from "@/types/bridge";

export const mockAnalytics: AnalyticsData = {
  totalRevenue: 45247,
  totalMints: 1847,
  uniqueOwners: 1256,
  growthRate: 23,
  revenueByPlatform: [
    { platform: "OpenSea", revenue: 18450, percentage: 41 },
    { platform: "Zora", revenue: 12230, percentage: 27 },
    { platform: "Magic Eden", revenue: 8920, percentage: 20 },
    { platform: "Lens Protocol", revenue: 3450, percentage: 8 },
    { platform: "Farcaster", revenue: 1680, percentage: 4 },
    { platform: "Mirror", revenue: 517, percentage: 1 }
  ],
  revenueByChain: [
    { chain: "Ethereum", revenue: 20850, percentage: 46 },
    { chain: "Solana", revenue: 14280, percentage: 32 },
    { chain: "Base", revenue: 6120, percentage: 14 },
    { chain: "Polygon", revenue: 2997, percentage: 7 },
    { chain: "Optimism", revenue: 1000, percentage: 2 }
  ],
  salesOverTime: [
    { date: "2025-10-01", revenue: 1200 },
    { date: "2025-10-03", revenue: 850 },
    { date: "2025-10-06", revenue: 1650 },
    { date: "2025-10-08", revenue: 920 },
    { date: "2025-10-11", revenue: 2100 },
    { date: "2025-10-13", revenue: 1750 },
    { date: "2025-10-16", revenue: 2850 }
  ],
  topNFTs: [
    { id: "1", name: "Sunset Dreams v2", revenue: 12450, sales: 89 },
    { id: "2", name: "Abstract Waves Collection", revenue: 8920, sales: 156 },
    { id: "3", name: "Digital Portrait #42", revenue: 6230, sales: 34 },
    { id: "4", name: "Generative Art Series", revenue: 4810, sales: 78 },
    { id: "5", name: "Music NFT - Single Drop", revenue: 3450, sales: 234 }
  ],
  insights: [
    "Your Zora mints on Base have 3x lower fees than OpenSea with similar sales velocity",
    "Lens Protocol posts with unlockable content see 45% higher collect rates",
    "Your collectors prefer editions (67%) over 1/1s (33%)",
    "Optimal posting time: Tuesdays 2-4 PM PST based on historical performance"
  ]
};
