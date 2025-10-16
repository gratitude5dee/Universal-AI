import { AgentStrategy } from '@/types/on-chain';

export const tradingStrategies: AgentStrategy[] = [
  {
    id: 'dca',
    name: 'Dollar Cost Average',
    description: 'Automatically buy assets at regular intervals regardless of price, reducing timing risk',
    risk: 'low',
    complexity: 'low',
    bestFor: 'Long-term investors, beginners, volatile markets',
    icon: '📊',
  },
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Identify and ride market trends using moving averages and momentum indicators',
    risk: 'medium',
    complexity: 'medium',
    bestFor: 'Trending markets, momentum traders',
    icon: '📈',
  },
  {
    id: 'grid-trading',
    name: 'Grid Trading',
    description: 'Place buy and sell orders at predetermined intervals to profit from market volatility',
    risk: 'medium',
    complexity: 'medium',
    bestFor: 'Range-bound markets, sideways price action',
    icon: '🎯',
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage',
    description: 'Exploit price differences across exchanges and trading pairs for risk-free profit',
    risk: 'low',
    complexity: 'high',
    bestFor: 'Experienced traders, high-frequency trading',
    icon: '⚡',
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Buy when price is below average, sell when above, expecting return to mean',
    risk: 'medium',
    complexity: 'medium',
    bestFor: 'Range-bound markets, statistical traders',
    icon: '↩️',
  },
  {
    id: 'yield-optimizer',
    name: 'Yield Optimizer',
    description: 'Automatically move funds to highest-yielding DeFi protocols and farms',
    risk: 'low',
    complexity: 'low',
    bestFor: 'Passive income seekers, liquidity providers',
    icon: '🌾',
  },
];

export const getStrategyById = (id: string) => {
  return tradingStrategies.find(s => s.id === id);
};

export const getStrategiesByRisk = (risk: 'low' | 'medium' | 'high') => {
  return tradingStrategies.filter(s => s.risk === risk);
};
