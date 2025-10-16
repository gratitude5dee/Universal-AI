import { Chain } from '@/types/on-chain';

export const chains: Chain[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#14F195',
    icon: '◎',
    gasToken: 'SOL',
    avgGasPrice: 0.00025,
    congestionLevel: 'low',
    ecosystemFit: 95,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    icon: 'Ξ',
    gasToken: 'ETH',
    avgGasPrice: 3.5,
    congestionLevel: 'medium',
    ecosystemFit: 90,
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    color: '#0052FF',
    icon: '🔵',
    gasToken: 'ETH',
    avgGasPrice: 0.05,
    congestionLevel: 'low',
    ecosystemFit: 85,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
    icon: '◆',
    gasToken: 'MATIC',
    avgGasPrice: 0.02,
    congestionLevel: 'low',
    ecosystemFit: 80,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    color: '#28A0F0',
    icon: '🔷',
    gasToken: 'ETH',
    avgGasPrice: 0.1,
    congestionLevel: 'low',
    ecosystemFit: 82,
  },
];

export const getChainById = (id: string): Chain | undefined => {
  return chains.find(chain => chain.id === id);
};

export const getChainsByIds = (ids: string[]): Chain[] => {
  return chains.filter(chain => ids.includes(chain.id));
};
