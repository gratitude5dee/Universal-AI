import { PortfolioAsset } from '@/types/on-chain';

export const mockPortfolioAssets: PortfolioAsset[] = [
  // Fungible Tokens
  {
    id: '1',
    type: 'fungible',
    name: 'WZRD Token',
    symbol: 'WZRD',
    chain: 'solana',
    balance: 12500,
    value: 25425,
    change24h: 35.6,
    icon: '🧙',
  },
  {
    id: '2',
    type: 'fungible',
    name: 'Ethereum',
    symbol: 'ETH',
    chain: 'ethereum',
    balance: 5.5,
    value: 18920,
    change24h: 2.3,
    icon: 'Ξ',
  },
  {
    id: '3',
    type: 'fungible',
    name: 'Solana',
    symbol: 'SOL',
    chain: 'solana',
    balance: 250,
    value: 15750,
    change24h: -1.2,
    icon: '◎',
  },
  {
    id: '4',
    type: 'fungible',
    name: 'BONK',
    symbol: 'BONK',
    chain: 'solana',
    balance: 1000000,
    value: 850,
    change24h: -8.7,
    icon: '🐕',
  },

  // NFTs
  {
    id: '5',
    type: 'nft',
    name: 'Cyber Punk #4271',
    symbol: 'CPUNK',
    chain: 'ethereum',
    balance: 1,
    value: 12400,
    change24h: 5.2,
    icon: '🎨',
  },
  {
    id: '6',
    type: 'nft',
    name: 'Bored Wizard #823',
    symbol: 'BWIZ',
    chain: 'ethereum',
    balance: 1,
    value: 8750,
    change24h: -2.1,
    icon: '🧙‍♂️',
  },

  // LP Tokens
  {
    id: '7',
    type: 'lp-token',
    name: 'WZRD-SOL LP',
    symbol: 'WZRD-SOL',
    chain: 'solana',
    balance: 450,
    value: 11250,
    change24h: 12.4,
    icon: '💧',
  },
  {
    id: '8',
    type: 'lp-token',
    name: 'ETH-USDC LP',
    symbol: 'ETH-USDC',
    chain: 'ethereum',
    balance: 0.25,
    value: 9500,
    change24h: 3.8,
    icon: '💧',
  },

  // RWAs
  {
    id: '9',
    type: 'rwa',
    name: 'NYC Property Token',
    symbol: 'NYCPROP',
    chain: 'ethereum',
    balance: 50,
    value: 25000,
    change24h: 0.5,
    icon: '🏢',
  },
  {
    id: '10',
    type: 'rwa',
    name: 'Gold-Backed Token',
    symbol: 'XGLD',
    chain: 'polygon',
    balance: 10,
    value: 19500,
    change24h: 1.2,
    icon: '🥇',
  },
];

export const getTotalPortfolioValue = () => {
  return mockPortfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
};

export const getAssetsByType = (type: PortfolioAsset['type']) => {
  return mockPortfolioAssets.filter(asset => asset.type === type);
};

export const getAssetsByChain = (chain: string) => {
  return mockPortfolioAssets.filter(asset => asset.chain === chain);
};
