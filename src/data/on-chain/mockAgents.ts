import { TradingAgent } from '@/types/on-chain';

export const mockTradingAgents: TradingAgent[] = [
  {
    id: 'agent-1',
    name: 'WZRD Trend Hunter',
    strategy: 'trend-following',
    status: 'active',
    chain: 'solana',
    managedAssets: ['WZRD', 'SOL'],
    portfolioValue: 15420,
    performance24h: 3.8,
    performanceAllTime: 42.5,
    trades24h: 7,
    successRate: 73.4,
    createdAt: '2024-09-15',
  },
  {
    id: 'agent-2',
    name: 'ETH DCA Bot',
    strategy: 'dca',
    status: 'active',
    chain: 'ethereum',
    managedAssets: ['ETH', 'USDC'],
    portfolioValue: 8250,
    performance24h: 1.2,
    performanceAllTime: 18.7,
    trades24h: 2,
    successRate: 98.5,
    createdAt: '2024-08-01',
  },
  {
    id: 'agent-3',
    name: 'Grid Trading Master',
    strategy: 'grid-trading',
    status: 'paused',
    chain: 'solana',
    managedAssets: ['SOL', 'USDC'],
    portfolioValue: 12100,
    performance24h: 0,
    performanceAllTime: 28.3,
    trades24h: 0,
    successRate: 82.1,
    createdAt: '2024-07-20',
  },
  {
    id: 'agent-4',
    name: 'Arbitrage Seeker',
    strategy: 'arbitrage',
    status: 'active',
    chain: 'polygon',
    managedAssets: ['MATIC', 'USDC', 'USDT'],
    portfolioValue: 5670,
    performance24h: 5.1,
    performanceAllTime: 34.2,
    trades24h: 15,
    successRate: 67.8,
    createdAt: '2024-10-01',
  },
];

export const getTotalManagedValue = () => {
  return mockTradingAgents.reduce((sum, agent) => sum + agent.portfolioValue, 0);
};

export const getActiveAgentsCount = () => {
  return mockTradingAgents.filter(agent => agent.status === 'active').length;
};

export const getTotalTrades24h = () => {
  return mockTradingAgents.reduce((sum, agent) => sum + agent.trades24h, 0);
};

export const getAveragePerformance24h = () => {
  const activeAgents = mockTradingAgents.filter(agent => agent.status === 'active');
  const total = activeAgents.reduce((sum, agent) => sum + agent.performance24h, 0);
  return total / activeAgents.length;
};
