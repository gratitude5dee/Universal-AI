interface ChainBadgeProps {
  chain: string;
  size?: 'sm' | 'md';
}

export const ChainBadge = ({ chain, size = 'sm' }: ChainBadgeProps) => {
  const getChainColor = (chainName: string) => {
    const colors: Record<string, string> = {
      ethereum: 'bg-[#627EEA]/20 text-[#627EEA]',
      polygon: 'bg-[#8247E5]/20 text-[#8247E5]',
      arbitrum: 'bg-[#28A0F0]/20 text-[#28A0F0]',
      optimism: 'bg-[#FF0420]/20 text-[#FF0420]',
      base: 'bg-[#0052FF]/20 text-[#0052FF]',
      bsc: 'bg-[#F3BA2F]/20 text-[#F3BA2F]',
      '5irechain': 'bg-[#00D4FF]/20 text-[#00D4FF]',
    };
    return colors[chainName.toLowerCase()] || 'bg-white/10 text-white/70';
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border border-white/10 ${getChainColor(chain)} ${sizeClasses} font-medium`}>
      {chain.charAt(0).toUpperCase() + chain.slice(1)}
    </span>
  );
};
