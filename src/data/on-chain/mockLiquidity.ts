import { LiquidityPosition, LiquidityOpportunity } from '@/types/on-chain';

export const mockLiquidityPositions: LiquidityPosition[] = [
  {
    id: '1',
    protocol: 'Raydium',
    chain: 'solana',
    pool: 'WZRD-SOL',
    tokens: [
      { symbol: 'WZRD', amount: 2500 },
      { symbol: 'SOL', amount: 50 },
    ],
    value: 11250,
    poolShare: 2.5,
    apy: 45.8,
    dailyEarnings: 14.12,
    unclaimedRewards: 125.50,
  },
  {
    id: '2',
    protocol: 'Uniswap V3',
    chain: 'ethereum',
    pool: 'ETH-USDC',
    tokens: [
      { symbol: 'ETH', amount: 2.5 },
      { symbol: 'USDC', amount: 8500 },
    ],
    value: 17000,
    poolShare: 0.8,
    apy: 28.5,
    dailyEarnings: 13.27,
    unclaimedRewards: 42.30,
  },
  {
    id: '3',
    protocol: 'Orca',
    chain: 'solana',
    pool: 'SOL-USDC',
    tokens: [
      { symbol: 'SOL', amount: 100 },
      { symbol: 'USDC', amount: 6300 },
    ],
    value: 12600,
    poolShare: 1.2,
    apy: 32.4,
    dailyEarnings: 11.18,
    unclaimedRewards: 78.90,
  },
];

export const mockLiquidityOpportunities: LiquidityOpportunity[] = [
  {
    id: 'opp-1',
    protocol: 'Raydium',
    chain: 'solana',
    pool: 'BONK-SOL',
    apy: 78.5,
    tvl: 2400000,
    risk: 'high',
    matchScore: 92,
    compatibleAssets: ['BONK', 'SOL'],
  },
  {
    id: 'opp-2',
    protocol: 'Curve',
    chain: 'ethereum',
    pool: 'stETH-ETH',
    apy: 12.3,
    tvl: 180000000,
    risk: 'low',
    matchScore: 88,
    compatibleAssets: ['ETH'],
  },
  {
    id: 'opp-3',
    protocol: 'Balancer',
    chain: 'polygon',
    pool: 'MATIC-USDC-USDT',
    apy: 25.7,
    tvl: 5600000,
    risk: 'medium',
    matchScore: 85,
    compatibleAssets: ['MATIC'],
  },
  {
    id: 'opp-4',
    protocol: 'Orca',
    chain: 'solana',
    pool: 'WZRD-USDC',
    apy: 52.4,
    tvl: 850000,
    risk: 'medium',
    matchScore: 94,
    compatibleAssets: ['WZRD'],
  },
  {
    id: 'opp-5',
    protocol: 'Uniswap V3',
    chain: 'base',
    pool: 'ETH-USDC',
    apy: 18.9,
    tvl: 12000000,
    risk: 'low',
    matchScore: 82,
    compatibleAssets: ['ETH'],
  },
];

export const getTotalLiquidityValue = () => {
  return mockLiquidityPositions.reduce((sum, pos) => sum + pos.value, 0);
};

export const getAverageAPY = () => {
  const total = mockLiquidityPositions.reduce((sum, pos) => sum + pos.apy, 0);
  return total / mockLiquidityPositions.length;
};

export const getTotalDailyEarnings = () => {
  return mockLiquidityPositions.reduce((sum, pos) => sum + pos.dailyEarnings, 0);
};

export const getTotalUnclaimedRewards = () => {
  return mockLiquidityPositions.reduce((sum, pos) => sum + pos.unclaimedRewards, 0);
};
