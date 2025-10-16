export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

export const truncateAddress = (address: string, startChars: number = 4, endChars: number = 4): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return past.toLocaleDateString();
};

export const calculateAPY = (principal: number, rate: number, time: number = 1): number => {
  return principal * Math.pow(1 + rate / 100, time) - principal;
};

export const calculateImpermanentLoss = (priceChange: number): number => {
  // Simplified IL formula: 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
  const ratio = 1 + priceChange / 100;
  return (2 * Math.sqrt(ratio) / (1 + ratio) - 1) * 100;
};

export const getRiskColor = (risk: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: 'text-green-400 border-green-400',
    medium: 'text-yellow-400 border-yellow-400',
    high: 'text-red-400 border-red-400',
  };
  return colors[risk];
};

export const getChainColor = (chainId: string): string => {
  const colors: Record<string, string> = {
    solana: '#14F195',
    ethereum: '#627EEA',
    base: '#0052FF',
    polygon: '#8247E5',
    arbitrum: '#28A0F0',
    optimism: '#FF0420',
    bnb: '#F3BA2F',
    avalanche: '#E84142',
  };
  return colors[chainId] || '#888888';
};
